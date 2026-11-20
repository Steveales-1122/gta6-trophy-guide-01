// Exports the reader's progress as Markdown: earned trophies with their
// guides, then what is still open, ordered by roadmap stage.
import { GRADE_ORDER } from "./config.js";

export function exportMarkdown(trophies, store) {
  const earned = trophies.filter((t) => store.earned[t.id]);
  const open = trophies.filter((t) => !store.earned[t.id]);
  const lines = [];
  lines.push("# Sunset Platinum — progress");
  lines.push("");
  lines.push(`Earned ${earned.length} of ${trophies.length} trophies.`);
  lines.push("");
  for (const grade of GRADE_ORDER) {
    const group = earned.filter((t) => t.grade === grade);
    if (!group.length) continue;
    lines.push(`## ${grade} (${group.length})`);
    for (const t of group) lines.push(`- [x] ${t.name} — ${t.description}`);
    lines.push("");
  }
  lines.push(`## Still open (${open.length})`);
  const byStage = [...open].sort((a, b) => a.stage - b.stage || a.id - b.id);
  for (const t of byStage) lines.push(`- [ ] ${t.name} (${t.grade}, stage ${t.stage}) — ${t.description}`);
  lines.push("");
  return lines.join("\n");
}

export function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
