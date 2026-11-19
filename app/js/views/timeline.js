// History view: every earned trophy with the moment it was earned, newest
// first, grouped by day. The timestamps come from the store, which records
// the time of each tick in the checklist.
import { earnedList } from "../store.js";
import { byId, displayName } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function renderTimeline(root, app) {
  const { trophies, state } = app;
  const entries = earnedList(state);
  if (entries.length === 0) {
    root.innerHTML = `
      <section class="view-head">
        <h2>History</h2>
        <p class="view-sub">Nothing earned yet. Tick a trophy in the checklist and it shows up here with the time you earned it.</p>
      </section>
      <p><a class="btn" href="#/checklist">Open the checklist</a></p>`;
    return;
  }
  const groups = new Map();
  for (const e of entries) {
    const day = (e.at || "").slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(e);
  }
  const sections = [...groups.entries()]
    .map(([day, list]) => {
      const items = list
        .map((e) => {
          const t = byId(trophies, e.id);
          const name = t ? displayName(t, state) : e.id;
          const grade = t ? t.grade : "";
          return `<li><a href="#/trophy/${esc(e.id)}">${esc(name)}</a> <span class="mini-grade">${esc(grade)}</span> <span class="earned-when">${esc(fmtTime(e.at))}</span></li>`;
        })
        .join("");
      return `<section><h3>${esc(day)} (${list.length})</h3><ul class="stage-list">${items}</ul></section>`;
    })
    .join("");

  root.innerHTML = `
    <section class="view-head">
      <h2>History</h2>
      <p class="view-sub">${entries.length} ${entries.length === 1 ? "trophy" : "trophies"} earned, newest first. Times are recorded when you tick a trophy in the checklist.</p>
    </section>
    ${sections}`;
}
