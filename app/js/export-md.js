// Export: progress as a Markdown checklist (for notes, guides and forums)
// and as JSON (for backup). Import reads the JSON back.
import { GRADE_LABEL } from "./config.js";
import { isEarned, earnedAt, getState } from "./store.js";

export function buildMarkdown(trophies) {
  const state = getState();
  const earned = trophies.filter((t) => isEarned(t.id));
  const lines = [];
  lines.push("# Sunset Platinum — GTA VI Trophy Progress");
  lines.push("");
  lines.push(`Earned ${earned.length} of ${trophies.length} trophies.`);
  lines.push("");
  for (const grade of ["platinum", "gold", "silver", "bronze"]) {
    const group = trophies.filter((t) => t.grade === grade);
    if (!group.length) continue;
    lines.push(`## ${GRADE_LABEL[grade]}`);
    lines.push("");
    for (const t of group) {
      const mark = isEarned(t.id) ? "x" : " ";
      const when = earnedAt(t.id) ? ` (earned ${earnedAt(t.id).slice(0, 10)})` : "";
      const target = t.count ? ` — ${t.count} needed` : "";
      lines.push(`- [${mark}] **${t.name}** — ${t.description}${target}${when}`);
    }
    lines.push("");
  }
  lines.push("Made with Sunset Platinum, an offline GTA VI trophy guide and tracker.");
  return lines.join("\n");
}

export function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
