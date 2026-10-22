import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";

// Mirrors Vercel's /api/* functions for `npm run dev` and `npm run preview`,
// so the same handlers in /api work locally. Env vars come from .env.local.
function localApi(mode) {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  const makeMiddleware = (loadModule) => async (req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    const match = url.pathname.match(/^\/api\/([a-z0-9-]+)$/i);
    if (!match) return next();

    const file = path.resolve(process.cwd(), "api", `${match[1]}.js`);
    if (!fs.existsSync(file)) return next();

    req.query = Object.fromEntries(url.searchParams);
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      try {
        req.body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
      } catch {
        req.body = {};
      }
    }

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };

    try {
      const mod = await loadModule(file);
      await mod.default(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.json({ error: error.message });
    }
  };

  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(makeMiddleware((file) => server.ssrLoadModule(file)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(makeMiddleware((file) => import(pathToFileURL(file).href)));
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [localApi(mode)],
  server: {
    host: "0.0.0.0",
    port: 5173
  }
}));
