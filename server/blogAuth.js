import crypto from "node:crypto";

// The blog password lives ONLY in the BLOG_PASSWORD environment variable on the
// server. It is never sent to the browser. Logging in swaps the password for a
// short-lived signed token; every write request must carry a valid token.

const TOKEN_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

export const passwordConfigured = () => {
  const pw = process.env.BLOG_PASSWORD;
  return typeof pw === "string" && pw.length >= 8;
};

const sha256 = (value) => crypto.createHash("sha256").update(String(value)).digest();

// Hash both sides so lengths match, then compare in constant time.
export const passwordMatches = (input) => crypto.timingSafeEqual(sha256(input), sha256(process.env.BLOG_PASSWORD));

// Signing key is derived from the password, so changing BLOG_PASSWORD
// instantly invalidates every token that was already issued.
const signingKey = () => crypto.createHmac("sha256", process.env.BLOG_PASSWORD).update("blog-token-v1").digest();

const sign = (payload) => crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");

export function issueToken() {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifyToken(token) {
  if (!token || !passwordConfigured()) return false;
  const [payload, signature] = String(token).split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return false;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).exp > Date.now();
  } catch {
    return false;
  }
}

export const bearerToken = (req) => String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");

export const clientIp = (req) =>
  String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
