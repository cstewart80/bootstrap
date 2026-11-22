// fix-local-links.mjs
// Rewrites absolute self-links to local pages:
//   href="https://www.golden-wings-robyn.com/<route>"  -> href="<route>.html"  (when <route>.html exists locally)
//   href="/indie-doc-journey/<slug>"                    -> href="journey-<slug>.html"
//   href="/indie-doc-journey/tag/..." or /category/...  -> href="journey.html"
// Usage:  node handoff\\fix-local-links.mjs [--dry-run]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DRY = process.argv.includes('--dry-run');

const POSTS = new Set([
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
]);

const pages = new Set(readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => f.toLowerCase()));
const ABS_RE = /href=["']https:\\/\\/(www\\.)?golden-wings-robyn\\.com\\/([^"'#?]*)["']/gi;
const BLOG_RE = /href=["']\\/indie-doc-journey\\/([^"'#?]*)["']/gi;

for (const f of readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = join(ROOT, f);
  let html = readFileSync(p, 'utf8');
  let count = 0;

  html = html.replace(ABS_RE, (m, www, route) => {
    let r = route.replace(/\\/+$/, '');
    if (r.endsWith('.html')) r = r.slice(0, -5);
    if (r.startsWith('indie-doc-journey/')) return m; // handled by BLOG_RE below
    if (pages.has((r + '.html').toLowerCase())) { count++; return `href="${r}.html"`; }
    return m; // unknown route -> leave for the redirects task
  });

  html = html.replace(BLOG_RE, (m, rest) => {
    const r = rest.replace(/\\/+$/, '');
    if (POSTS.has(r)) { count++; return `href="journey-${r}.html"`; }
    if (r.startsWith('tag/') || r.startsWith('category/') || r === '') { count++; return 'href="journey.html"'; }
    return m;
  });

  if (count) {
    if (!DRY) writeFileSync(p, html);
    console.log(`${DRY ? 'DRY  ' : 'WROTE'} ${count} link(s)  ${f}`);
  }
}
console.log('done. leftovers:  Select-String -Path *.html -Pattern "golden-wings-robyn.com/" | Select-Object -Unique');