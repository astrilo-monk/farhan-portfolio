import { fetchLeetCode } from "../server/leetcode.js";

// Vercel serverless function: GET /api/leetcode
export default async function handler(req, res) {
  try {
    const data = await fetchLeetCode();
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
