// make-redirects.mjs
// Writes handoff/redirects.csv (source,target,status) for Cloudflare Bulk Redirects:
// all 21 blog slugs, the corrupted nested URL, tag/category pages, blog index.
// Usage:  node handoff\make-redirects.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

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

const rows = [['source', 'target', 'status']];
for (const s of POSTS) rows.push([`/indie-doc-journey/${s}`, `/journey-${s}.html`, '301']);
rows.push(['/indie-doc-journey/lessons-learned-from-a-virtual-screening-and-from-lifehttps/wwwgolden-wings-robyncom/blog-page-url/new-post-title/', '/journey-lessons-learned-from-a-virtual-screening-and-from-life.html', '301']);
for (const t of ['#AviationDocumentary', '#BehindTheScenes', '#BlogPost', '#ChineseTheater', '#DocumentaryJourney', '#Filmmaking', '#IndieFilm', '#SiliconBeachFilmFestival', '#StudentProject'])
  rows.push([`/indie-doc-journey/tag/${t}`, '/journey.html', '301']);
for (const c of ['Documentaries', 'Entertainment'])
  rows.push([`/indie-doc-journey/category/${c}`, '/journey.html', '301']);
rows.push(['/indie-doc-journey', '/journey.html', '301']);
rows.push(['/indie-doc-journey/', '/journey.html', '301']);

if (!existsSync(join(ROOT, 'handoff'))) mkdirSync(join(ROOT, 'handoff'));
const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
writeFileSync(join(ROOT, 'handoff', 'redirects.csv'), csv);
console.log(`wrote ${rows.length - 1} redirect rules to handoff/redirects.csv`);
