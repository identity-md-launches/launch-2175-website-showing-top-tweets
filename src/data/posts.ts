import data from "./posts.json";
import snapshot from "./snapshot.json";

/** Curated public X post summaries. Captured metrics are a static snapshot; see artifacts/SOURCES.md. */
export type Category = "Building" | "Community" | "Ideas";

export interface Post {
  id: string;
  author: string;
  handle: string;
  url: string;
  date: string;
  summary: string;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  category: Category;
  tags: string[];
  avatar: string;
  rank: number;
}

export const snapshotDate = snapshot.snapshotDate;
export const snapshotCapturedAt = snapshot.capturedAt;

/** JSON records are validated by scripts/sync-sources.mjs before every production build. */
export const posts: Post[] = data as Post[];
