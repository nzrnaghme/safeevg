import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import {
  pages,
  missingPage,
  normalizePath,
  SITE_URL,
  structuredData,
} from "./src/lib/seo-data";
const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
export function pageHtml(html: string, url: string) {
  const p = normalizePath(url),
    meta = pages[p] || missingPage;
  html = html
    .replace(/<link[^>]*rel="preload"[^>]*>/gi, "")
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(
      /<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[\s\S]*?>/gi,
      "",
    )
    .replace(/<link[^>]*rel="canonical"[^>]*>/gi, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");
  const tags = [
'<link rel="preload" as="fetch" href="/api/site-content" crossorigin>',
    "<title>" + escape(meta.title) + "</title>",
    '<meta name="description" content="' + escape(meta.description) + '">',
    '<meta name="robots" content="' +
      (pages[p] ? "index, follow" : "noindex, follow") +
      '">',
    '<link rel="canonical" href="' + escape(SITE_URL + p) + '">',
  ];
  for (const [key, value] of Object.entries({
    "og:title": meta.title,
    "og:description": meta.description,
    "og:url": SITE_URL + p,
    "og:type": "website",
    "og:image": SITE_URL + "/brand-logo.webp",
  }))
    tags.push('<meta property="' + key + '" content="' + escape(value) + '">');
  for (const [key, value] of Object.entries({
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:card": "summary",
    "twitter:image": SITE_URL + "/brand-logo.webp",
  }))
    tags.push('<meta name="' + key + '" content="' + escape(value) + '">');
  if (p === "/")
    tags.push(
      '<link rel="preload" as="image" href="/site-images/psi-v1-1.webp" fetchpriority="high">',
    );
  const data = structuredData(p);
  if (data)
    tags.push(
      '<script type="application/ld+json">' +
        JSON.stringify(data).replace(/</g, "\u003c") +
        "</script>",
    );
  return html.replace("</head>", tags.join("\n") + "\n</head>");
}
export default function seoPlugin(): Plugin {
  let outDir = "";
  return {
    name: "evg-page-seo",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        return pageHtml(html, context.originalUrl || context.path || "/");
      },
    },
    closeBundle() {
      const entry = path.join(outDir, "index.html");
      if (!fs.existsSync(entry)) return;
      const template = fs.readFileSync(entry, "utf8");
      for (const route of Object.keys(pages)) {
        const file = path.join(
          outDir,
          route === "/" ? "index.html" : route.slice(1) + "/index.html",
        );
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, pageHtml(template, route));
      }
      fs.writeFileSync(
        path.join(outDir, "404.html"),
        pageHtml(template, "/404"),
      );
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
          Object.keys(pages)
            .map((p) => "<url><loc>" + SITE_URL + p + "</loc></url>")
            .join("") +
          "</urlset>",
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const p = normalizePath(req.url || "/");
        if (
          p.startsWith("/api/") ||
          p.startsWith("/assets/") ||
          path.extname(p)
        )
          return next();
        const known = !!pages[p] || p === "/admin";
        res.statusCode = known ? 200 : 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        if (!known || p === "/admin")
          res.setHeader("X-Robots-Tag", "noindex, follow");
        const file = path.join(
          outDir,
          pages[p]
            ? p === "/"
              ? "index.html"
              : p.slice(1) + "/index.html"
            : "404.html",
        );
        res.end(pageHtml(fs.readFileSync(file, "utf8"), p));
      });
    },
  };
}
