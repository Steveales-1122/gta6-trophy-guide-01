// Checklist view: the main tracker. Filter bar on top, then one row per
// trophy with a checkbox, the official name and description, the grade,
// and the missable flag. Story trophies stay masked while spoilers are on.
import { KINDS } from "../config.js";
import { displayName, displayDesc } from "../data.js";
import { applyFilter, filterProgress } from "../filters.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function gradeClass(grade) {
  return "grade-" + grade.toLowerCase();
}

export function renderChecklist(root, app) {
  const { trophies, state, filter } = app;
  const list = applyFilter(trophies, state, filter);
  const prog = filterProgress(trophies, state, filter);
  const total = trophies.length;
  const done = Object.keys(state.earned).length;
  const pct = Math.round((done / total) * 100);

  const kindOptions = KINDS.map(
    (k) => `<option value="${k.id}"${filter.kind === k.id ? " selected" : ""}>${esc(k.label)}</option>`,
  ).join("");
  const showOptions = ["all", "todo", "earned"]
    .map(
      (s) =>
        `<option value="${s}"${filter.show === s ? " selected" : ""}>${
          s === "all" ? "All" : s === "todo" ? "Not earned yet" : "Earned"
        }</option>`,
    )
    .join("");

  let rows = "";
  if (filter.kind === "online") {
    rows = `<p class="empty-note">There are no online trophies in GTA VI — every one of the 55 unlocks in single-player. Pick another filter to see the list.</p>`;
  } else if (list.length === 0) {
    rows = `<p class="empty-note">Nothing matches this filter. Clear the search or pick another kind.</p>`;
  } else {
    rows = list
      .map((t) => {
        const earned = !!state.earned[t.id];
        const when = earned ? ` <span class="earned-when">${esc(state.earned[t.id].slice(0, 10))}</span>` : "";
        const miss = t.missable ? ` <span class="flag-missable" title="Missable — read the guide before this window passes">MISSABLE</span>` : "";
        const hid = t.hidden ? ` <span class="flag-hidden" title="Hidden on PlayStation until earned">HIDDEN</span>` : "";
        const count = t.count ? ` <span class="flag-count">${t.count}×</span>` : "";
        return `<li class="trophy-row${earned ? " is-earned" : ""}" data-id="${esc(t.id)}">
          <label class="row-check"><input type="checkbox" data-toggle="${esc(t.id)}"${earned ? " checked" : ""} aria-label="Mark ${esc(t.name)} earned"><span class="box" aria-hidden="true"></span></label>
          <a class="row-main" href="#/trophy/${esc(t.id)}">
            <span class="row-name">${esc(displayName(t, state))}</span>
            <span class="row-desc">${esc(displayDesc(t, state))}</span>
            <span class="row-meta"><span class="grade-chip ${gradeClass(t.grade)}">${esc(t.grade)}</span><span class="kind-chip">${esc(t.kind)}</span>${miss}${hid}${count}${when}</span>
          </a>
        </li>`;
      })
      .join("");
  }

  root.innerHTML = `
    <section class="view-head">
      <h2>Checklist</h2>
      <p class="view-sub">${done} of ${total} earned (${pct}%) — progress is saved in this browser.</p>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </section>
    <div class="filter-bar">
      <label>Kind
        <select data-filter-kind>${kindOptions}</select>
      </label>
      <label>Show
        <select data-filter-show>${showOptions}</select>
      </label>
      <label class="filter-search">Search
        <input type="search" data-filter-query value="${esc(filter.query)}" placeholder="Name, description or guide text…">
      </label>
    </div>
    <p class="filter-count">${prog.done} of ${prog.total} in this filter earned.</p>
    <ul class="trophy-list">${rows}</ul>`;

  root.querySelector("[data-filter-kind]").addEventListener("change", (e) => {
    app.setFilter({ kind: e.target.value });
  });
  root.querySelector("[data-filter-show]").addEventListener("change", (e) => {
    app.setFilter({ show: e.target.value });
  });
  root.querySelector("[data-filter-query]").addEventListener("input", (e) => {
    app.setFilter({ query: e.target.value }, true);
  });
}
