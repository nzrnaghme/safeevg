import { useEffect } from 'react';
export default function NotFound() {
 useEffect(() => {
 document.title = 'Page not found | EVG';
 const previous = document.querySelector('meta[name="robots"]');
 const saved = previous?.getAttribute('content');
 const robots = previous || document.createElement('meta');
 robots.setAttribute('name','robots'); robots.setAttribute('content','noindex, follow');
 if (!previous) document.head.appendChild(robots);
 return () => { if(previous) robots.setAttribute('content', saved || 'index, follow'); else robots.remove(); };
 }, []);
 return <section className="flex min-h-[75vh] items-center bg-[#f7f4ec] px-6 py-20 text-[#202c33]" aria-labelledby="missing-page-title"><div className="mx-auto w-full max-w-3xl"><a href="/" className="mb-12 inline-flex items-center gap-3 font-bold"><img src="/brand-logo.webp" alt="EVG" width="40" height="40"/>EVG</a><nav aria-label="Breadcrumb" className="mb-8 text-sm"><a href="/" className="underline">Home</a><span aria-hidden="true"> / </span><span aria-current="page">Page not found</span></nav><p className="mb-4 text-sm font-semibold tracking-widest text-[#ac4d1b]">ERROR 404</p><h1 id="missing-page-title" className="text-4xl font-medium leading-tight tracking-tight sm:text-6xl">Let’s get you back<br/>on the right path.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[#626c67]">This page may have moved, or the address may be incorrect. Explore our charging solutions or tell us about your project.</p><div className="mt-9 flex flex-wrap gap-4"><a href="/" className="rounded bg-[#f66c16] px-6 py-4 font-semibold">Back to home ↗</a><a href="/ev-charging" className="rounded border border-[#aeb7b0] px-6 py-4 font-semibold">Explore EV charging ↗</a><a href="/contact" className="px-6 py-4 underline">Contact EVG</a></div></div></section>;
}
