export const MOODS = [
  { id: "hamster", label: "hamster", src: "/blog/hamster.webp", tilt: "-3deg" },
  { id: "glasses", label: "glasses", src: "/blog/glasses.webp", tilt: "2.5deg" },
  { id: "writer", label: "writer", src: "/blog/writer.webp", tilt: "-2deg" },
  { id: "drool", label: "drool", src: "/blog/drool.webp", tilt: "3deg" }
];

export const getMood = (id) => MOODS.find((mood) => mood.id === id) || MOODS[0];

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // non-JSON error body
  }
  if (!response.ok) throw new ApiError(data?.error || `Request failed (${response.status})`, response.status);
  return data;
}

export const fetchPosts = () => request("/api/blog").then((data) => data.posts);
export const fetchPost = (id) => request(`/api/blog?id=${encodeURIComponent(id)}`).then((data) => data.post);
export const login = (password) => request("/api/blog-login", { method: "POST", body: { password } });
export const createPost = (token, input) => request("/api/blog", { method: "POST", token, body: input }).then((d) => d.post);
export const updatePost = (token, id, input) =>
  request(`/api/blog?id=${encodeURIComponent(id)}`, { method: "PUT", token, body: input }).then((d) => d.post);
export const removePost = (token, id) => request(`/api/blog?id=${encodeURIComponent(id)}`, { method: "DELETE", token });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const readingMinutes = (text) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

export const excerpt = (markdown, length = 150) => {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}...` : plain;
};
