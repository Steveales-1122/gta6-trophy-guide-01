// Missables view: the one trophy that can be missed, front and centre,
// with the exact moment to catch it — plus the story trophies that are
// easy to walk past without noticing.
import { getState, isEarned } from "../store.js";
import { byId } from "../data.js";

export function renderMissables(el, ctx) {
  const state = getState();
  const wrap = document.createElement("div");
  wrap.className = "view missables-view";
  wrap.innerHTML = `<h2>Missable trophies</h2><p>Only one trophy in GTA VI is currently flagged as potentially missable. Everything else can be cleaned up in free roam after the story.</p>`;

  const missable = ctx.trophies.filter((t) => t.missable);
  for (const t of missable) {
    const card = document.createElement("article");
    card.className = "missable-card";
    card.innerHTML =
      `<h3>${escapeHtml(t.name)} <span class="flag missable">Missable</span></h3>` +
      `<p class="detail-desc">${escapeHtml(t.description)}</p>` +
      `<p>${escapeHtml(t.guide)}</p>` +
      `<p><a href="#/trophy/${t.id}">Open the full guide →</a></p>`;
    wrap.appendChild(card);
  }

  const note = document.createElement("section");
  note.className = "note";
  note.innerHTML = `<h3>Why only one?</h3><p>There is no mission replay and no New Game Plus, so the guides flag anything that could lock. The community agrees on one: the balcony meditation in Chapter 1. Manual saves help everywhere else — keep one at the start and end of each chapter.</p>`;
  wrap.appendChild(note);

  const story = document.createElement("section");
  story.innerHTML = `<h3>Story trophies — unmissable, but easy to rush past</h3><p>These twelve pop as you play the campaign. Tick them as they land so the checklist stays honest.</p>`;
  const list = document.createElement("ul");
  list.className = "stage-trophies";
  for (const t of ctx.trophies.filter((x) => x.kind === "story")) {
    const li = document.createElement("li");
    li.className = isEarned(t.id) ? "earned" : "";
    const a = document.createElement("a");
    a.href = "#/trophy/" + t.id;
    a.textContent = (isEarned(t.id) ? "✓ " : "") + t.name;
    li.appendChild(a);
    list.appendChild(li);
  }
  story.appendChild(list);
  wrap.appendChild(story);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
