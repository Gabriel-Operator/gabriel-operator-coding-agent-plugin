# Move your Studio UI

This project hosts the app interface on your chosen host. Gabriel continues to run agents, connectors, data, access checks and assistant allowances. Internal Gabriel hosting remains available. There are no Google or Gabriel account credentials in the export.

The installation must exist on a stable, reachable Gabriel HTTPS backend and be explicitly shared as Public. An external frontend pointing at an expiring tunnel will also stop working when that tunnel expires. Owner-only and Gabriel-sign-in exports are not supported in this first version; use internal Gabriel hosting for those modes.

`app/` contains the installed bundled interface and manifest. Studio downloads contain the deployed JavaScript, not the original unbundled project. The skill CLI export also includes your local `src/` and build files. Edit the UI, then run `npm run build`. For a CLI export with an original build script, first run `npm --prefix app ci --ignore-scripts` (or `npm --prefix app install --ignore-scripts` without a lockfile). Review dependencies before building. The build script regenerates `public/app.html` in the same scripts-only sandbox used by Studio.

Changing connector operations or the installed manifest requires registering and adopting a new package in Gabriel, reviewing sharing again, and exporting its current revision. A revision change or revoked sharing stops this exported bridge. To update the installed UI, rebuild and pack your app with the Studio builder, then import its package in Customize → Code and hosting.

## Vercel

Import this directory into a Vercel project, or run `npx vercel` from it. The included `vercel.json` builds the static UI and narrow Node functions. Use a Node 22 runtime. `GABRIEL_BACKEND_URL` can override the origin in `gabriel-host.json`. Do not add any account tokens. Provider limits and billing depend on your plan.

## Railway

Connect this directory's Git repository to Railway, or use the Railway CLI. Its Dockerfile and `railway.json` start a small Node server; Railway supplies `PORT`. Generate a public domain in the service networking settings. Set `GABRIEL_BACKEND_URL` to your stable Gabriel backend if it differs from the exported value.

## Cloudflare Workers

The export includes `wrangler.jsonc` and `worker.mjs`. Cloudflare Workers serves the static UI and forwards the scoped app API to Gabriel. Run these commands from the export root with Node 22 or newer:

```sh
npx wrangler@4 dev
npx wrangler@4 deploy --dry-run
```

`wrangler dev` builds the UI and opens a local preview, using the HTTPS Gabriel origin in `gabriel-host.json`. A dry run bundles the Worker for validation. To override the backend, set `GABRIEL_BACKEND_URL` under `vars` in `wrangler.jsonc`, in the Worker's Cloudflare settings, or in `.dev.vars` for local development.

When ready to publish, run `npx wrangler@4 deploy` under the Cloudflare account you want to use. Sign in with `npx wrangler@4 login`, or set `CLOUDFLARE_API_TOKEN` and, for account selection, `CLOUDFLARE_ACCOUNT_ID` in your shell or CI secrets. These are Wrangler deployment credentials. The app Worker does not need Cloudflare or Gabriel account credentials. If using Workers Builds from a Git repository, set `npm run build` as the build command and `npx wrangler@4 deploy` as the deploy command.

Use the stable `workers.dev` URL or attach a custom domain. Add that origin in Customize → Code and hosting to verify it and update phone QR codes. The Worker needs a stable Gabriel backend with the exported public app revision, including when you use a custom domain.

## Google Cloud / AWS

Build the included Dockerfile and deploy it as an HTTP container to Cloud Run, or to AWS App Runner/ECS. Use port 8080 (or configure `PORT`), HTTPS and the same backend origin. No provider-specific runtime SDK is required. Deployment remains under your own cloud account and billing.

## Local verification

Run `npm run build`, then `npm start` and open http://localhost:8080. To test against a local Gabriel backend, set `GABRIEL_BACKEND_URL=http://localhost:3200` and run `npm run dev`. A localhost address is for development and cannot be used as a phone URL.

After deployment, open the public URL in a fresh browser, test connector reads and a declared action, then save that URL under Customize → Code and hosting. Gabriel verifies the live deployment before using it for phone QR codes. The footer stays at the end of the page and reads “Made using Gabriel Operator with [persona name]”.
