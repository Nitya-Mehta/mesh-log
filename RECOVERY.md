# Mesh Log Recovery

This file is for recovering the project later. It contains setup instructions and secret names, not secret values.

## Requirements

- Node.js 24
- `npx`
- Vercel CLI, run through `npx vercel dev`

## Environment

Copy the example file:

```bash
cp .env.example .env
```

Required variables:

- `SCRIPT_URL` - Google Apps Script web app URL that appends submissions to the sheet.

Secret values should live in a password manager under:

```text
Development -> mesh-log
```

Do not commit `.env`, `frontend/local-config.js`, `.vercel`, service-account files, private keys, or recovery codes.

## Run

Full local app, including `/api/submit`:

```bash
make dev
```

Frontend-only preview:

```bash
make static
```

## Frontend Fallback

For static preview submissions, create `frontend/local-config.js` locally:

```js
window.LOCAL_APP_CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```

## Recovery Checklist

1. Install Node.js from `.nvmrc`.
2. Copy `.env.example` to `.env`.
3. Retrieve `SCRIPT_URL` from the password manager.
4. Run `make dev`.
5. Verify login and submit one test entry.
