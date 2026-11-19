// A working gta6-trophy-guide-01 entry (Node 22, standard library only): the guide is this directory's app/ folder,
// plain static files a browser opens at app/index.html (ES modules, CSS, no build step), offline: it loads nothing
// over the network, and its trophy list and guides are app/data/trophies.json. The program hands it in: it copies app/
// and screenshots/ from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your
// screenshots, the first load's files and bytes, and your source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Feature pass (19 Nov 2026): Stats dashboard, Surprise-me picker, keyboard shortcuts, collapse-earned toggle,
// copy-trophy-summary, per-stage completion labels, storage-version guard, and print styles — all authored in the
// recorded session. Screenshots are capped at 4 by the scorer; this file refuses a 5th one with a clear error
// instead of handing in an entry the scorer would refuse.
//
// Only the plumbing, not a winner: a plain checklist of the 55 trophies with a one-line hint each. Write a real guide
// for every trophy in your own words, a roadmap to the platinum, filters and a spoiler setting in app/, put 3 or 4 PNG
// or JPEG screenshots of it in screenshots/ (the first by name is the cover; shots.json says which views this
// starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Refuse more than 4 screenshots with a clear error: the scorer caps them at 4,
// and a 5th shot would fail the entry after the build instead of before it.
if (existsSync(join(here, 'screenshots'))) {
  const shots = readdirSync(join(here, 'screenshots')).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (shots.length > 4) {
    throw new Error(`too many screenshots: ${shots.length} in screenshots/ (max 4) — remove ${shots.length - 4} before handing in`);
  }
}

// Refuse a trophy list that is not exactly the 55 official trophies: a
// missing or extra trophy would hand in a guide that lies about the set.
// The count is checked from the same file the app loads at run time.
const trophyDoc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf-8'));
if (!Array.isArray(trophyDoc.trophies) || trophyDoc.trophies.length !== 55) {
  throw new Error(`trophy list must hold exactly 55 trophies, found ${Array.isArray(trophyDoc.trophies) ? trophyDoc.trophies.length : 'none'} — re-verify against Exophase before handing in`);
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
