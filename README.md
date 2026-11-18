# Golden Wings: Bootstrap Studio export

Bootstrap 5.3 pages with the Golden Wings design system on top.

## Import into Bootstrap Studio
1. New design → Blank (Bootstrap 5).
2. File → Import → **Website**, and pick this folder. Or drag the folder into the Design panel.
3. Bootstrap Studio swaps the CDN Bootstrap links for its own copy. Keep `golden-wings.css` loading after Bootstrap; Design panel → Styles, drag it below `bootstrap.min.css` if needed.
4. Fonts are declared with `@font-face` in the CSS and load from `assets/fonts/`, so you don't need to add them in the Fonts panel. The body font (Comma Sans) comes from the Adobe Fonts kit `vvd4xah`, linked in each page head; the kit must list every domain the site runs on.

## Pages
- `index.html`, `film.html`, `about.html`, `people.html`, `journey.html`, `contact.html`, `press-kit.html`: golden-wings-robyn.com redesign
- `presskit-site.html`: standalone press-kit site, one scrolling page with anchor nav
- `storyblok-home.html`: your live Storyblok home with the fixes you approved. It uses your own markup and CSS (`assets/css/storyblok/`), not Bootstrap classes, so it stays exactly as you designed it. The hero video is the Cloudflare stream, unchanged.

## Styling
- Brand colors, fonts and square corners are mapped onto Bootstrap's CSS variables, so stock Bootstrap components already look on-brand.
- Brand pieces are classes you can apply in Bootstrap Studio's Attributes panel:
  - Buttons: `btn btn-gw` (gold), `btn-gw-red`, `btn-gw-ghost`, `btn-gw-light` (on dark), plus `btn-sm` / `btn-lg`
  - Section backgrounds: `bg-gw-cream`, `bg-gw-cream-light`, `bg-gw-gold`, `bg-gw-teal`, `bg-gw-navy`, `bg-gw-ink`; add `gw-grain` for film grain and `gw-on-dark` on dark sections
  - Type: `gw-eyebrow`, `gw-title`, `gw-title--akira`, `gw-lead`, `gw-prose`, `gw-script`, `gw-mono`
  - Pieces: `gw-plate`, `badge gw-badge` (`--red`, `--teal`, `--ink`, `--outline`), `card gw-card`, `gw-still`, `gw-subject`, `gw-rows`, `gw-quote`, `gw-frame`, `gw-tilt`, `gw-form`
- Spacing: `gw-section` is 80px top and bottom (56px on mobile).
- Behaviour: `assets/js/golden-wings.js` runs the Journey tag filter, the poster lightbox (a Bootstrap modal), the hero video pause button and the screener form.

## Reusable components
To reuse the nav, footer, buttons and cards, right-click them in Bootstrap Studio and choose **Copy to Library**.
