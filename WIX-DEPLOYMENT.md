# Wix deployment

This repository publishes the manually coded website to the Wix-managed Headless site **Safeevg Code** (site ID `3058f9e8-d442-4606-8f0a-0389051f794f`). The production domain is https://www.safeevg.com; the apex domain redirects there.

## Automatic releases

The `Wix website` GitHub Actions workflow validates pull requests targeting `main`. A push or merged pull request to `main` builds, typechecks and checks the generated routes, then publishes the build to Wix. Opening a pull request alone does not publish. A manual workflow run on `main` can retry a release; other branches cannot publish.

The repository must have an Actions secret named `WIX_API_KEY`, containing a Wix API key scoped to Safeevg Code with Wix CLI - Git Integration permission. Never commit the key, Wix login files or database credentials. Only trusted collaborators should be allowed to change workflows and merge to `main`.

Successful releases check the homepage, contact, equipment and privacy routes on the production domain. Check both `build` and `deploy` jobs before treating a release as complete.

## Local verification

Use Node 24.22.1 and pnpm 10.28.2:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec tsc --build
pnpm --filter @workspace/safe-public-works typecheck
node scripts/build-wix.mjs
node scripts/check-wix-build.mjs
```

The generated worker serves page HTML and custom 404 responses. This workflow does not deploy the Replit Express API or migrate a database. The repository's static form prepares a local project brief; deployment does not itself establish Supabase submission. Wix controls its sitemap and robots endpoints separately.

## Recovery

Build or validation failures prevent deployment. For authentication failures, check the secret and its site permissions. Deployments are serialized. To roll back, revert the unwanted commit on `main` and let the workflow publish the resulting code.

Domain DNS and business email records are not changed by this workflow.
