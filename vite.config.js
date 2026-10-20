import { defineConfig } from "vite";

// Mirrors the Vercel function at /api/leetcode so `npm run dev` works too.
function leetcodeDevApi() {
  return {
    name: "leetcode-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/leetcode", async (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        try {
          const { fetchLeetCode } = await import("./server/leetcode.js");
          res.end(JSON.stringify(await fetchLeetCode()));
        } catch (error) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [leetcodeDevApi()],
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
