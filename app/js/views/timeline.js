// Timeline view: earned history — every trophy you ticked off, in the
// order you earned it, with the date it landed.
import { getState, earnedList } from "../store.js";
import { byId } from "../data.js";

export function renderTimeline(el, ctx) {
  const wrap = document.createElement("div");
  wrap.className = "view timeline-view";
  wrap.innerHTML = `<h2>Earned history</h2><p>Every trophy you ticked off, in the order it landed. Times come from this browser's saved progress.</p>`;
  const list = earnedList();
  if (!list.length) {
    wrap.innerHTML += `<p class="note">Nothing earned yet. Tick a trophy off in the checklist and it will show up here with the time.</p>`;
    el.appendChild(wrap);
    return;
  }
  const ul = document.createElement("ol");
  ul.className = "timeline-list";
  for (const entry of list) {
    const t = byId(entry.id);
    const li = document.createElement("li");
    const when = new Date(entry.at);
    li.innerHTML =
      `<span class="tl-date">${escapeHtml(when.toLocaleDateString())} ${escapeHtml(when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</span>` +
      `<a href="#/trophy/${entry.id}">${escapeHtml(t ? t.name : entry.id)}</a>`;
    ul.appendChild(li);
  }
  wrap.appendChild(ul);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
