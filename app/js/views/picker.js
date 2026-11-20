// What next? One suggestion at a time: the first still-open trophy in
// roadmap order, with its guide open beside it.
import { detailHtml } from "./detail.js";

export function renderPicker(ctx) {
  const { state, esc } = ctx;
  const open = state.trophies.filter((t) => !state.store.earned[t.id]);
  if (!open.length) {
    return `<h2>What next?</h2><p class="lede">Nothing left — every trophy is earned. The Platinum is yours.</p>`;
  }
  const next = [...open].sort((a, b) => {
    if (a.missable !== b.missable) return a.missable ? -1 : 1;
    return a.stage - b.stage || a.id - b.id;
  })[0];
  const label = ctx.masked(next) ? "Hidden trophy" : next.name;
  return `<h2>What next?</h2><p class="lede">One suggestion at a time, from what is still open.</p>` +
    `<section class="card"><h3>${esc(label)} ${ctx.badge(next.grade)} ${ctx.tag(next.kind)}</h3>` +
    `<p>${esc(ctx.displayDesc(next))}</p>${detailHtml(ctx, next)}` +
    `<p><button class="btn" data-action="earn" data-id="${next.id}">Mark it earned</button> ` +
    `<button class="btn ghost" data-action="view" data-view="planner">See the full plan</button></p></section>`;
}
