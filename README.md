# Extravaganza Events and Props — Local Build

13 static HTML pages, coded against the Figma design. Plain HTML/CSS/JS, no
build step or bundler — since the final destination is a PHP shortcode
template anyway, a compiler wouldn't buy you anything here.

## Setup

1. Unzip this into wherever you keep projects, e.g. `~/Sites/extravaganza-site`
2. Open the folder in VS Code: `code .`
3. Install the **Live Server** extension (Ritwick Dey) if you don't have it
4. Right-click `index.html` → **Open with Live Server**
5. (Recommended) turn it into a git repo:
   ```
   git init
   git add .
   git commit -m "Initial site build"
   ```

## Pages

| File | Figma node |
|---|---|
| `index.html` | Home (491:169) |
| `delivery-setup.html` | 491:335 |
| `pickup.html` | 491:448 |
| `our-process.html` | 491:566 |
| `prop-rentals.html` | 495:2670 |
| `events.html` | 491:884 |
| `themes.html` | 491:1049 |
| `gallery.html` | 495:3029 |
| `balloons.html` | 497:3952 |
| `centerpieces.html` | 497:3843 |
| `our-story.html` | 491:1711 |
| `testimonials.html` | 491:1532 |
| `meet-the-team.html` | 491:1215 |

Every page has the full nav + footer inlined (the "normal" static-site
pattern — no shared-partial trick). Nav now includes real dropdown submenus
for Services and About since those child pages exist.

Not yet in Figma, so still `#` placeholders in nav/footer: **Draping**,
**Our Values**, **Contact**, **Blog**. Add real links once those pages exist.

## Structure

```
index.html, delivery-setup.html, ... (13 pages, flat at project root)
assets/css/tokens.css       ← design tokens (colors/type/spacing), pulled from Figma
assets/css/base.css         ← reset, base typography, Google Fonts import, page-bg layer
assets/css/components/      ← one CSS file per reusable pattern (see below)
assets/js/main.js           ← real interactive JS (nav toggle, etc. — wire up as needed)
assets/img/                 ← place exported Figma assets here
```

### Reusable components (in `assets/css/components/`)

Built once, used across many pages — check here before writing new CSS for
something that might already exist:

- **buttons.css** — `.ee-btn`, `.ee-btn--dark`, `.ee-btn--teal`
- **section-header.css** — `.ee-section-title` + `.ee-section-link` (title + "view all" link pattern)
- **page-hero.css** — `.ee-page-hero` — eyebrow + H1 + intro, used at the top of every sub-page
- **howitworks.css** — `.ee-howitworks` — numbered steps in a purple band (Delivery & Setup, Pickup, Prop Rentals)
- **accordion.css** — `.ee-accordion` — native `<details>` collapsible sections (What's Included, Where we deliver)
- **timeline.css** — `.ee-timeline` — alternating photo/text rows (Our Process, Events, Themes, Our Story, Meet the Team)
- **cta-band.css** — `.ee-cta-band` — heading + subtext + button banner, with `--purple` / `--teal-tint` modifiers
- **info-grid.css** — `.ee-info-grid` — 2-column detail cards (Pickup details)
- **team-facts.css** — `.ee-team-facts` — label/value rows (Meet the Team)
- **quote-card.css** — `.ee-quotes`, `.ee-quote-card`, `.ee-featured-quote` (Testimonials page)
- **testimonial.css** — the quote + stats band reused verbatim on the homepage and most sub-pages

## ⚠️ Content that still needs real copy

Several things in Figma itself are still placeholders — I preserved them
as-is with `<!-- TODO -->` comments rather than inventing fake content.
Search each file for `TODO` to find every instance. The big ones:

- **Meet the Team** — every card still says "Team Member" / lorem ipsum bio.
  No real names, roles, or photos exist yet.
- **Our Story** — the H1 itself is an unfinished placeholder in Figma:
  *"Our Story started with (complete this sentence)"*. Only the 1998
  milestone has real copy; 2002/2010/2019/2026 are lorem ipsum.
- **Events** and **Themes** — every row (Weddings, Casino, Roaring 20s, etc.)
  still has lorem ipsum body copy.
- **Testimonials** — the two large "featured" cards both reuse the same
  placeholder quote/client name; need distinct real testimonials.
- **Balloons** / **Centerpieces** — intro paragraph is lorem ipsum.

## Images

None of the ~40+ photos across these pages are downloaded into the project —
every `<img>` points to a placeholder filename in `assets/img/` with a
`<!-- TODO -->` comment above it noting the rough Figma node. Given the
volume, export these directly from Figma yourself (right-click layer →
Export) rather than me enumerating every temporary download link — that
approach doesn't scale past a handful of images and the links expire in
about a week anyway. The homepage's images are the exception — those *do*
have logged download links from earlier in this build.

## When you're ready to convert to WordPress

Once you're done editing this in VS Code, this is the point where the
WPBakery/Code Snippets conversion happens: each reusable component above
becomes one `vc_map()` block + PHP render function (see the Hero Banner
example from earlier), with the client-editable copy/images mapped to form
fields and everything else locked into the template.
