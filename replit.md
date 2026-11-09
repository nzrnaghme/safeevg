# Safe Public Works

Customer-facing solar and EV charging website with a project quote request form.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/safe-public-works run dev` — run the website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/safe-public-works` — public-facing website and quote form
- `artifacts/api-server` — shared API, including quote request submissions
- `lib/api-spec/openapi.yaml` — API contract
- `lib/db/src/schema` — database schema

## Architecture decisions

- Quote requests are validated against the generated API schema and stored in the project PostgreSQL database.
- Quote request submissions are not emailed; the form confirms only after the API has saved the request.

## Product

The website introduces Safe Public Works' solar and EV charging services for residential and commercial properties. Visitors can request a quote using only their name and email address.

## User preferences

- Use the supplied Safe Public Works website image as the visual reference.

## Gotchas

Quote request submissions include personal contact information; do not log request bodies or expose submissions publicly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
