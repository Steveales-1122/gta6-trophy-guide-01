// Stats: earned by grade and by kind, trophy points, and overall progress.
import { GRADE_POINTS, GRADE_ORDER, KINDS, KIND_LABELS } from "../config.js";

export function renderStats(ctx) {
  const { state, esc } = ctx;
  const total = state.trophies.length;
  const got = (list) => list.filter((t) => state.store.earned[t.id]).length;
  const points = state.trophies.reduce(
    (sum, t) => sum + (state.store.earned[t.id] ? GRADE_POINTS[t.grade] : 0),
    0,
  );
  const maxPoints = state.trophies.reduce((sum, t) => sum + GRADE_POINTS[t.grade], 0);
  const byGrade = GRADE_ORDER.map((g) => {
    const mine = state.trophies.filter((t) => t.grade === g);
    return `<div class="stat"><b>${got(mine)} / ${mine.length}</b><span>${g} trophies · ${GRADE_POINTS[g]} points each</span></div>`;
  }).join("");
  const byKind = KINDS.map((k) => {
    const mine = state.trophies.filter((t) => t.kind === k);
    return `<div class="stat"><b>${got(mine)} / ${mine.length}</b><span>${KIND_LABELS[k]}</span></div>`;
  }).join("");
  return `<h2>Stats</h2><p class="lede">Points use the usual PlayStation values: bronze 15, silver 30, gold 90, platinum 180.</p>` +
    `<div class="grid"><div class="stat"><b>${points} / ${maxPoints}</b><span>trophy points</span></div>` +
    `<div class="stat"><b>${got(state.trophies)} / ${total}</b><span>trophies earned</span></div></div>` +
    `<h3>By grade</h3><div class="grid">${byGrade}</div>` +
    `<h3>By kind</h3><div class="grid">${byKind}</div>`;
}
