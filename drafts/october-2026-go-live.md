# October 2026 go-live — After the banners come down

Do this on or after 1 October 2026. Not before.

## 1) Homepage writing list
In root `index.html`, inside `<div class="thoughts-list">`, add a new thought card right after `<div class="mono">Recent</div>`:

- href: `writing/after-the-banners-come-down/` (relative, trailing slash)
- date: 1 October 2026
- headline: After the banners come down
- lede: We activate. We march. We mean it. Then the month turns, and the real question begins.
- category: Culture & Society
- read time: 6 min read

Use the previous post's `<a class="thought">` block as the exact template.

## 2) Sitemap
In `sitemap.xml`, add after the homepage `</url>`:

```xml
<url>
  <loc>https://shauncedricthomas.com/writing/after-the-banners-come-down/</loc>
  <lastmod>2026-10-01</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

Update homepage `lastmod` to 2026-10-01.

## 3) Homepage Notes (October only)
In root `index.html` Notes section (`#notes`):
- Change label from `Updated September 2026` to `Updated October 2026`
- Replace the notes paragraph(s) with:

After the banners come down, attention moves. It always does. This September brought memorial runs, vigils, and men in the street after women in Ekurhuleni did not come home. I was glad people showed up. I am also carrying the same question 2020 left me with: what happens when the month turns and the country finds something else to be urgent about?

Gender-based violence here is not a spike. It is a condition. Race, in rooms that think the work is already done, has a similar shape. Absence of an incident is not absence of a reality. Some things stay true after the post stops circulating.

The work I am asking of myself for October is smaller and harder than a banner. Stay with it after the banner is gone.

## 4) Verify
- https://shauncedricthomas.com/writing/after-the-banners-come-down/
- Homepage writing list shows the post at the top
- Notes label reads Updated October 2026

## Already done (draft)
- Post page exists at `writing/after-the-banners-come-down/index.html`
- Not linked from homepage or sitemap yet on purpose
