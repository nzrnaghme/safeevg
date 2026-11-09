import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import {
  pages,
  missingPage,
  normalizePath,
  SITE_URL,
  structuredData,
} from "@/lib/seo-data";
export default function PageSeo() {
  const [location] = useLocation();
  useLayoutEffect(() => {
    const path = normalizePath(location);
    const meta = pages[path] || missingPage;
    document.title = meta.title;
    const set = (
      selector: string,
      attrs: Record<string, string>,
      tag = "meta",
    ) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement(tag);
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) =>
        element!.setAttribute(key, value),
      );
    };
    set('meta[name="description"]', {
      name: "description",
      content: meta.description,
    });
    set('meta[name="robots"]', {
      name: "robots",
      content: pages[path] ? "index, follow" : "noindex, follow",
    });
    set(
      'link[rel="canonical"]',
      { rel: "canonical", href: SITE_URL + path },
      "link",
    );
    for (const [key, value] of Object.entries({
      "og:title": meta.title,
      "og:description": meta.description,
      "og:url": SITE_URL + path,
      "og:type": "website",
      "og:image": SITE_URL + "/brand-logo.webp",
    }))
      set('meta[property="' + key + '"]', { property: key, content: value });
    for (const [key, value] of Object.entries({
      "twitter:title": meta.title,
      "twitter:description": meta.description,
      "twitter:card": "summary",
      "twitter:image": SITE_URL + "/brand-logo.webp",
    }))
      set('meta[name="' + key + '"]', { name: key, content: value });
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((el) => el.remove());
    const data = structuredData(path);
    if (data) {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.textContent = JSON.stringify(data).replace(/</g, "\u003c");
      document.head.appendChild(el);
    }
  }, [location]);
  return null;
}
