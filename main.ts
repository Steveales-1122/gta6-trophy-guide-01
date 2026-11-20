// Sunset Platinum hands in the GTA VI trophy guide: it copies the static app
// and the screenshots into the output directory and writes dossier.json with
// the vendored make.fun library. Node 22, standard library only.
// Run it locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader it runs as `node /bot/main.ts` with /output already mounted.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The grader mounts /output for an unprivileged user, and its parent is not
// writable, so removing /output itself fails. Clear only what is inside it.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

cpSync(join(here, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`Wrote ${join(outDir, "dossier.json")} (${dossier.length} bytes)`);
