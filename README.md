# Team-Alpha

Team-Alpha is split into three main parts: a React client, an Express server, and a browser extension.
This README gives a light overview of the project structure so it is easy to find the main areas quickly.

## Top-Level Layout

- `client/` - React + TypeScript app built with Vite.
- `server/` - Express API that handles detection requests.
- `extension/` - Firefox extension that scans images on web pages.
- `flake.nix` - Nix-based development shell for local tooling.

## Client

The client contains the main web UI.

- `src/` - Application source code.
- `src/pages/` - Page-level screens like dashboard and detection views.
- `src/components/` - Reusable UI pieces.
- `src/utils/` - Shared helper functions.
- `src/assets/` - Static assets used by the app.
- `public/` - Files served directly by Vite.

Common client files:

- `src/main.tsx` - App entry point.
- `src/App.tsx` - Root application component.
- `vite.config.ts` - Vite configuration.
- `eslint.config.js` - Linting rules.

## Server

The server exposes the API used by the client and extension.

- `app.js` - Express app setup.
- `index.js` - Server entry point.
- `routes/` - Request routing.
- `controllers/` - Route handlers.
- `services/` - Detection and integration logic.
- `middleware/` - Request middleware such as upload handling.
- `utils/` - Helper utilities.

Important server files:

- `routes/detection.js` - Detection endpoint routing.
- `controllers/detection.js` - Detection request handling.
- `services/orchestrator.js` - Coordinates analysis flow.
- `services/sightEngineService.js` - SightEngine integration.

## Extension

The extension adds scanning tools inside Firefox.

- `manifest.json` - Extension manifest and permissions.
- `content.js` - Injects scan controls into pages.
- `background.js` - Handles server communication.
- `popup.html` / `popup.js` / `popup.css` - Extension popup UI.
- `icons/` - Extension icon files.

## Basic Flow

1. The client sends detection requests to the server.
2. The server processes the media and returns results.
3. The extension forwards scanned images to the same backend.
4. Results are shown in the UI with confidence and verdict details.

## Helpful Notes

- The client and server are independent packages.
- Each folder has its own `package.json`.
- The extension can be used separately from the web app.
- The repo is intended for local development with optional Nix support.

## Quick Navigation

- Start with `client/src/pages/` for UI screens.
- Check `server/routes/` for API entry points.
- Check `extension/content.js` for browser scanning behavior.
- Use `README.md` files inside each package for package-specific details.

