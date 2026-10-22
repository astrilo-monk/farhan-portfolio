// Blog storage on Upstash Redis via its REST API (no extra dependency).
// Vercel's Upstash integration provides either UPSTASH_REDIS_REST_* or the
// older KV_REST_API_* variables, so both are supported.

const POSTS_KEY = "blog:posts";
const LIMIT_WINDOW_SECONDS = 600;

const redisUrl = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const storageConfigured = () => Boolean(redisUrl() && redisToken());

async function run(commands) {
  const response = await fetch(`${redisUrl().replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!response.ok) throw new Error(`Redis responded with ${response.status}`);

  const results = await response.json();
  const failed = results.find((entry) => entry.error);
  if (failed) throw new Error(failed.error);
  return results.map((entry) => entry.result);
}

export async function listPosts() {
  const [raw] = await run([["HGETALL", POSTS_KEY]]);
  const pairs = Array.isArray(raw) ? raw : Object.entries(raw || {}).flat();
  const posts = [];
  for (let i = 1; i < pairs.length; i += 2) {
    try {
      posts.push(JSON.parse(pairs[i]));
    } catch {
      // skip a corrupted entry instead of failing the whole list
    }
  }
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id) {
  const [raw] = await run([["HGET", POSTS_KEY, id]]);
  return raw ? JSON.parse(raw) : null;
}

export const savePost = (post) => run([["HSET", POSTS_KEY, post.id, JSON.stringify(post)]]);

export const deletePost = (id) => run([["HDEL", POSTS_KEY, id]]);

// ----- failed-login limiter (per IP) -----
const limitKey = (ip) => `blog:login-fails:${ip}`;

export async function failedAttempts(ip) {
  const [count] = await run([["GET", limitKey(ip)]]);
  return Number(count) || 0;
}

export async function recordFailure(ip) {
  const [count] = await run([["INCR", limitKey(ip)]]);
  if (count === 1) await run([["EXPIRE", limitKey(ip), LIMIT_WINDOW_SECONDS]]);
}

export const clearFailures = (ip) => run([["DEL", limitKey(ip)]]);
