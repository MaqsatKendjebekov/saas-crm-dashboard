# Pulse CRM Dashboard

Frontend portfolio MVP for a `CRM / Admin Dashboard for SaaS`.

## MVP scope

This project is intentionally scoped as an MVP that still looks product-grade:

- dashboard overview with KPI cards and revenue chart
- customer list with search, status filter and detail drawer
- deals pipeline with drag-and-drop kanban stages
- tasks view with assignee, priority and status filtering
- billing view with invoice ledger and subscription mix
- dark/light theme toggle
- toast feedback for key interactions
- responsive layout for desktop and tablet/mobile

## Project structure

- `index.html` entry point
- `styles.css` full UI styling
- `src/main.js` app wiring and interactions
- `src/components/views.js` section rendering
- `src/data/mockData.js` mock CRM data
- `src/state.js` local app state

## Run locally

If you already have Node in PATH:

```powershell
node server.js
```

If your local Node is unavailable in this environment, this bundled runtime path also works here:

```powershell
& "C:\Users\Qoto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Or just run:

```powershell
.\start.ps1
```

Then open:

- [http://localhost:4173](http://localhost:4173)

## Free hosting

### Recommended: Cloudflare Pages

This app is a pure static frontend, so Cloudflare Pages is a strong fit.

Deployment settings:

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`
- Root directory: `/`

Steps:

1. Create a GitHub repository and upload this folder.
2. In Cloudflare Pages, choose `Workers & Pages` -> `Create application` -> `Pages` -> `Connect to Git`.
3. Select your repository.
4. Keep the project as a static site with no build command.
5. Set the output directory to `/`.
6. Deploy.

### Backup options

- `Vercel`: import the repo as a static project.
- `Netlify`: drag and drop the folder or connect the repo.

## Why this is a good MVP

- Covers real frontend product patterns instead of just landing-page work.
- Gives you something deployable for portfolio links and interviews.
- Easy to upgrade later with auth, backend, and real CRUD flows.

## Next upgrades

- replace mock data with a real API or Supabase
- add login and role-based route protection
- persist filters in the URL
- add optimistic mutations and toasts tied to real writes
- migrate to React/Next.js + TypeScript for a production-grade version
