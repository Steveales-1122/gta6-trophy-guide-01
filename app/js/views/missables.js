// The missables: the one trophy that can be missed, and the hidden
// trophies whose methods are still unconfirmed.
import { detailHtml } from "./detail.js";

const UNCONFIRMED = [44, 45, 49, 50, 51];

export function renderMissables(ctx) {
  const { state, esc } = ctx;
  const pma = state.trophies.find((t) => t.id === 28);
  const open = pma
    ? `<section class="card"><h3>${esc(ctx.displayName(pma))} ${ctx.badge(pma.grade)}</h3>${detailHtml(ctx, pma)}` +
      `<p>Do it in Chapter 1: after the mission Down to Earth, look for Lucia at Jason's house in the morning. When she mentions meditating, follow her to the balcony and accept her invitation. The 100% checklist only needs 15 of 18 meditations, but this trophy needs all 18 — and the first one may disappear once Chapter 1 ends.</p></section>`
    : "";
  const unsure = UNCONFIRMED.map((id) => state.trophies.find((t) => t.id === id)).filter(Boolean);
  const list = unsure
    .map((t) => `<li><strong>${esc(ctx.displayName(t))}</strong> — ${esc(ctx.displayDesc(t))}<br>${esc(t.guide)} <span class="sources">Sources: ${t.sources.map(esc).join(" · ")}</span></li>`)
    .join("");
  return `<h2>Missables</h2><p class="lede">Only one trophy is reported as potentially missable. Everything else can be cleaned up after the story, in free roam.</p>${open}` +
    `<section class="card"><h3>Still unconfirmed</h3><p class="lede">Five hidden trophies have no confirmed method yet. PowerPyx marks them not yet known; do not build a plan around an unconfirmed method.</p><ul class="tight">${list}</ul></section>`;
}
