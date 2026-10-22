import crypto from "node:crypto";
import { bearerToken, verifyToken } from "../server/blogAuth.js";
import { deleteImages, deletePost, getPost, listPosts, savePost, storageConfigured } from "../server/blogStore.js";

const MOODS = ["hamster", "glasses", "writer", "drool"];
const TITLE_MAX = 120;
const BODY_MAX = 20000;

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

// Uploaded images are referenced in posts as /api/blog-image?id=<16 hex>.
const imageIds = (text) => new Set([...text.matchAll(/\/api\/blog-image\?id=([a-f0-9]{16})/g)].map((m) => m[1]));

// Delete images that no remaining post still uses (best effort, never blocks the main action).
async function pruneImages(removed, otherBodies) {
  if (removed.size === 0) return;
  try {
    const stillUsed = new Set(otherBodies.flatMap((body) => [...imageIds(body)]));
    await deleteImages([...removed].filter((id) => !stillUsed.has(id)));
  } catch {
    // an orphaned image is harmless
  }
}

const otherPostBodies = async (id) => (await listPosts()).filter((post) => post.id !== id).map((post) => post.body);

function readInput(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const text = typeof body?.body === "string" ? body.body.replace(/\r\n/g, "\n").trim() : "";
  const mood = MOODS.includes(body?.mood) ? body.mood : "hamster";

  if (!title) return { error: "Give the post a title." };
  if (title.length > TITLE_MAX) return { error: `Title is too long (max ${TITLE_MAX} characters).` };
  if (!text) return { error: "The post is empty." };
  if (text.length > BODY_MAX) return { error: `Post is too long (max ${BODY_MAX} characters).` };
  return { title, body: text, mood };
}

// GET    /api/blog          -> { posts }            (public)
// GET    /api/blog?id=...   -> { post }             (public)
// POST   /api/blog          -> create               (token required)
// PUT    /api/blog?id=...   -> update               (token required)
// DELETE /api/blog?id=...   -> delete               (token required)
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!storageConfigured()) return res.status(503).json({ error: "The blog is not set up yet." });

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (id && !/^[a-z0-9-]{1,80}$/.test(id)) return res.status(400).json({ error: "Bad post id." });

  try {
    if (req.method === "GET") {
      if (id) {
        const post = await getPost(id);
        return post ? res.status(200).json({ post }) : res.status(404).json({ error: "Post not found." });
      }
      return res.status(200).json({ posts: await listPosts() });
    }

    if (!["POST", "PUT", "DELETE"].includes(req.method)) {
      return res.status(405).json({ error: "Method not allowed." });
    }

    // Every write needs a valid, unexpired token from /api/blog-login.
    if (!verifyToken(bearerToken(req))) {
      return res.status(401).json({ error: "Unlock the blog first." });
    }

    if (req.method === "POST") {
      const input = readInput(req.body);
      if (input.error) return res.status(400).json({ error: input.error });

      const now = new Date().toISOString();
      const post = {
        id: `${slugify(input.title) || "post"}-${crypto.randomBytes(3).toString("hex")}`,
        ...input,
        createdAt: now,
        updatedAt: now
      };
      await savePost(post);
      return res.status(201).json({ post });
    }

    if (!id) return res.status(400).json({ error: "Missing post id." });
    const existing = await getPost(id);
    if (!existing) return res.status(404).json({ error: "Post not found." });

    if (req.method === "PUT") {
      const input = readInput(req.body);
      if (input.error) return res.status(400).json({ error: input.error });

      const post = { ...existing, ...input, updatedAt: new Date().toISOString() };
      await savePost(post);

      const kept = imageIds(post.body);
      const removed = new Set([...imageIds(existing.body)].filter((imageId) => !kept.has(imageId)));
      if (removed.size) await pruneImages(removed, [...(await otherPostBodies(id)), post.body]);
      return res.status(200).json({ post });
    }

    await deletePost(id);
    await pruneImages(imageIds(existing.body), await otherPostBodies(id));
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Something went wrong on the server." });
  }
}
