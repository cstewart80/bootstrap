// strip-typekit.mjs  (OPTIONAL - only if Caleb decides to drop Typekit kit vvd4xah)
// Removes Typekit loader/preconnect tags from every root .html page.
// Local @font-face files at the project root already cover all families.
// Usage:  node handoff\strip-typekit.mjs [--dry-run]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DRY = process.argv.includes('--dry-run');

const PATTERNS = [
  /<script[^>]*use\.typekit\.net[^>]*><\/script>\s*/gi,
  /<link[^>]*use\.typekit\.net[^>]*>\s*/gi,
  /<link[^>]*typekit[^>]*>\s*/gi
];

for (const f of readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = join(ROOT, f);
  let html = readFileSync(p, 'utf8');
  let n = 0;
  for (const re of PATTERNS) {
    const next = html.replace(re, '');
    if (next.length !== html.length) { n++; html = next; }
  }
  if (n) {
    if (!DRY) writeFileSync(p, html);
    console.log(`${DRY ? 'DRY  ' : 'WROTE'} ${n} tag(s) removed  ${f}`);
  }
}
console.log('done. verify:  Select-String -Path *.html -Pattern "typekit"  (expect no matches)');
