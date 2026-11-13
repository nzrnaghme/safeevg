# SafeEVG / Safe Public Works

React + Vite website, Express API and PostgreSQL in a pnpm workspace. Source snapshot from Replit.

## Setup

Use Node.js 24 and pnpm. Run `pnpm install --frozen-lockfile`.

Frontend build (POSIX shell):
```sh
PORT=4184 BASE_PATH=/ pnpm --filter @workspace/safe-public-works build
PORT=4184 node artifacts/safe-public-works/serve.mjs
```

Development: set PORT and BASE_PATH=/ then run `pnpm --filter @workspace/safe-public-works dev`.

API: configure DATABASE_URL and SPW_ADMIN_PASSWORD (at least 8 characters) securely, then run `pnpm --filter @workspace/api-server dev`. Provision PostgreSQL with the schema in lib/db. Route /api to the API service; .replit describes the existing service routing. Never commit secrets.

## Data

Database records, customer inquiries and live CMS overrides are not included. Migrate approved CMS content separately when moving hosts.

## Domain

Prepared for https://safeevg.com. DNS has NOT been changed. Read artifacts/safe-public-works/DOMAIN-MIGRATION.md before publishing this branch.

## Verification

SEO smoke checks: artifacts/safe-public-works/scripts/seo-smoke.mjs. Sitemap is generated during build.
