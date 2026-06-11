# OJ Clothings — Website

Modern luxury native wear, Lekki, Lagos. Agbada · Al-Turath Jalabia · Kaftans · Suits.
Ships worldwide.

This is the front-end for the OJ Clothings site: a static, single-page build with
an editorial monochrome design, a logo intro animation, the **OJ** concierge chat,
and a direct WhatsApp line. It deploys with **no build step**.

---

## Quick start (deploy today)

You only need this folder. Pick one host below.

### Option A — Netlify (drag & drop, fastest)
1. Go to https://app.netlify.com/drop
2. Drag this whole `oj-clothings` folder onto the page.
3. It's live in seconds on a `*.netlify.app` URL. Add your domain under
   **Site settings → Domain management**.

### Option B — GitHub + Vercel / Netlify / Cloudflare Pages (recommended for "push to deploy")
1. Create an empty repo on GitHub (e.g. `oj-clothings-web`).
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial OJ Clothings site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/oj-clothings-web.git
   git push -u origin main
   ```
3. In Vercel / Netlify / Cloudflare Pages: **New Project → Import** that repo.
   - **Build command:** _none_ (leave empty)
   - **Output / publish directory:** `.` (the root)
4. Deploy. Connect your custom domain in the dashboard.

### Option C — GitHub Pages
1. Push to GitHub as above.
2. Repo **Settings → Pages → Source: Deploy from branch → `main` / root**.
3. Live at `https://YOUR-USERNAME.github.io/oj-clothings-web/`.

Config files for Netlify (`netlify.toml`), Vercel (`vercel.json`) and a
Pages-friendly `.nojekyll` are already included, so any of the above works.

---

## Domain note (important)

Your Google listing points to **ojclothings.com** but the older live site is
**ojclothing.com** (singular). Pick one as primary and 301-redirect the other so you
don't split traffic or SEO. Set the primary in your host's domain settings.

---

## Folder structure

```
oj-clothings/
├── index.html          # the entire site (HTML + CSS + JS in one file)
├── assets/
│   ├── oj-logo-dark.png   # logo on black (used across the site)
│   └── oj-logo.png        # logo on transparent bg (for light sections later)
├── netlify.toml        # Netlify config (no build, security headers)
├── vercel.json         # Vercel config
├── .nojekyll           # lets GitHub Pages serve files as-is
├── .gitignore
└── README.md
```

> Note: the logo is currently **embedded directly inside `index.html`** as base64,
> so the page renders even before the `assets/` files load. The files in `assets/`
> are the originals for when we split things into a multi-page site.

---

## What's real vs. what to switch on

This build is the **homepage design, fully working**. Two things are intentionally
"demo mode" and need a real connection before launch — both are isolated so turning
them on won't change the design:

### 1. Images — replace placeholders with real photos
Every image area is an elegant tonal placeholder marked *"replace with…"*. To go live
with real brand imagery, get the **original high-res photo files** (from the brand, or
by saving the full-size images off Instagram @o.j_clothing — files, not screenshots).
Drop them into `assets/` and swap the placeholder blocks for `<img>` tags. The hero
especially deserves a real campaign shot.

### 2. OJ concierge — connect to the live AI
Right now **OJ** runs on a built-in demo script (see the `reply()` function in
`index.html`). It already speaks the right personality in English + Pidgin and hands
off to WhatsApp. To make it a true AI concierge powered by Claude, it needs:
- an **Anthropic API key**, and
- a **small backend endpoint** (e.g. a serverless function) that holds the key and
  calls the Claude API — the key must never sit in the public HTML.

When you're ready, this becomes a `/api/oj` function; the chat UI already exists and
just points at it.

### 3. Checkout (next phase)
The hybrid commerce model is planned but not built yet: ready-to-wear gets a
**Paystack** checkout; custom/agbada routes to WhatsApp / Book-a-Fitting (already wired).

---

## Editing the basics

All in `index.html`:

- **WhatsApp number** — search for `WA_NUM` / `wa.me/` and the constant near the top
  of the `<script>`. Currently `+234 916 772 8000`.
- **Store addresses & hours** — in the `#stores` section.
- **Phone numbers** — footer and store cards.
- **Instagram** — footer link to `@o.j_clothing`.
- **Colours & fonts** — the `:root` block at the top of the `<style>`
  (`--champagne` is the single accent).
- **OJ's answers** — the `reply()` function in the `<script>`.

---

## Brand

- **Colours:** obsidian black, bone white, one rare champagne/bronze accent.
- **Type:** Cormorant Garamond (display) + Inter (UI).
- **Voice:** modern luxury, heritage-rooted, confident, warm — never loud.

© 2026 OJ Clothings. Lekki, Lagos · Nigeria.
