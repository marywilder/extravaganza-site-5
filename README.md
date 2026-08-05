# Extravaganza Events and Props — Local Build

15 static HTML pages, coded against the Figma design. Plain HTML/CSS/JS, no
build step or bundler — since the final destination is a PHP shortcode
template anyway, a compiler wouldn't buy you anything here.

## Setup

1. Unzip this into wherever you keep projects, e.g. `~/Sites/extravaganza-site`
2. Open the folder in VS Code: `code .`
3. Install the **Live Server** extension (Ritwick Dey) if you don't have it
4. Right-click `index4.html` → **Open with Live Server**
5. (Recommended) turn it into a git repo:
   ```
   git init
   git add .
   git commit -m "Initial site build"
   ```

## Pages

`index4.html` is the home page — the "Timeless" visual variant (deep indigo
backdrop, magenta accents) that superseded earlier homepage drafts. The
other 14 pages:

| File | Figma node |
|---|---|
| `delivery-setup.html` | 491:335 |
| `pickup.html` | 491:448 |
| `our-process.html` | 491:566 |
| `prop-rentals.html` | 495:2670 |
| `events.html` | 491:884 |
| `themes.html` | 491:1049 |
| `gallery.html` | 495:3029 |
| `balloons.html` | 497:3952 |
| `centerpieces.html` | 497:3843 |
| `draping.html` | 497:3843-family |
| `our-story.html` | 491:1711 |
| `testimonials.html` | 491:1532 |
| `meet-the-team.html` | 491:1215 |
| `blog.html` | — |

Every page has the full nav + footer inlined (the "normal" static-site
pattern — no shared-partial trick). Nav includes real dropdown submenus for
Services and About.

## Structure

```
index4.html, delivery-setup.html, ... (15 pages, flat at project root)
assets/css/site.css              ← the one real stylesheet — every reusable
                                    component's CSS lives in here, loaded by
                                    every page
assets/css/pages-timeless.css    ← loaded after site.css by the 14
                                    non-home pages; overrides colors/fonts/
                                    sizes for the "Timeless" look
assets/css/index4.css            ← same idea, but for index4.html only
assets/css/timeline-progress.css ← scroll-progress timeline dot/line effect,
                                    loaded only by our-process.html/our-story.html
assets/js/main.js                ← shared interactive JS (nav toggle, scroll
                                    reveal, accordion, etc.) — loaded by every page
assets/js/timeline-progress.js   ← pairs with timeline-progress.css above
assets/img/                      ← photos + a handful of standalone animation
                                    .html files (see below)
```

There's no `assets/css/components/*.css` directory anymore — this project
went through an earlier phase where each component had its own source CSS
file, which were hand-concatenated into `site.css`. Those source files were
later deleted as dead weight once `site.css` became the single source of
truth; if you're adding new component styles, add them directly to
`site.css` (or the page-specific override file, if the change is only for
the home page or only for the 14 "Timeless" pages).

### Animated logo/balloon components

A few decorative animations live as standalone `.html` files, loaded via
`<iframe src="...">` rather than being inlined, so their own `<style>`/
`<script>` stay self-contained:

- **`assets/css/components/extravaganza-logo-v1.html`** — the small resting
  logo mark, used in the hero + footer on every one of the 14 non-home pages.
- **`assets/img/extravaganza-logo-final.html`** — the full burst/wordmark
  animation, used twice on `index4.html` only (the full-screen intro on
  load, and the in-page hero logo).
- **`assets/css/components/balloons_1.html`** — the balloon-release
  animation on `index4.html`'s intro section.

If you find other similarly-named files (`extravaganza-logo-v2.html`,
`-v3.html`, etc.) — those were earlier iterations, already cleaned up as of
this README's last update. Check for an actual `iframe src=` reference
before assuming a file like this is live.

## ⚠️ Content that still needs real copy

Several things in Figma itself are still placeholders — preserved as-is
with `<!-- TODO -->` comments rather than inventing fake content. Search
each file for `TODO` or `Lorem ipsum` to find every instance. The big ones:

- **Meet the Team** — every card still says "Team Member" / lorem ipsum bio.
  No real names, roles, or photos exist yet.
- **Our Story** — the H1 itself is an unfinished placeholder in Figma:
  *"Our Story started with (complete this sentence)"*. Only the 1998
  milestone has real copy; the later years are lorem ipsum.
- **Events** and **Themes** — several rows still have lorem ipsum body copy.
- **Testimonials** — the two large "featured" cards both reuse the same
  placeholder quote/client name; need distinct real testimonials.
- **Blog** — post bodies/excerpts are still lorem ipsum.

## Images

Most pages now use real downloaded photos in `assets/img/` rather than
placeholders — check a page's `<img>` tags directly rather than assuming a
`TODO` comment marks every gap. If you do find a page still pointing at a
placeholder filename, export the real asset from Figma (right-click layer →
Export) rather than hunting for a temporary download link — those expire
quickly and don't scale past a handful of images anyway.

## When you're ready to convert to WordPress

Once you're done editing this in VS Code, this is the point where the
WPBakery/Code Snippets conversion happens: each reusable component becomes
one `vc_map()` block + PHP render function (see the Hero Banner example
from earlier), with the client-editable copy/images mapped to form fields
and everything else locked into the template.
