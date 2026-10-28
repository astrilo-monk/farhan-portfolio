import { clientIp, issueToken, passwordConfigured, passwordMatches } from "../server/blogAuth.js";
import { clearFailures, failedAttempts, recordFailure, storageConfigured } from "../server/blogStore.js";

const MAX_FAILURES = 5;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// POST /api/blog-login  { password }  ->  { token, expiresAt }
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!passwordConfigured() || !storageConfigured()) {
    return res.status(503).json({ error: "The blog is not set up yet." });
  }

  const ip = clientIp(req);
  try {
    if ((await failedAttempts(ip)) >= MAX_FAILURES) {
      return res.status(429).json({ error: "Too many wrong attempts. Try again in 10 minutes." });
    }

    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!password || !passwordMatches(password)) {
      await recordFailure(ip);
      await sleep(400); // small delay slows down guessing
      return res.status(401).json({ error: "Wrong password." });
    }

    await clearFailures(ip);
    return res.status(200).json(issueToken());
  } catch (error) {
    // If the limiter store is down we fail closed rather than allow unlimited guesses.
    console.error("Blog login storage error:", error instanceof Error ? error.message : error);
    return res.status(503).json({ error: "Login is unavailable right now. Try again shortly." });
  }
}
