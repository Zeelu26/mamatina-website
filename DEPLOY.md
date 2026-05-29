# Deploying MaMaTina to Render

This guide takes you from local code → live URL.

---

## What you're about to set up

- **Hosting:** Render (Starter plan, ~$7/month)
- **Storage:** 1 GB persistent disk (~$0.25/month) — keeps your products, photos, settings, and admin login between deploys
- **Total:** ~$7.25/month for a real, production-ready site

> **Free tier note:** Render's free plan is also supported, but its filesystem resets every deploy/restart, so your admin login would revert to the default and any photos/products you added through the admin would disappear. Fine for testing — not for a real launch.

---

## Step 1 — Put your code on GitHub

Render deploys from a Git repo. If you don't have a GitHub account, create one at https://github.com/.

In your project terminal:

```bash
git add .
git commit -m "Initial commit: MaMaTina luxury website"
```

Now create an empty repo on GitHub (don't add a README or .gitignore — leave it empty), then:

```bash
git remote add origin https://github.com/<your-username>/mamatina-website.git
git push -u origin main
```

If prompted to log in, GitHub will open a browser — sign in once.

---

## Step 2 — Deploy on Render via Blueprint

The `render.yaml` file in this repo tells Render exactly how to host the site.

1. Go to https://dashboard.render.com/
2. Click **New +** → **Blueprint**
3. Connect your GitHub account (one click)
4. Pick the `mamatina-website` repo
5. Render reads `render.yaml` and shows: 1 web service + 1 disk
6. Click **Apply**
7. Wait ~5 minutes for the first build

You'll get a free URL like `https://mamatina.onrender.com` while Render builds.

**Render automatically:**
- Sets `SESSION_SECRET` to a random secure value (don't worry, it's saved)
- Mounts the 1 GB disk at `/var/data`
- Routes the file-based DB and uploaded photos to the disk
- Restarts the site if it crashes

---

## Step 3 — Log into your admin

Once Render shows the service as **Live**, open `https://<your-url>.onrender.com/admin` and log in with:

- **Email:** `admin@mamatina.com`
- **Password:** `mamatina2026`

**Change this password immediately.** See "Changing the admin password" in `README.md`.

---

## Step 4 (optional) — Connect your custom domain

If you own `mamatinaorp.com`:

1. In Render, open the service → **Settings** → **Custom Domains**
2. Add `mamatinaorp.com` and `www.mamatinaorp.com`
3. Render shows you DNS records (an `A` record and `CNAME`)
4. Log into your domain registrar (GoDaddy, Namecheap, etc.) and add those records
5. Wait 5–30 minutes for DNS to propagate
6. Render auto-issues a free SSL certificate — your site is now `https://mamatinaorp.com`

---

## Pushing future changes

After you make code edits in VS Code:

```bash
git add .
git commit -m "describe what changed"
git push
```

Render auto-deploys within ~3 minutes. **Your admin data on the disk is preserved.**

---

## Backing up your data

Everything customer-facing lives in two places on the Render disk:

- `/var/data/db.json` — products, settings, reviews, messages, subscribers
- `/var/data/uploads/` — all uploaded photos

To download a backup:

1. In Render dashboard → your service → **Shell** tab
2. Run: `cat /var/data/db.json` and copy the output to a local file
3. For photos, use Render's disk snapshot feature (Settings → Disks → Take Snapshot)

---

## Troubleshooting

**Build fails with `sharp` error**
The Render Linux build should pick up the right binary automatically. If it doesn't, change the build command in `render.yaml` to:
```
npm install --include=optional && npm run build
```

**Login loops back to /admin**
Means `SESSION_SECRET` got changed between deploys. With `render.yaml`'s `generateValue: true` it's only set once. If you ever rotate it manually, log in once after each rotation.

**"Site can't be reached" after deploy**
Check the **Events** tab in Render for build errors. The most common cause is Node version — `render.yaml` pins it to 22, which is required for Next 15.

**Free tier: site is slow on first visit**
Free services spin down after 15 min idle. First request after that takes ~30 sec to wake. Upgrade to Starter to keep it always warm.

---

## Summary

```
$ git add . && git commit -m "ship it" && git push
       ↓
Render detects push → builds → deploys → live in 3 minutes
```
