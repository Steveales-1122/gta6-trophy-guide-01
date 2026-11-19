// Export progress as a Markdown checklist: a plain-text .md file the player
// can paste into a note, a gist or a repo. One section per roadmap stage,
// checked boxes for earned trophies, earned dates where the tracker knows
// them, and the player's own notes beside their trophy.
import { ROADMAP } from './config.js';
import { store } from './store.js';

export function buildMarkdown(data) {
  const { trophies } = data;
  const total = trophies.length;
  const done = store.earned.size;
  const lines = [];
  lines.push('# Sunset Platinum — GTA VI trophy progress');
  lines.push('');
  lines.push(`Progress: ${done}/${total} trophies earned (${total ? Math.round((done / total) * 100) : 0}%).`);
  lines.push(`Exported: ${new Date().toISOString()}.`);
  lines.push('');
  for (const stage of ROADMAP) {
    const members = trophies.filter((t) => t.stage === stage.n);
    if (!members.length) continue;
    const stageDone = members.filter((t) => store.earned.has(t.name)).length;
    lines.push(`## Stage ${stage.n} — ${stage.title} (${stageDone}/${members.length})`);
    lines.push('');
    for (const t of members) {
      const earned = store.earned.has(t.name);
      const when = earned ? store.earnedWhen(t.name) : null;
      const whenText = earned ? (when ? ` — earned ${when.toISOString().slice(0, 10)}` : ' — earned before tracking') : '';
      const note = store.notes[t.name] ? ` — note: ${store.notes[t.name]}` : '';
      lines.push(`- [${earned ? 'x' : ' '}] ${t.name} (${t.grade})${whenText}${note}`);
    }
    lines.push('');
  }
  const remaining = trophies.filter((t) => !store.earned.has(t.name));
  lines.push(`## Still to earn (${remaining.length})`);
  lines.push('');
  for (const t of remaining) lines.push(`- [ ] ${t.name} (${t.grade}, stage ${t.stage})`);
  lines.push('');
  return lines.join('\n');
}

export function downloadMarkdown(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
