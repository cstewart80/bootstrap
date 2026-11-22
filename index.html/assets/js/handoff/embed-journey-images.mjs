// embed-journey-images.mjs
// Replaces the <!-- MEDIA: ... --> marker in each journey-<slug>.html with
// <figure class="gw-prose"><img ... loading="lazy"></figure> blocks, mapping the
// mirror page's squarespace-cdn <img> order to journey/<slug>/NN.* files by position.
//
// Usage:  node handoff\embed-journey-images.mjs [--dry-run]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url))); // project root (parent of handoff/)
const MIRROR = 'E:\\~GoldenWings\\presskit\\robyn-site-mirror\\public\\indie-doc-journey';
const DRY = process.argv.includes('--dry-run');

const POSTS = [
  '10-documentaries-that-will-inspire-and-transform-you',
  'accidental-selfportraits-a-filmmakers-journey-through-time-and-memory',
  'bhiff-here-we-come',
  'dolly-parton-saint-of-rhinestones-queer-subtext-and-the-cheap-seats',
  'from-nickelodeon-to-the-sky-crafting-the-opening-for-golden-wings-documentary',
  'golden-wings-an-award-winning-documentary-on-family-legacy-and-aviation',
  'golden-wings-fifty-year-flight-path-celebrating-milestones-in-aviations-legacy',
  'golden-wings-soars-website-anniversary-celebration-amp-first-look-at-our-new-3-minute-teaser',
  'golden-wings-takes-flight-celebrating-wins-at-clown-international-and-independent-shorts-awards',
  'i-sued-meta-in-small-claims-court-and-won',
  'janice-engel-mentor-documentary',
  'jdirector-statement',
  'jonah-wrote-this-ws655-mlew4',
  'lessons-learned-from-a-virtual-screening-and-from-life',
  'life-meets-you-where-you-are',
  'making-a-no-budget-documentary',
  'swedish-film-awards-winner',
  'the-middle-seat-manifesto-a-survivors-guide-nnben-fmabn',
  'weight-loss-journey-golden-wings-documentary',
  'wrapping-up-the-holidays-and-diving-into-the-wonderful-world-of-mocha-masks-xetef-w45bk',
  'zucked-on-christmas-eve-part-1'
];

const MARKER = /<!--\s*MEDIA:[\s\S]*?-->/;
const isImg = f => /\.(jpe?g|png|webp|avif|gif)$/i.test(f);
const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true });

for (const slug of POSTS) {
  const pagePath = join(ROOT, `journey-${slug}.html`);
  if (!existsSync(pagePath)) { console.log(`SKIP  no page        ${slug}`); continue; }
  let html = readFileSync(pagePath, 'utf8');
  if (!MARKER.test(html)) { console.log(`OK    marker gone    ${slug}`); continue; }

  // original image order + alt text from the rendered mirror page
  const mirrorPath = join(MIRROR, slug, 'index.html');
  const originals = [];
  if (existsSync(mirrorPath)) {
    const m = readFileSync(mirrorPath, 'utf8');
    const imgRe = /<img\b[^>]*>/gi;
    let tag;
    while ((tag = imgRe.exec(m))) {
      const src = /src=["']([^"']+)["']/i.exec(tag[0]);
      if (src && /squarespace-cdn\.com/.test(src[1])) {
        const alt = /alt=["']([^"']*)["']/i.exec(tag[0]);
        originals.push({ src: src[1], alt: alt ? alt[1] : '' });
      }
    }
  }

  const dir = join(ROOT, 'journey', slug);
  const files = existsSync(dir) ? readdirSync(dir).filter(isImg).sort(nat) : [];

  if (!files.length) {
    console.log(`MISS  no local imgs  ${slug}  (mirror lists ${originals.length}) -> fetch from WACZ/live CDN into journey\\\\${slug}\\\\ then rerun`);
    continue;
  }
  if (originals.length && originals.length !== files.length) {
    console.log(`WARN  ${slug}: mirror=${originals.length} imgs vs local=${files.length} files; embedding ${Math.min(originals.length, files.length)} by order`);
  }

  const n = Math.min(originals.length || files.length, files.length);
  const figs = [];
  for (let i = 0; i < n; i++) {
    const alt = (originals[i] ? originals[i].alt : '').replace(/"/g, '&quot;');
    figs.push(`      <figure class="gw-prose"><img src="journey/${slug}/${files[i]}" alt="${alt}" loading="lazy"></figure>`);
  }
  html = html.replace(MARKER, () => figs.join('\n'));
  if (DRY) console.log(`DRY   would embed ${n} imgs  ${slug}`);
  else { writeFileSync(pagePath, html); console.log(`WROTE ${n} imgs  ${slug}`); }
}
console.log('done. verify:  Select-String -Path journey-*.html -Pattern "MEDIA:"');