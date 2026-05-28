# Ascent

Vue 3 + TypeScript dashboard for touring bicycle stats (Komoot data).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deployment is handled automatically via GitHub Actions on push to `main`. The workflow builds the project and deploys to the `deploy` branch, which is served as a GitHub Page.

Configure GitHub Pages to serve from the `deploy` branch in the repository settings.
