// After a PUBLIC_PREVIEW=1 build: prefix root-absolute URLs with the Pages base path,
// block indexing, and drop files that only matter on the production Apache host.
import { readFileSync, writeFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/electrocoats-site';
const dist = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

let n = 0;
for (const f of walk(dist).filter((p) => p.endsWith('.html'))) {
  const src = readFileSync(f, 'utf8');
  const out = src
    // attributes pointing at site-root paths (not protocol-relative, not already based)
    .replace(/\b(href|src|srcset|action|poster)="\/(?!\/|electrocoats-site\/)/g, `$1="${BASE}/`)
    // search index JSON and similar inline data
    .replace(/"h":"\/(?!electrocoats-site\/)/g, `"h":"${BASE}/`);
  if (out !== src) { writeFileSync(f, out); n++; }
}
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
rmSync(join(dist, '.htaccess'), { force: true });
writeFileSync(join(dist, '.nojekyll'), '');
console.log(`preview: rewrote ${n} html files for ${BASE}`);
