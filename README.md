# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## What's new

- **Mobile optimized**: sticky responsive navbar with animated mobile menu, tuned type scale for small screens, larger tap targets, `100svh` hero sizing for mobile browser chrome.
- **Animations**: scroll-reveal on every section, staggered skill/project grids, animated scroll progress bar, subtle hero parallax/zoom, animated mobile menu and admin tabs (Framer Motion).
- **/admin panel** (PIN set via `VITE_ADMIN_PIN`, see below): add/edit/delete projects, blog posts (with date & time, shown 3-at-a-time with "View More"), technology/tool/platform icons (50+ presets or your own upload), footer contact links, and the cover/about/mindset images — including a click-or-drag crop focus point for the cover photo. Optionally syncs live to every device via MongoDB (see "Persistent storage" below).

### Admin PIN

The PIN is no longer hardcoded — it's read from the `VITE_ADMIN_PIN` environment variable (see `.env` / `.env.example`).

- Locally: edit `.env` (already gitignored, so it's never committed).
- When deploying: set `VITE_ADMIN_PIN` in your hosting provider's environment variables (see Vercel steps below). Since this is a Vite app, env vars are baked in at **build time** — changing it means re-deploying, not just restarting the server. Note this PIN is a light client-side gate, not real authentication: anyone who inspects the built JS can find it, same as before.

### How admin saving works

This is a static frontend with no backend/database, so `/admin` edits are saved to **your browser's localStorage** — they persist for you on that device/browser, but won't automatically show up for other visitors of the deployed site.

To make edits permanent for everyone **without** setting up a database (see below):
1. Go to `/admin` → **Data** tab.
2. Click **"Copy source code"**.
3. Paste it over the contents of `src/data/defaultData.js`.
4. Commit and redeploy.

You can also **Export/Import JSON** from the Data tab as a backup or to move your edits between devices.

## Persistent storage (recommended if you edit often)

By default this site has no database — every `/admin` edit saves to that one browser only (see above). If you'd rather have edits **sync live to every visitor and device the moment you save**, with no redeploy step, connect a free MongoDB database. This is a one-time, ~5 minute setup, and the site keeps working normally if you skip it.

1. **Create a free MongoDB Atlas cluster**: go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register), create an account, create a free **M0** cluster.
2. **Create a database user**: Atlas → Database Access → Add New Database User (username + password, "Read and write to any database").
3. **Allow network access**: Atlas → Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) — needed since Vercel's serverless functions don't have a fixed IP.
4. **Get your connection string**: Atlas → Database → Connect → Drivers → copy the `mongodb+srv://...` URI, and fill in the password you set in step 2.
5. In Vercel → your project → **Settings → Environment Variables**, add:
   - `MONGODB_URI` = the connection string from step 4
   - `MONGODB_DB` = `portfolio` (optional, this is the default)
   - `ADMIN_PIN` = the **same value** as your `VITE_ADMIN_PIN` (this one is server-only and is never exposed to the browser — it's what actually authorizes writes to the database)
6. Redeploy. That's it — `/admin` will now show a small status dot in the header ("Synced" = working, "Local only" = not configured yet, "Save failed" = check your connection string/IP allowlist).

How it works: `api/data.js` is a Vercel serverless function that reads/writes one JSON document in MongoDB. The admin panel still saves to localStorage instantly (so it's never slow or blocked by network issues) and pushes to the database in the background a moment later; the public site fetches the latest synced copy on load. If the database becomes unreachable for any reason, the site automatically falls back to local/default content instead of breaking.

One practical note: keep uploaded images reasonably small, or prefer hosted image URLs (like the postimg.cc links already used) over large file uploads — the whole content blob (including any embedded images) needs to stay well under a few MB to sync smoothly.

## Deploying (Vercel)

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import that repo.
3. Framework preset: Vercel should auto-detect **Vite**. Leave build command as `npm run build` and output directory as `dist`.
4. Before deploying, add an environment variable: **Settings → Environment Variables** → `VITE_ADMIN_PIN` = your chosen PIN (for Production, and Preview if you want it there too). Add the "Persistent storage" variables above too if you want live syncing from day one.
5. Click **Deploy**. `vercel.json` in this repo already adds the SPA rewrite needed so `/admin` works on a direct link or page refresh (and it's set up to not interfere with the `/api` serverless function).
6. Once live, visit `yourdomain.com/admin` and unlock with your PIN to start editing content.

If you ever change `VITE_ADMIN_PIN` in Vercel's settings, trigger a new deployment (redeploy) for it to take effect — env vars are baked in at build time.

