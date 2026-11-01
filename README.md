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
- **Tour dates:** edit the `<li class="show" data-date="YYYY-MM-DD">` items in `index.html`.
  Shows whose date has passed are hidden automatically; if none remain, a
  “follow on Instagram” message shows instead.
- **Share image:** `assets/og.png` (1200×630) is what shows when the link is posted on social media.
  The `og:url`, `og:image` and `canonical` tags assume the GitHub Pages address
  `https://bgs1001.github.io/jamiemcinyre_music/`; change them if you use a custom domain.
- **Streaming links:** the “Listen” row in the Music section. Add direct Spotify / Apple Music
  links there when you have them (currently Linktree, Deezer, Bandcamp).

## To verify before launch

Content was compiled from public listings and press, since Instagram and Linktree couldn't be
read directly:

- Tour venues and ticket links (Limerick “Live at the Big Top” in late November especially).
- Stats: 50M+ TikTok views, 7.5M+ Spotify streams for “Over Galway Town” (latest press figure; update as it grows).
- *For Folk Sake* tracklist (taken from Deezer).
