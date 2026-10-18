import assert from "node:assert/strict";
import { readdir, lstat } from "node:fs/promises";
import { join, relative } from "node:path";

const groups = { export: 0, sourceAndPublic: 0, documentationAndConfig: 0 };
const skipped = new Set([".git", ".imd", "node_modules", ".vite", ".cache", ".npm", ".playwright-mcp"]);
const files = [];
async function walk(folder = ".") {
  for (const name of await readdir(folder)) {
    const file = join(folder, name);
    const path = relative(".", file).split("\\").join("/");
    if (skipped.has(name) || path === "test/scratch" || name.endsWith(".tsbuildinfo")) continue;
    const info = await lstat(file);
    assert.ok(!info.isSymbolicLink(), `Submission must not depend on symlink: ${path}`);
    if (info.isDirectory()) { await walk(file); continue; }
    assert.ok(!/\.(tgz|tar|zip)$/i.test(name), `Unnecessary archive: ${path}`);
    assert.ok(!/(^|\/)\.env(?:\.|$)/.test(path), `Unexpected environment file: ${path}`);
    const group = path.startsWith("dist/") ? "export" : /^(src|public)\//.test(path) ? "sourceAndPublic" : "documentationAndConfig";
    groups[group] += info.size;
    files.push({ path, bytes: info.size });
  }
}
await walk();
const allocations = { export: 3 * 1024 ** 2, sourceAndPublic: 3 * 1024 ** 2, documentationAndConfig: 2 * 1024 ** 2 };
for (const [group, bytes] of Object.entries(groups)) assert.ok(bytes <= allocations[group], `${group} exceeds its explicit path allocation`);
const total = Object.values(groups).reduce((a, b) => a + b, 0);
assert.ok(total < 8388608, `Submission exceeds 8 MiB: ${total}`);
assert.ok(files.some(file => file.path === "dist/index.html"), "Missing production entry");
assert.ok(files.some(file => file.path === "package-lock.json"), "Missing lockfile");
console.log(JSON.stringify({ passed: true, totalBytes: total, maximumBytes: 8388608, groups, allocations, fileCount: files.length }, null, 2));
