// Checklist view: every trophy as a row you can tick off, with search,
// kind filters, earned/unearned filtering and the spoiler setting applied.
import { FILTER_DEFS, GRADE_LABEL } from "../config.js";
import { getState, isEarned, toggleEarned } from "../store.js";
import { applyFilters, sortForChecklist, isMasked, displayName, displayDescription } from "../filters.js";

export function renderChecklist(el, ctx) {
  const state = getState();
  const { kind = "all", query = "", earned = "all", missableOnly = false } = ctx.filter;
  let rows = sortForChecklist(applyFilters(ctx.trophies, state, { kind, query, earned, missableOnly }));
  if (state.settings.hideEarned && earned === "all") {
    rows = rows.filter((t) => !isEarned(t.id));
  }

  const wrap = document.createElement("div");
  wrap.className = "view checklist-view";

  const head = document.createElement("div");
  head.className = "view-head";
  head.innerHTML = `<h2>Checklist</h2><p>${rows.length} of ${ctx.trophies.length} trophies shown. Tick one off when it pops — progress saves in this browser.</p>`;
  wrap.appendChild(head);

  const chips = document.createElement("div");
  chips.className = "chips";
  for (const def of FILTER_DEFS) {
    const b = document.createElement("button");
    b.className = "chip" + (kind === def.id ? " active" : "");
    b.textContent = def.label;
    b.addEventListener("click", () => ctx.setFilter({ kind: def.id }));
    chips.appendChild(b);
  }
  const miss = document.createElement("button");
  miss.className = "chip" + (missableOnly ? " active" : "");
  miss.textContent = "Missable only";
  miss.addEventListener("click", () => ctx.setFilter({ missableOnly: !missableOnly }));
  chips.appendChild(miss);
  wrap.appendChild(chips);

  const earnedRow = document.createElement("div");
  earnedRow.className = "chips";
  for (const [id, label] of [["all", "All"], ["earned", "Earned"], ["unearned", "Not earned"]]) {
    const b = document.createElement("button");
    b.className = "chip" + (earned === id ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => ctx.setFilter({ earned: id }));
    earnedRow.appendChild(b);
  }
  wrap.appendChild(earnedRow);

  const list = document.createElement("ul");
  list.className = "trophy-list";
  if (!rows.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = kind === "online"
      ? "No online trophies: all 55 trophies in GTA VI are offline and single-player."
      : "Nothing matches those filters yet.";
    list.appendChild(empty);
  }
  for (const t of rows) {
    const li = document.createElement("li");
    li.className = "trophy-row grade-" + t.grade + (isEarned(t.id) ? " earned" : "");
    const masked = isMasked(t, state);
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = isEarned(t.id);
    box.setAttribute("aria-label", "Mark " + t.name + " earned");
    box.addEventListener("change", () => {
      toggleEarned(t.id);
      ctx.refresh();
    });
    const body = document.createElement("button");
    body.className = "row-body";
    body.addEventListener("click", () => ctx.openTrophy(t.id));
    body.innerHTML =
      `<span class="grade-badge">${GRADE_LABEL[t.grade]}</span>` +
      `<span class="row-text"><span class="row-name">${escapeHtml(displayName(t, state))}</span>` +
      `<span class="row-desc">${escapeHtml(displayDescription(t, state))}</span></span>` +
      (t.missable ? `<span class="flag missable">Missable</span>` : "") +
      (masked ? `<span class="flag hidden-flag">Hidden</span>` : "") +
      (t.count ? `<span class="flag count">× ${t.count}</span>` : "");
    li.appendChild(box);
    li.appendChild(body);
    list.appendChild(li);
  }
  wrap.appendChild(list);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
