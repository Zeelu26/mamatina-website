# 🚀 Launching MaMaTina on Vercel

Your app is stateless (all data + images live in Supabase), so Vercel's
**free** plan is all you need. No credit card required.

Follow these steps in order.

---

## Step 1 — Deploy to Vercel

1. Go to **https://vercel.com/signup** and sign up **with GitHub** (one click).
2. On your dashboard, click **Add New… → Project**.
3. Find **`mamatina-website`** in the repo list and click **Import**.
4. Vercel auto-detects Next.js — leave build settings as-is.
5. **Before clicking Deploy**, expand **Environment Variables** and add the
   variables from Step 2 below.
6. Click **Deploy**. Wait ~2–3 minutes.

You'll get a live URL like `https://mamatina-website.vercel.app`.

---

## Step 2 — Environment variables (paste into Vercel)

Add each of these under **Settings → Environment Variables** (or during import).
Set them for **Production, Preview, and Development** (the default).

| Name | Value |
|------|-------|
| `SESSION_SECRET` | `a532695896c2563bdaedb5d3d9ee5f04480eb9bf28a322f48ec856dffc792d971f8592d3c8e873074b1e1ec43a08e6b5` |
| `NEXT_PUBLIC_SUPABASE_URL` | *(copy from your `.env.local`)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(copy from your `.env.local`)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(copy from your `.env.local`)* |
| `RESEND_API_KEY` | *(copy from your `.env.local`)* |
| `CONTACT_RECEIVER_EMAIL` | `Mamatinarp@gmail.com` |
| `CONTACT_FROM_EMAIL` | `Mamatinarp@gmail.com` |

> The `SESSION_SECRET` above is a fresh production value — do **not** reuse the
> dev one. Open your local `.env.local` to copy the Supabase and Resend values.

---

## Step 3 — Verify Supabase is production-ready

1. Open your project at **https://supabase.com/dashboard**.
2. **Storage → `website-images` bucket** → make sure it is **Public**
   (bucket settings → "Public bucket" toggle ON). Uploaded photos won't show
   otherwise.
3. **Table editor** → confirm you see tables: `admins`, `products`, `reviews`,
   `messages`, `subscribers`, plus the content/settings tables.

---

## Step 4 — Change the admin password (do this before sharing the site)

The default is `admin@mamatina.com` / `mamatina2026`. Change it:

1. In your project folder terminal, run (replace with your chosen password):
   ```
   node scripts/hash-password.mjs "YourNewStrongPassword"
   ```
2. It prints an `update admins …` SQL line. Copy it.
3. In Supabase → **SQL Editor** → paste and **Run**.
4. Log in at `https://your-site.vercel.app/admin` with the new password.

---

## Step 5 — Email notifications (Resend)

The contact form emails `Mamatinarp@gmail.com` on every inquiry. For emails to
actually deliver:

- **`Mamatinarp@gmail.com` must be the email you used to sign up for Resend.**
  Resend's free/sandbox sender (`onboarding@resend.dev`) only delivers to the
  account owner's address. The code auto-uses this sender because a gmail
  "from" address can't be verified.
- To send from your own domain later (e.g. `orders@mamatinaorp.com`) and reach
  any inbox, verify that domain in Resend, then set `CONTACT_FROM_EMAIL` to an
  address on it.

Either way, every inquiry is **always saved** to the admin **Messages** page,
so you never lose one even if email is misconfigured.

---

## Step 6 (optional) — Custom domain `mamatinaorp.com`

1. Vercel → your project → **Settings → Domains → Add**.
2. Enter `mamatinaorp.com` and `www.mamatinaorp.com`.
3. Vercel shows DNS records. Add them at your domain registrar.
4. Wait for verification — Vercel issues SSL automatically.

---

## Future updates

Any time you change code:
```
git add .
git commit -m "what changed"
git push
```
Vercel auto-deploys in ~2 minutes. Supabase data is untouched.

---

## Quick pre-launch checklist

- [ ] Deployed on Vercel, site loads
- [ ] All 7 env vars set on Vercel
- [ ] `website-images` bucket is Public
- [ ] Admin password changed from default
- [ ] Test the contact form → message appears in admin Messages
- [ ] (optional) Custom domain connected
