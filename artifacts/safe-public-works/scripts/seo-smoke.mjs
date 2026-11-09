import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.TEST_ORIGIN || "http://127.0.0.1:4180";
const xml = await (await fetch(base + "/sitemap.xml")).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
assert.equal(urls.length, 33);
const titles = new Set(),
  descriptions = new Set();
for (const p of urls) {
  const response = await fetch(base + p);
  assert.equal(response.status, 200, p);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title, p);
  assert(!titles.has(title), "duplicate title " + p);
  titles.add(title);
  const desc = html.match(/<meta name="description" content="([^"]+)"/g);
  assert.equal(desc?.length, 1, p);
  assert(!descriptions.has(desc[0]), "duplicate description " + p);
  descriptions.add(desc[0]);
  assert(
    html.includes('href="https://safeevg.com' + p + '"'),
    p + " canonical",
  );
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(!html.includes("noindex"), p + " indexable");
  const schema = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert(schema["@graph"].some((x) => x["@type"] === "BreadcrumbList"));
}
for (const p of ["/missing-page-test", "/equipment/missing-model"]) {
  const response = await fetch(base + p);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, follow");
  assert((await response.text()).includes("noindex"));
}
for (const p of ["/robots.txt", "/llm.txt", "/llms.txt", "/brand-logo.webp"])
  assert.equal((await fetch(base + p)).status, 200, p);
const asset = fs
  .readdirSync("artifacts/safe-public-works/dist/public/assets")
  .find((x) => x.endsWith(".js"));
const compressed = await fetch(base + "/assets/" + asset, {
  headers: { "Accept-Encoding": "br" },
});
assert.equal(compressed.headers.get("content-encoding"), "br");
assert(compressed.headers.get("cache-control").includes("immutable"));
console.log(
  JSON.stringify(
    {
      pages: urls.length,
      uniqueTitles: titles.size,
      uniqueDescriptions: descriptions.size,
      canonical: true,
      jsonLd: true,
      real404: true,
      crawlerFiles: true,
      compression: true,
      immutableAssets: true,
    },
    null,
    2,
  ),
);
