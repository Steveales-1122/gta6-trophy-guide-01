// Stats view: the numbers — earned by grade and by kind, a progress bar
// per grade, and the trophy-point total.
import { GRADES, GRADE_LABEL, GRADE_POINTS, KIND_LABEL } from "../config.js";
import { getState, isEarned, earnedCount } from "../store.js";

export function renderStats(el, ctx) {
  const state = getState();
  const total = ctx.trophies.length;
  const earned = earnedCount();
  const wrap = document.createElement("div");
  wrap.className = "view stats-view";
  wrap.innerHTML =
    `<h2>Stats</h2>` +
    `<p class="big-number">${earned} / ${total}</p>` +
    `<p>${Math.round((earned / total) * 100)}% of the way to the Platinum.</p>` +
    `<div class="bar big"><span style="width:${Math.round((earned / total) * 100)}%"></span></div>`;

  const byGrade = document.createElement("section");
  byGrade.innerHTML = `<h3>By grade</h3>`;
  for (const grade of GRADES) {
    const group = ctx.trophies.filter((t) => t.grade === grade);
    const got = group.filter((t) => isEarned(t.id)).length;
    const pct = group.length ? Math.round((got / group.length) * 100) : 0;
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML =
      `<span class="grade-badge">${GRADE_LABEL[grade]}</span>` +
      `<span class="stat-label">${got} of ${group.length}</span>` +
      `<div class="bar"><span style="width:${pct}%"></span></div>`;
    byGrade.appendChild(row);
  }
  wrap.appendChild(byGrade);

  const byKind = document.createElement("section");
  byKind.innerHTML = `<h3>By kind</h3>`;
  for (const kind of ["story", "strangers", "collectibles", "activities", "completion", "platinum"]) {
    const group = ctx.trophies.filter((t) => t.kind === kind);
    if (!group.length) continue;
    const got = group.filter((t) => isEarned(t.id)).length;
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML =
      `<span class="stat-label">${KIND_LABEL[kind]}</span>` +
      `<span class="stat-label">${got} of ${group.length}</span>` +
      `<div class="bar"><span style="width:${group.length ? Math.round((got / group.length) * 100) : 0}%"></span></div>`;
    byKind.appendChild(row);
  }
  wrap.appendChild(byKind);

  const points = ctx.trophies.filter((t) => isEarned(t.id)).reduce((sum, t) => sum + (GRADE_POINTS[t.grade] || 0), 0);
  const max = ctx.trophies.reduce((sum, t) => sum + (GRADE_POINTS[t.grade] || 0), 0);
  const foot = document.createElement("p");
  foot.className = "note";
  foot.textContent = `Trophy points: ${points} of ${max} (Platinum 300, Gold 90, Silver 30, Bronze 15).`;
  wrap.appendChild(foot);
  el.appendChild(wrap);
}
