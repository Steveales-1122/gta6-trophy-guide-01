// The checklist: every trophy, filterable and searchable, with a tick box
// and a guide that opens under the trophy it belongs to.
import { KINDS, KIND_LABELS } from "../config.js";
import { detailHtml } from "./detail.js";

export function renderChecklist(ctx) {
  const { state, esc, badge, tag, displayName, displayDesc } = ctx;
  const f = state.filter;
  let list = ctx.applyFilter(state.trophies, f, state.store);
  if (state.store.settings.hideEarned) list = list.filter((t) => !state.store.earned[t.id]);

  const toolbar =
    `<div class="toolbar" role="search">` +
    `<input type="search" value="${esc(f.q)}" placeholder="Search trophies, descriptions and guides…  ( / )" aria-label="Search trophies">` +
    `<select data-filter="kind" aria-label="Filter by kind"><option value="all">All kinds</option>` +
    KINDS.map((k) => `<option value="${k}"${f.kind === k ? " selected" : ""}>${KIND_LABELS[k]}</option>`).join("") +
    `</select>` +
    `<select data-filter="grade" aria-label="Filter by grade"><option value="all">All grades</option>` +
    ["platinum", "gold", "silver", "bronze"].map((g) => `<option value="${g}"${f.grade === g ? " selected" : ""}>${g}</option>`).join("") +
    `</select>` +
    `<select data-filter="earned" aria-label="Filter by earned"><option value="all">All</option>` +
    `<option value="earned"${f.earned === "earned" ? " selected" : ""}>Earned</option>` +
    `<option value="open"${f.earned === "open" ? " selected" : ""}>Still open</option></select>` +
    `<label><input type="checkbox" data-action="toggle-hide-earned"${state.store.settings.hideEarned ? " checked" : ""}> Hide earned</label>` +
    `</div>`;

  if (!list.length) {
    return `<h2>Checklist</h2><p class="lede">Tick a trophy off when it pops. Progress is saved in your browser.</p>${toolbar}<p class="empty">Nothing matches these filters. Try clearing the search or a filter.</p>`;
  }

  const rows = list.map((t) => {
    const earned = Boolean(state.store.earned[t.id]);
    const open = state.openId === t.id;
    const row =
      `<tr class="${earned ? "earned" : ""}">` +
      `<td><input type="checkbox" data-action="earn" data-id="${t.id}"${earned ? " checked" : ""} aria-label="Mark ${esc(displayName(t))} earned"></td>` +
      `<td><button class="tname" data-action="open" data-id="${t.id}">${esc(displayName(t))}</button>${t.missable ? ` ${tag("missable", "missable")}` : ""}</td>` +
      `<td class="${ctx.masked(t) ? "hidden-name" : ""}">${esc(displayDesc(t))}</td>` +
      `<td>${badge(t.grade)}</td>` +
      `<td>${tag(t.kind)}</td></tr>`;
    const detail = open
      ? `<tr><td></td><td colspan="4">${detailHtml(ctx, t)}</td></tr>`
      : "";
    return row + detail;
  }).join("");

  return `<h2>Checklist</h2><p class="lede">Tick a trophy off when it pops. Progress is saved in your browser. Click a name to read its guide and sources.</p>${toolbar}` +
    `<table class="list"><thead><tr><th></th><th>Trophy</th><th>Official description</th><th>Grade</th><th>Kind</th></tr></thead><tbody>${rows}</tbody></table>`;
}
