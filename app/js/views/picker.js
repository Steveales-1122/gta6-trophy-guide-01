// Picker view: "what next?" — one suggestion at a time. It prefers the
// missable trophy, then the earliest open roadmap stage, then the quickest
// wins (small counts first), and lets you roll for another pick.
import { ROADMAP } from "../config.js";
import { getState, isEarned } from "../store.js";
import { byId } from "../data.js";

function rankPick(trophies) {
  const state = getState();
  const open = trophies.filter((t) => !isEarned(t.id));
  if (!open.length) return null;
  const missable = open.find((t) => t.missable);
  if (missable) return { trophy: missable, reason: "The only missable trophy — do it before leaving Chapter 1." };
  const stageOrder = new Map();
  ROADMAP.forEach((stage, i) => stage.trophies.forEach((id) => stageOrder.set(id, i)));
  const sorted = [...open].sort((a, b) => {
    const s = (stageOrder.get(a.id) ?? 99) - (stageOrder.get(b.id) ?? 99);
    if (s !== 0) return s;
    return (a.count ?? 1) - (b.count ?? 1);
  });
  const pick = sorted[0];
  const stage = ROADMAP[stageOrder.get(pick.id)] || null;
  return {
    trophy: pick,
    reason: stage
      ? `Earliest open step: ${stage.title}.`
      : "The quickest open trophy on the list.",
  };
}

export function renderPicker(el, ctx) {
  const wrap = document.createElement("div");
  wrap.className = "view picker-view";
  wrap.innerHTML = `<h2>What next?</h2><p>One suggestion at a time, picked from what is still open.</p>`;
  const pick = rankPick(ctx.trophies);
  if (!pick) {
    wrap.innerHTML += `<p class="note">Everything is earned. Nothing left to pick — enjoy the Platinum.</p>`;
    el.appendChild(wrap);
    return;
  }
  const card = document.createElement("article");
  card.className = "pick-card";
  card.innerHTML =
    `<span class="grade-badge">${pick.trophy.grade}</span>` +
    `<h3>${escapeHtml(pick.trophy.name)}</h3>` +
    `<p class="detail-desc">${escapeHtml(pick.trophy.description)}</p>` +
    `<p>${escapeHtml(pick.reason)}</p>` +
    `<p><a href="#/trophy/${pick.trophy.id}">Open the full guide →</a></p>`;
  wrap.appendChild(card);
  const again = document.createElement("button");
  again.className = "primary";
  again.textContent = "Pick another";
  again.addEventListener("click", () => {
    // Hide this one for this session and pick the next best.
    const hidden = new Set(ctx.hiddenPicks || []);
    hidden.add(pick.trophy.id);
    ctx.hiddenPicks = hidden;
    const rest = ctx.trophies.filter((t) => !hidden.has(t.id));
    const next = rankPick(rest);
    if (next) {
      card.querySelector("h3").textContent = next.trophy.name;
      card.querySelector(".detail-desc").textContent = next.trophy.description;
      card.querySelector(".grade-badge").textContent = next.trophy.grade;
      card.querySelectorAll("p")[1].textContent = next.reason;
      card.querySelector("a").href = "#/trophy/" + next.trophy.id;
    } else {
      again.disabled = true;
      again.textContent = "No more picks";
    }
  });
  wrap.appendChild(again);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
