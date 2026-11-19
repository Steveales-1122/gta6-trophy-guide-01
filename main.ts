// Hands the guide in: copies app/ and screenshots/ from this repository
// into the output directory and writes /output/dossier.json with the kit's
// buildDossier. Runs twice with the same bytes: the copy is a plain
// byte-for-byte copy and buildDossier is deterministic for the same input.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// The caps the gate itself states: dossier text at most 160 KiB, at most
// 4 screenshots of 256 KiB each, app/ at most 993 files and 48 MiB, and
// no path longer than 1,000 bytes.
const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
  app_max_files: 993,
  app_max_bytes: 48 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("Wrote " + join(outDir, "dossier.json") + " (" + dossier.length + " bytes)");
