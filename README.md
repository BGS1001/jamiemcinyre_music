# Jamie McIntyre — official site

A static, single-page site for Galway singer-songwriter Jamie McIntyre: hero, music
(“Over Galway Town” and the *For Folk Sake* EP), tour dates, about, and links.

No build step: `index.html`, `styles.css`, `main.js`, `assets/`.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (GitHub Pages)

Settings → Pages → Source: *Deploy from a branch* → pick the branch and `/ (root)`.
`.nojekyll` is included so files are served as-is.

## Updating content

- **Hero photo:** the hero shows an illustrated Galway Bay sunset by default. To use a photo,
  add it as `assets/hero.jpg` (landscape, ~2400px wide) and set `data-photo="assets/hero.jpg"`
  on `<section class="hero">` in `index.html`. It appears under a dark overlay so the text stays readable.
- **Tour dates:** edit the `<li class="show">` items in `index.html` (marked `TOUR DATES`).
  That list is the single source: from it the page also builds each show's
  “Add to calendar” file and the event data search engines read. Per show, set
  `data-date` (YYYY-MM-DD), optional `data-time` (24h Irish time), `data-city`,
  `data-venue`, `data-place`, the visible text, and the Tickets link. Past shows hide
  automatically; once none remain, a “follow on Instagram” message shows instead.
- **Share image:** `assets/og.png` (1200×630) is what shows when the link is posted on social media.
  The `og:url`, `og:image` and `canonical` tags assume the GitHub Pages address
  `https://bgs1001.github.io/jamiemcinyre_music/`; change them if you use a custom domain.
- **Streaming links:** the “Listen” row in the Music section. Add direct Spotify / Apple Music
  links there when you have them (currently Linktree, Deezer, Bandcamp).

## Automated checks

`npm test` runs the suite in `tests/site.test.mjs`, and GitHub Actions
(`.github/workflows/checks.yml`) runs it on every push and pull request:

- axe-core accessibility audit (WCAG 2.1 AA + best practice) of both pages at desktop and phone widths
- no console errors and no horizontal scrolling
- tour logic: shows stay listed through their own day, hide afterwards, fallback message
  when none remain, calendar files are valid, event data matches the list
- page works with JavaScript off
- every local file a page links to exists

To run locally:

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm test
```

## Quality checks done

- Accessibility: 0 violations from axe-core (WCAG 2.1 AA + best practice) on `index.html`
  and `404.html` at desktop and phone widths. The rust accent `#a94f2a` was chosen to pass AA
  with white text and as text on the cream background — keep that in mind if you change it.
- Works with JavaScript off (all content and every tour date stay visible).
- Tour list verified to keep a show listed through its own day and to switch to the
  "follow on Instagram" message once every date has passed.
- Print stylesheet: prints as a clean one-sheet (no dark backgrounds, links spelled out).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page, plus schema.org data for the artist and tour dates |
| `styles.css`, `main.js` | Styling; tour logic (past-show hiding, calendar files, event data), nav, optional hero photo, fade-ins |
| `404.html` | Page shown for broken links on GitHub Pages |
| `assets/og.png` | Link-preview image for social media / messaging |
| `assets/favicon.svg`, `assets/apple-touch-icon.png` | Browser and iPhone home-screen icons |
| `robots.txt`, `sitemap.xml` | Search-engine hints (assume the GitHub Pages address) |
| `tests/`, `package.json`, `.github/workflows/checks.yml` | Automated checks (not needed to serve the site) |

## To verify before launch

Content was compiled from public listings and press, since Instagram and Linktree couldn't be
read directly:

- Tour venues and ticket links (Limerick “Live at the Big Top” in late November especially).
- Stats: 50M+ TikTok views, 7.5M+ Spotify streams for “Over Galway Town” (latest press figure; update as it grows).
- *For Folk Sake* tracklist (taken from Deezer).
