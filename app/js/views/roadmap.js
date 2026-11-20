// Roadmap view: the six stages to the platinum, in the order to play them,
// each with its trophies and how far along you are.
import { ROADMAP } from "../config.js";
import { getState, isEarned } from "../store.js";
import { byId } from "../data.js";

export function renderRoadmap(el, ctx) {
  const state = getState();
  const wrap = document.createElement("div");
  wrap.className = "view roadmap-view";
  wrap.innerHTML = `<h2>Roadmap to the Platinum</h2><p>Six stages, in order. Finish the story first, meditate early, then clean up collectibles and activities — the Platinum lands when the 54th trophy pops.</p>`;
  for (const stage of ROADMAP) {
    const done = stage.trophies.filter((id) => isEarned(id)).length;
    const section = document.createElement("section");
    section.className = "stage" + (done === stage.trophies.length ? " done" : "");
    const pct = Math.round((done / stage.trophies.length) * 100);
    section.innerHTML =
      `<h3>${escapeHtml(stage.title)}</h3>` +
      `<p class="stage-hours">${escapeHtml(stage.hours)} · ${done} of ${stage.trophies.length} trophies</p>` +
      `<div class="bar"><span style="width:${pct}%"></span></div>` +
      `<p>${escapeHtml(stage.text)}</p>`;
    const list = document.createElement("ul");
    list.className = "stage-trophies";
    for (const id of stage.trophies) {
      const t = byId(id);
      if (!t) continue;
      const li = document.createElement("li");
      li.className = isEarned(id) ? "earned" : "";
      const a = document.createElement("a");
      a.href = "#/trophy/" + id;
      a.textContent = (isEarned(id) ? "✓ " : "") + t.name;
      li.appendChild(a);
      list.appendChild(li);
    }
    section.appendChild(list);
    wrap.appendChild(section);
  }
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
