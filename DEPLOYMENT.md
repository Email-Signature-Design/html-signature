# Deployment Guide — Email Signature Generator

This guide walks you through publishing this site for free on GitHub Pages, and preparing it for Google AdSense approval.

---

## Part 1 — Upload to GitHub

1. Go to [github.com](https://github.com) and create a free account (if you don't have one).
2. Click **New repository**.
   - **Option A — Root site (recommended):** Name the repository exactly `yourusername.github.io` (replace `yourusername` with your actual GitHub username). This gives you a clean root URL: `https://yourusername.github.io/`
   - **Option B — Project site:** Name it anything, e.g. `email-signature-generator`. Your URL will be: `https://yourusername.github.io/email-signature-generator/`
3. Set the repository to **Public**, then click **Create repository**.
4. Click **Add file → Upload files**, then drag in every file from this folder:
   - `index.html`
   - `style.css`
   - `script.js`
   - `about.html`
   - `privacy-policy.html`
   - `terms-of-use.html`
   - `contact.html`
   - `sitemap.xml`
   - `robots.txt`
5. Scroll down and click **Commit changes**.

## Part 2 — Enable GitHub Pages

1. In your repository, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` (or `master`) and folder to `/ (root)`, then **Save**.
4. Wait 1–2 minutes. GitHub will show your live URL at the top of the Pages settings (something like `https://yourusername.github.io/`).

## Part 3 — Update the placeholder domain

Every file currently uses `https://yourdomain.com/` as a placeholder for canonical links, Open Graph tags, the sitemap, and robots.txt. Once you know your real GitHub Pages URL:

1. Open each file (`index.html`, `about.html`, `privacy-policy.html`, `terms-of-use.html`, `contact.html`, `sitemap.xml`, `robots.txt`) in GitHub's web editor (click the pencil icon).
2. Use Find & Replace to change every instance of `https://yourdomain.com` to your real URL, e.g. `https://yourusername.github.io` (Option A) or `https://yourusername.github.io/email-signature-generator` (Option B).
3. Commit each change.

**Tip:** If you'd rather I do this for you, just send me your final GitHub Pages URL (or your username + repo name) in a message and I'll update every file and re-package the site for you to re-upload.

---

## Part 4 — Before applying for AdSense

Google AdSense reviewers check for all of the following — this site already has them, but double-check after you're live:

- [ ] Site is live and publicly accessible (no login wall, no "under construction")
- [ ] **Privacy Policy**, **Terms of Use**, and **Contact** pages are reachable from the footer — ✅ already built
- [ ] No broken links (test every nav/footer link once live)
- [ ] Real content — About page, FAQ, How It Works sections — ✅ already built
- [ ] Site works well on mobile — ✅ already responsive
- [ ] The site has been live for a little while (even a few days to a couple of weeks) before applying — a brand-new site is more likely to be rejected or asked to wait
- [ ] A **custom domain** is optional but recommended — it improves both SEO and AdSense approval odds versus a free `github.io` subdomain. You can buy one (~$10–15/year) and connect it to GitHub Pages later without losing your existing site.

## Part 5 — Apply for AdSense

1. Go to [google.com/adsense](https://www.google.com/adsense/start/) and sign up with the email you want tied to your account.
2. Add your site's URL exactly as it appears live (e.g. `https://yourusername.github.io/`).
3. Google will give you a snippet like:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
   Paste this once, right before `</head>`, in **every page** (`index.html`, `about.html`, etc.) — I can do this for you once you have your publisher ID (`ca-pub-...`).
4. Once approved, create an `ads.txt` file at the site root with the line Google gives you, e.g.:
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
5. Review typically takes anywhere from a few days to a few weeks. If rejected, Google tells you the reason (usually "low value content," "site under construction," or missing policy pages) — this site is already built to avoid those specific issues.

---

## Quick reference — file checklist

| File | Purpose |
|---|---|
| `index.html` | Main tool — signature builder & templates |
| `style.css` | All styling |
| `script.js` | All logic (templates, live preview, copy/download) |
| `about.html` | About page (required-ish for AdSense trust signals) |
| `privacy-policy.html` | Required for AdSense |
| `terms-of-use.html` | Required for AdSense |
| `contact.html` | Required for AdSense |
| `sitemap.xml` | Helps Google find & index all pages |
| `robots.txt` | Tells search engines they can crawl the site |
