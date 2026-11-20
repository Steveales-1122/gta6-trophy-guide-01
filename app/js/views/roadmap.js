// The roadmap: six stages to the Platinum, in the order to play them,
// each with its trophies and how many are already earned.
import { STAGES } from "../config.js";

export function renderRoadmap(ctx) {
  const { state, esc, badge } = ctx;
  const cards = STAGES.map((stage) => {
    const mine = state.trophies.filter((t) => t.stage === stage.n);
    const got = mine.filter((t) => state.store.earned[t.id]).length;
    const pct = mine.length ? Math.round((got / mine.length) * 100) : 0;
    const names = mine
      .map((t) => {
        const done = Boolean(state.store.earned[t.id]);
        const label = ctx.masked(t) ? "Hidden trophy" : t.name;
        return `<li>${done ? "✓ " : "○ "}${esc(label)} ${badge(t.grade)}</li>`;
      })
      .join("");
    return `<section class="card"><div class="stage-head"><b>Stage ${stage.n} — ${esc(stage.title)}</b><span>${got} / ${mine.length} earned</span></div>` +
      `<p class="lede">${esc(stage.blurb)}</p><div class="meter"><i style="width:${pct}%"></i></div>` +
      `<ul class="tight">${names}</ul></section>`;
  }).join("");
  return `<h2>Roadmap to the Platinum</h2><p class="lede">Six stages, in the order to play them. Finish the story first, catch the one missable meditation in Chapter 1, and leave most cleanup until after the story.</p>${cards}`;
}
