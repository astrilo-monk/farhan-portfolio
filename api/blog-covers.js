import { listCovers, storageConfigured } from "../server/blogStore.js";

// GET /api/blog-covers -> { covers } (public)
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  if (!storageConfigured()) return res.status(503).json({ error: "The blog is not set up yet." });

  try {
    return res.status(200).json({ covers: await listCovers() });
  } catch {
    return res.status(500).json({ error: "Could not load cover images." });
  }
}
