import crypto from "node:crypto";
import { bearerToken, verifyToken } from "../server/blogAuth.js";
import { saveCover, saveImage, storageConfigured } from "../server/blogStore.js";

// Vercel functions accept request bodies up to ~4.5 MB, and base64 adds ~33%,
// so 2 MB of image is the safe ceiling.
const MAX_BYTES = 2 * 1024 * 1024;

// Allowed types, each verified by its real file signature (not just the label).
const SIGNATURES = {
  "image/webp": (b) => b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
  "image/jpeg": (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/gif": (b) => b.length > 6 && ["GIF87a", "GIF89a"].includes(b.toString("ascii", 0, 6))
};

// POST /api/blog-upload  { type, data: <base64>, cover?, label? }  ->  { id, url, cover? }   (token required)
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!storageConfigured()) return res.status(503).json({ error: "The blog is not set up yet." });
  if (!verifyToken(bearerToken(req))) return res.status(401).json({ error: "Unlock the blog first." });

  const type = typeof req.body?.type === "string" ? req.body.type : "";
  const data = typeof req.body?.data === "string" ? req.body.data : "";
  const isCover = req.body?.cover === true;
  const label = typeof req.body?.label === "string" ? req.body.label.trim().slice(0, 60) : "custom cover";

  if (!SIGNATURES[type]) return res.status(400).json({ error: "Only JPEG, PNG, WebP and GIF images are allowed." });
  if (!data || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return res.status(400).json({ error: "Invalid image data." });

  const bytes = Buffer.from(data, "base64");
  if (bytes.length > MAX_BYTES) {
    return res.status(413).json({ error: `Image is too big (max ${MAX_BYTES / 1024 / 1024} MB after shrinking).` });
  }
  if (!SIGNATURES[type](bytes)) return res.status(400).json({ error: "That file is not really a valid image." });

  try {
    const id = crypto.randomBytes(8).toString("hex");
    const url = `/api/blog-image?id=${id}`;
    const record = { type, data, size: bytes.length, createdAt: new Date().toISOString() };
    await saveImage(id, record);
    if (isCover) {
      await saveCover(id, { id: `cover:${id}`, label, src: url, tilt: "0deg", createdAt: record.createdAt });
    }
    return res.status(201).json({
      id,
      url,
      ...(isCover ? { cover: { id: `cover:${id}`, label, src: url, tilt: "0deg" } } : {})
    });
  } catch {
    return res.status(500).json({ error: "Could not save the image." });
  }
}
