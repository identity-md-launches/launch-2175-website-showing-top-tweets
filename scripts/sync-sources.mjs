import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const posts = JSON.parse(await readFile(resolve(root, 'src/data/posts.json'), 'utf8'));
const snapshot = JSON.parse(await readFile(resolve(root, 'src/data/snapshot.json'), 'utf8'));
const { snapshotDate, capturedAt } = snapshot;

if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate) || !Number.isFinite(Date.parse(snapshotDate))) {
  throw new Error('snapshotDate must be an ISO calendar date.');
}
if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(capturedAt) || !Number.isFinite(Date.parse(capturedAt)) || !capturedAt.startsWith(snapshotDate)) {
  throw new Error('capturedAt must be the recorded UTC capture time on snapshotDate.');
}
for (const key of ['method', 'verificationLimitations', 'sourceApiPattern']) {
  if (typeof snapshot[key] !== 'string' || !snapshot[key].trim()) throw new Error(`Snapshot metadata needs ${key}.`);
}
if (!Array.isArray(posts) || posts.length === 0) throw new Error('Posts must be a nonempty array.');

const ids = new Set();
for (const [index, post] of posts.entries()) {
  const label = `Post ${index + 1}`;
  if (!post || typeof post !== 'object' || Array.isArray(post)) throw new Error(`${label} must be an object.`);
  if (typeof post.id !== 'string' || !/^\d{17,20}$/.test(post.id) || ids.has(post.id)) throw new Error(`${label} has an invalid or duplicate id.`);
  ids.add(post.id);
  if (typeof post.handle !== 'string' || !/^[A-Za-z0-9_]{1,15}$/.test(post.handle)) throw new Error(`${label} has an invalid handle.`);
  if (post.url !== `https://x.com/${post.handle}/status/${post.id}`) throw new Error(`${label} URL must match its handle and id.`);
  for (const key of ['author', 'summary']) {
    if (typeof post[key] !== 'string' || !post[key].trim()) throw new Error(`${label} needs a ${key}.`);
  }
  if (typeof post.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(post.date) || !Number.isFinite(Date.parse(post.date)) || Date.parse(post.date) > Date.parse(capturedAt)) {
    throw new Error(`${label} needs a valid UTC creation date no later than the capture time.`);
  }
  for (const key of ['likes', 'reposts', 'replies', 'views']) {
    if (!Number.isSafeInteger(post[key]) || post[key] < 0) throw new Error(`${label} ${key} must be a nonnegative captured integer.`);
  }
  if (!['Building', 'Community', 'Ideas'].includes(post.category)) throw new Error(`${label} has an unsupported category.`);
  if (!Array.isArray(post.tags) || post.tags.length !== 2 || post.tags.some(tag => typeof tag !== 'string' || !tag.trim()) || new Set(post.tags).size !== post.tags.length) {
    throw new Error(`${label} must have two distinct topic tags.`);
  }
  if (post.rank !== index + 1 || (index > 0 && posts[index - 1].likes < post.likes)) throw new Error(`${label} rank must follow descending captured likes.`);
  if (post.avatar !== `./avatars/${post.handle.toLowerCase()}.webp`) throw new Error(`${label} must use its bundled local WebP avatar.`);
  const avatar = resolve(root, 'public', post.avatar.slice(2));
  const avatarStat = await stat(avatar);
  const avatarBytes = await readFile(avatar);
  if (avatarStat.size > 60000 || avatarBytes.subarray(0, 4).toString() !== 'RIFF' || avatarBytes.subarray(8, 12).toString() !== 'WEBP') {
    throw new Error(`${label} avatar must be a WebP file of no more than 60,000 bytes.`);
  }
}

await mkdir(resolve(root, 'public'), { recursive: true });
await writeFile(resolve(root, 'public/sources.json'), `${JSON.stringify({ ...snapshot, posts }, null, 2)}\n`);
console.log(`Validated ${posts.length} posts and synchronized public/sources.json (captured ${capturedAt}).`);
