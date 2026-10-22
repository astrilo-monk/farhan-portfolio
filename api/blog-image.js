import { getImage, storageConfigured } from "../server/blogStore.js";

// GET /api/blog-image?id=<16 hex>  ->  the image bytes (public)
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  if (!storageConfigured()) return res.status(503).json({ error: "The blog is not set up yet." });

  const id = typeof req.query?.id === "string" ? req.query.id : "";
  if (!/^[a-f0-9]{16}$/.test(id)) return res.status(400).json({ error: "Bad image id." });

  try {
    const image = await getImage(id);
    if (!image) return res.status(404).json({ error: "Image not found." });

    const bytes = Buffer.from(image.data, "base64");
    res.statusCode = 200;
    res.setHeader("Content-Type", image.type);
    res.setHeader("Content-Length", bytes.length);
    // Ids never change content, so the CDN and browsers can keep it for a year.
    res.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    res.end(bytes);
  } catch {
    res.status(500).json({ error: "Could not load the image." });
  }
}
