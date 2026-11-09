# Vercel deployment

Configuration prepared. Account connection, database setup, deployment tests and DNS cutover remain pending.

Import nzrnaghme/safeevg, repository root directory, Node.js 24. vercel.json sets install/build/output. Static pages preserve per-route SEO and custom 404.html. Do not add a catch-all SPA rewrite.

## Git workflow

Set product as production branch; main currently contains only README. Feature PRs target product. PRs receive previews; merging to product triggers production deployment. Opening a PR alone must not replace the public site.

## Environment

Configure DATABASE_URL for PostgreSQL reachable from Vercel and SPW_ADMIN_PASSWORD (at least 16 characters) in Vercel Environment Variables, never in Git. Use a separate preview database. Replit-local database addresses cannot be reused; migrate the schema and approved CMS content to an external database. Do not copy customer inquiries without a deliberate migration. Admin login throttling currently uses process memory; add shared or platform rate limiting for serverless production.

## Verification and domain

Test all public routes, canonical tags, sitemap, real HTTP 404, images and mobile navigation. Test /api/healthz, /api/site-content, quote submission, and admin login/save/logout against the intended database. Add safeevg.com and www.safeevg.com to the project and use Vercel's exact DNS instructions in Wix. Preserve email DNS records. Keep Replit running until HTTPS and the full application pass live checks.
