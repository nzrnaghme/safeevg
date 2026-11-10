import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "dist/public",
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};
const cache = new Map();
const server = http.createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method || "")) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end();
  }
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
  }
  let target = path.resolve(root, "." + pathname);
  if (!target.startsWith(root + path.sep) && target !== root) {
    res.writeHead(403);
    return res.end();
  }
  let status = 200;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory())
    target = path.join(target, "index.html");
  if (pathname === "/admin") target = path.join(root, "404.html");
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    status = 404;
    target = path.join(root, "404.html");
  }
  const type = mime[path.extname(target)] || "application/octet-stream";
  const headers = {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": (pathname.startsWith("/assets/") || pathname.startsWith("/fonts/") || pathname.startsWith("/site-images/psi-v1-"))
      ? "public, max-age=31536000, immutable"
      : type.startsWith("text/html")
        ? "no-cache"
        : "public, max-age=3600",
  };
  if (status === 404 || pathname.startsWith("/admin"))
    headers["X-Robots-Tag"] = "noindex, follow";
  let data = cache.get(target);
  if (!data) {
    const raw = fs.readFileSync(target);
    const compress = /text|javascript|json|xml|svg/.test(type);
    data = {
      raw,
      gzip: compress ? gzipSync(raw) : null,
      br: compress ? brotliCompressSync(raw) : null,
    };
    cache.set(target, data);
  }
  let body = data.raw;
  const accept = req.headers["accept-encoding"] || "";
  if (data.br && /\bbr\b/.test(accept)) {
    headers["Content-Encoding"] = "br";
    body = data.br;
  } else if (data.gzip && /\bgzip\b/.test(accept)) {
    headers["Content-Encoding"] = "gzip";
    body = data.gzip;
  }
  headers.Vary = "Accept-Encoding";
  headers["Content-Length"] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === "HEAD" ? undefined : body);
});
server.listen(Number(process.env.PORT || 22695), "0.0.0.0", () =>
  console.log("Safeevg production server ready"),
);
