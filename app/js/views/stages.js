// Stages view: the 100% completion checklist behind A Long Road, grouped
// the way the in-game Progress screen counts it, with the numbers needed.
import { COMPLETION_GROUPS } from "../config.js";

export function renderStages(el, ctx) {
  const wrap = document.createElement("div");
  wrap.className = "view stages-view";
  wrap.innerHTML = `<h2>100% Completion — the Stages</h2><p>This is the checklist behind <strong>A Long Road</strong>. You need 35 tasks, not literally everything: where a row says "15 of 18", only 15 count. Work the groups in order and the gold trophy follows.</p>`;
  for (const group of COMPLETION_GROUPS) {
    const section = document.createElement("section");
    section.className = "stage";
    section.innerHTML = `<h3>${escapeHtml(group.label)}</h3>`;
    const list = document.createElement("ul");
    list.className = "completion-list";
    for (const task of group.tasks) {
      const li = document.createElement("li");
      const need = task.money ? "$" + task.needed.toLocaleString("en-US") : task.needed;
      const of = task.money ? "$" + task.of.toLocaleString("en-US") : task.of;
      li.innerHTML = `<span class="task-name">${escapeHtml(task.label)}</span><span class="task-need">${need} of ${of}</span>`;
      list.appendChild(li);
    }
    section.appendChild(list);
    wrap.appendChild(section);
  }
  const tip = document.createElement("p");
  tip.className = "note";
  tip.textContent = "Tip: robberies first — Gang Operations (39), Bank Jobs (22) and the eight bank vaults also feed the robbery trophies, so one run counts twice.";
  wrap.appendChild(tip);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
