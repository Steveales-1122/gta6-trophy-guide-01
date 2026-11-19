// Serves app/ on http://localhost:8080 for trying the guide in a desktop
// browser. Static files only, no build step, no network at run time.
//   node serve.ts
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "app");
const port = Number(process.env.PORT || 8080);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const path = normalize(join(appDir, decodeURIComponent((req.url || "/").split("?")[0])));
    const file = path.endsWith("/") || path === appDir ? join(path, "index.html") : path;
    if (!file.startsWith(appDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log("Sunset Platinum at http://localhost:" + port);
});
