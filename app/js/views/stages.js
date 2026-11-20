// The four groups of the in-game 100% completion checklist behind A Long
// Road, with the numbers the game counts. These are the game's own targets,
// not trophy progress: use them to plan the cleanup after the story.
import { GROUPS_100 } from "../config.js";

export function renderStages(ctx) {
  const { esc } = ctx;
  const groups = GROUPS_100.map((group) => {
    const items = group.items
      .map(([name, target]) => `<li><strong>${esc(name)}</strong> — ${esc(target)}</li>`)
      .join("");
    return `<section class="card"><h3>${esc(group.name)}</h3><ul class="tight">${items}</ul></section>`;
  }).join("");
  return `<h2>100% Stages</h2><p class="lede">A Long Road wants the 100% completion checklist under Progress, Stats — finished after the story. The thresholds are lenient (about 60% of true completion), so skip the hardest leftovers. These are the numbers the game counts, as Keeengamer lists them.</p>${groups}` +
    `<p class="lede">Tip: most of this fills in while you chase the other trophies. Check Progress, Stats in the game to see what is left.</p>`;
}
