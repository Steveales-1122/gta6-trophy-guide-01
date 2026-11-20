// Planner view: what is left, ordered by roadmap stage, so the next
// session has a plan. Earned trophies drop out; the missable one is pinned
// to the top while it is still unearned.
import { ROADMAP } from "../config.js";
import { getState, isEarned } from "../store.js";
import { byId } from "../data.js";

export function renderPlanner(el, ctx) {
  const state = getState();
  const wrap = document.createElement("div");
  wrap.className = "view planner-view";
  const left = ctx.trophies.filter((t) => !isEarned(t.id));
  wrap.innerHTML = `<h2>Planner</h2><p>${left.length} trophies left, ordered by roadmap stage. Start at the top — the missable one stays pinned until it is done.</p>`;

  const pinned = ctx.trophies.filter((t) => t.missable && !isEarned(t.id));
  if (pinned.length) {
    const alert = document.createElement("div");
    alert.className = "pin";
    alert.innerHTML = `<strong>Do first:</strong> ${pinned.map((t) => `<a href="#/trophy/${t.id}">${escapeHtml(t.name)}</a>`).join(", ")} — the only missable trophy.`;
    wrap.appendChild(alert);
  }

  for (const stage of ROADMAP) {
    const open = stage.trophies.filter((id) => !isEarned(id));
    if (!open.length) continue;
    const section = document.createElement("section");
    section.className = "stage";
    section.innerHTML = `<h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.text)}</p>`;
    const list = document.createElement("ul");
    list.className = "stage-trophies";
    for (const id of open) {
      const t = byId(id);
      if (!t) continue;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#/trophy/" + id;
      a.textContent = t.name + (t.count ? ` (× ${t.count})` : "");
      li.appendChild(a);
      list.appendChild(li);
    }
    section.appendChild(list);
    wrap.appendChild(section);
  }
  if (!left.length) {
    const done = document.createElement("p");
    done.className = "note";
    done.textContent = "Everything is earned. Vice Got a Price! should already be yours — enjoy Leonida, Legend.";
    wrap.appendChild(done);
  }
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
