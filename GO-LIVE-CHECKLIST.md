# Go-Live Checklist — shauncedricthomas.com

## Step 1 — Buy your domain (5 minutes, ~$10/year)

Go to **cloudflare.com/products/registrar** and search for:
- `shauncedricthomas.com` (first choice)
- `shaunthomas.co` (backup)
- `shauncedric.com` (backup)

Cloudflare sells domains at cost (no markup) and is the cleanest option. Namecheap or Porkbun also work.

## Step 2 — Deploy to Netlify (10 minutes, free)

1. Go to **app.netlify.com** and sign up with email or GitHub.
2. On the dashboard, you'll see a big drop zone that says *"Drag and drop your site output folder here"*.
3. **Unzip** `shauncedricthomas-site.zip` on your computer. You'll get a folder called `site/`.
4. **Drag the `site` folder** onto that drop zone.
5. Wait 30 seconds. Netlify will give you a URL like `wonderful-curie-abc123.netlify.app`.
6. Click **"Site settings" → "Change site name"** and rename it to `shauncedricthomas` (so the URL becomes `shauncedricthomas.netlify.app`).

The site is now live. You can share that URL today.

## Step 3 — Connect your custom domain (15 minutes)

1. In Netlify, go to **Site settings → Domain management → Add custom domain**.
2. Enter `shauncedricthomas.com`.
3. Netlify will show you DNS records to add. Two options:
   - **Easiest:** change your nameservers at Cloudflare to Netlify's nameservers (Netlify gives you the exact ones to paste).
   - **Or:** add the A record and CNAME Netlify shows you, in your Cloudflare DNS settings.
4. Wait 10–60 minutes for DNS to propagate. SSL (the padlock) auto-applies.

You're now live at **shauncedricthomas.com**.

## Step 4 — Make AI engines & Google find you (20 minutes)

1. **Google Search Console** — search.google.com/search-console
   - Add your property (shauncedricthomas.com)
   - Verify via DNS (or by uploading the HTML file Netlify makes easy to add)
   - Submit your sitemap: `https://shauncedricthomas.com/sitemap.xml`
   - Click "Request indexing" on your homepage

2. **Bing Webmaster Tools** — bing.com/webmasters
   - Same process. Bing powers ChatGPT search and Microsoft Copilot.

3. **Update your LinkedIn profile** — add the website URL to your contact info and "About" section. This is the single biggest signal to Google that the site is yours.

## Step 5 — Test everything (5 minutes)

- Open the site on your phone in actual Safari/Chrome (not just the file preview)
- Check the photo loads
- Click the CV download button — it should download the PDF
- Tap email/LinkedIn buttons — they should work
- Share the URL in WhatsApp to yourself — confirm the OG preview card appears
- Google "Shaun Cedric Thomas" in 3-7 days — your site should start surfacing

## Step 6 — Editing the site later

The whole site is one `index.html` file. To edit:
- Open it in any text editor (VS Code is free and excellent)
- Use Find (Cmd/Ctrl + F) to locate text
- Save the file
- In Netlify: drag the new `site` folder back onto the dashboard. Done.

For thought pieces: copy one of the existing `<a class="thought">` blocks, change the date, title, lede, and tags.

## When you're ready to go further

- **Newsletter:** sign up at substack.com or beehiiv.com (both free), then add a subscribe button to the site
- **Blog with full article pages:** when you have 5+ pieces, migrate to Astro or Eleventy (I can help)
- **Custom email** (shaun@shauncedricthomas.com): set up via Cloudflare Email Routing — free, takes 5 minutes

---

**You've got everything you need. Go ship it.**
