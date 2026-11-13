# Wix deployment

This repository publishes the manually coded website to Wix-managed Headless.
Database/backend migration is separate; this deployment does not deploy the Replit Express API.

## One-time setup

Create a Wix automation API key in the account that owns **Safeevg Code**, with the permissions required by the Wix Headless CLI to release this site. Store it in GitHub repository Settings → Secrets and variables → Actions as **WIX_API_KEY**. Never commit the key, local Wix login files, or database credentials.

Merge this branch into `main`. The Wix website workflow builds and checks pull requests without deployment credentials. Pushes/merges to `main` publish only after a successful build. A manual run on `main` can retry a deployment. Other branches cannot deploy.

The initial `main` merge includes the current branding changes from `product` and the Wix hosting adapter. Publishing does not connect or purchase a custom domain. The current target is https://safeevg-code-hoomansse-0c09.wix-site-host.com.

## Local verification

Use Node 24.22.1+ and pnpm 10.28.2:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec tsc --build
pnpm --filter @workspace/safe-public-works typecheck
node scripts/build-wix.mjs
node scripts/check-wix-build.mjs
```

The worker serves generated page HTML and custom 404 responses. Wix controls `/robots.txt` and `/sitemap.xml`; those require Wix SEO configuration separately. The static form currently prepares a local project brief; this workflow does not claim that Supabase form submission is connected.

## Recovery

If build/checks fail, the current live site is untouched. If authentication fails, check the repository secret and API-key permissions. To revert a published change, revert its commit on `main`; the successful workflow republishes the resulting code. Deployments are serialized so a running release is not interrupted.
