# New Post Checklist — shauncedricthomas.com

How to publish a new article. Three files, three commits. Takes about 15 minutes.

Pick a slug first (lowercase, hyphens, no spaces). Example: `what-i-hand-to-the-model`. The slug is used in the folder name, every URL, and the sitemap, so keep it identical everywhere.

---

## Step 1 — Create the post page

1. In the `writing/` folder, open the most recent post folder (e.g. `built-my-website-in-a-weekend/index.html`).
2. Click **Raw**, select all, copy. This is your template.
3. Create the new file: in the file browser, use the filename box and type `writing/<your-slug>/index.html`. Typing the slash creates the folder and file together.
4. Paste the copied HTML in.
5. Swap the content. Everything below needs updating, not just the visible text. Easy to forget the metadata, so work top to bottom:

   - `<title>` — the post title plus ` · Shaun Cedric Thomas`
   - `<meta name="description">` — one-sentence summary
   - `<link rel="canonical" href="...">` — change slug
   - `og:title`, `og:description`, `og:url` (change slug)
   - `article:published_time` — `YYYY-MM-DD`
   - `twitter:title`, `twitter:description`
   - Schema block: `headline`, `description`, `datePublished`, `url` (change slug)
   - The visible `<h1 class="article-title">` headline
   - The `<p class="article-lede">` opening line
   - The `article-meta` row: tag, `<time datetime="...">` and visible date, read time
   - The whole `article-body` (paragraphs, `<h2>` headings, the `pull-quote`)

   Rule of thumb: search the file for the OLD slug and the OLD date and replace every instance.

6. Commit.

---

## Step 2 — Link it from the homepage

1. Open the root `index.html` and click the edit pencil.
2. Find the writing list: search (Cmd+F) for the previous post's slug. It lives inside `<div class="thoughts-list">`.
3. Add a new block right after `<div class="mono">Recent</div>` so the newest post sits at the top. Use the previous post's `<a class="thought">...</a>` block as the exact template, wrapped in its own `<div>...</div>`. Change only: href (`writing/<slug>/`, relative, with trailing slash), date, headline, lede, category, read time.
4. Commit.

---

## Step 3 — Add it to the sitemap

1. Open `sitemap.xml`, click the edit pencil.
2. Add a new `<url>` block after the homepage entry (the first `</url>`):

       <url>
         <loc>https://shauncedricthomas.com/writing/<your-slug>/</loc>
         <lastmod>YYYY-MM-DD</lastmod>
         <changefreq>yearly</changefreq>
         <priority>0.8</priority>
       </url>

   Match the existing posts: `yearly` changefreq, `0.8` priority, trailing slash on the URL.
3. Update the homepage `lastmod` (line near the top) to today's date, since the homepage changed.
4. Commit.

---

## Step 4 — Verify

Netlify auto-deploys on each commit. Within a minute or two:

- Visit `shauncedricthomas.com/writing/<slug>/` — confirm it renders styled, not as raw text.
- Check the homepage — new post shows at the top of the writing list, correct title and date.

---

## Step 5 — Share

- LinkedIn: post the text, put the live URL as the **first comment** (LinkedIn throttles posts with outbound links in the body).
- The slug, date, and trailing slash must match across all three files or links break.

---

## Gotchas

- The site serves HTML, not markdown. Never commit a `.md` file as a post.
- Post links are relative (`writing/<slug>/`, no leading slash). Keep them that way.
- Every URL ends with a trailing slash.
- Don't write a post by editing an existing post's folder in place — that overwrites the old one. Always create a new folder.
- A new file committed empty stays empty. Paste the content before committing.
