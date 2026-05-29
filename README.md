# MaMaTina — Gourmet Rice Pudding

Premium, fully editable marketing site with a hidden admin panel.

## Quick start (Windows · VS Code)

1. **Open the folder in VS Code**
   - `File → Open Folder…` and pick this folder.
   - Open a terminal: `` Ctrl + ` ``.

2. **Install dependencies**
   ```
   npm install
   ```
   (First install builds the `sharp` image library. If it fails on Windows, run `npm install --include=optional sharp` then `npm install` again.)

3. **Run the dev server**
   ```
   npm run dev
   ```

4. **Open the site**
   - Public:  http://localhost:3000
   - Admin:   http://localhost:3000/admin

5. **Default admin credentials** (change in code or via DB after first login)
   - Email: `admin@mamatina.com`
   - Password: `mamatina2026`

## What's inside

- **Hero** — auto-shuffling photos, headline/sub/buttons editable in admin.
- **About** — eyebrow, title, paragraph, image editable.
- **Products / Flavors** — full CRUD, ordering, featured toggle, availability (available / sold out / coming soon), modal detail view.
- **Gallery** — grid OR cross-fading feature, drag-free ordering, captions.
- **Reviews** — public submission flow (approval required), admin can add/feature/approve/delete.
- **Contact** — modern luxe form with product picker, quantity, event date, honeypot + 1-min rate limit.
- **Newsletter** — email signup, CSV export.
- **Announcement bar** — toggleable.
- **Footer** — fully editable text and social links.

### Admin features

- Hidden login at `/admin` (no link from public site).
- Secure JWT session cookie (HttpOnly), 8-hour expiry, signed with `SESSION_SECRET`.
- Image uploads auto-converted to WebP and resized (max 2200px) via `sharp`.
- Allowed file types: JPG, PNG, WebP, AVIF, max 8 MB.
- CSV export for messages and subscribers.
- Maintenance mode toggle.
- SEO controls (title, description, social image, GA ID).
- Logo and favicon upload.
- Privacy policy and terms editable in plain text.

## File structure

```
mamtina website/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← public homepage (composes all sections)
│   │   ├── privacy/              ← editable privacy page
│   │   ├── terms/                ← editable terms page
│   │   ├── admin/
│   │   │   ├── page.tsx          ← login
│   │   │   └── dashboard/        ← protected admin pages
│   │   └── api/                  ← REST endpoints
│   ├── components/               ← public site sections
│   ├── lib/                      ← db, auth, uploads, types
│   └── middleware.ts             ← protects /admin/dashboard/*
├── data/                         ← db.json is created here at runtime
├── public/uploads/               ← uploaded images
└── …
```

## Where the data lives

Everything is stored in `data/db.json`. To reset the site to factory defaults, delete that file — it will be re-created with the seeded content on next request.

To back up your site content, copy `data/db.json` and the `public/uploads/` folder.

## Changing the admin password

Until a "change password" screen is added, you can:

1. Stop the dev server.
2. Open `src/lib/db.ts` → find the `mamatina2026` default and change it.
3. Delete `data/db.json` to re-seed with the new password.

Or update the `passwordHash` in `data/db.json` directly using bcrypt.

## Production notes

- Set `SESSION_SECRET` in `.env.local` (already done with a dev value — change before production).
- Build: `npm run build`, start: `npm start`.
- The data lives on disk; if deploying on a serverless platform, use persistent storage or migrate to a hosted DB.

## Troubleshooting

- **`sharp` install fails on Windows** — try `npm install sharp --ignore-scripts=false`. Restart VS Code if it locks the binary.
- **Login redirects in a loop** — the middleware redirects unauthenticated users from `/admin/dashboard/*` to `/admin`. Make sure `SESSION_SECRET` is the same across server restarts (it is via `.env.local`).
- **OneDrive sync slows everything down** — pause OneDrive sync on this folder during development.
