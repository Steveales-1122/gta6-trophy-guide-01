// Detail view: one trophy, opened from the checklist — official name,
// description and grade, the guide in our own words, its sources, and the
// earn toggle with the timestamp when it was ticked off.
import { GRADE_LABEL, KIND_LABEL } from "../config.js";
import { getState, isEarned, toggleEarned, earnedAt } from "../store.js";
import { isMasked, displayName, displayDescription } from "../filters.js";
import { byId, sourceName, sourceUrl } from "../data.js";

export function renderDetail(el, ctx, id) {
  const t = byId(id);
  const state = getState();
  const wrap = document.createElement("div");
  wrap.className = "view detail-view";
  if (!t) {
    wrap.innerHTML = `<h2>Unknown trophy</h2><p>That trophy is not on the list. <a href="#/checklist">Back to the checklist</a>.</p>`;
    el.appendChild(wrap);
    return;
  }
  const masked = isMasked(t, state);
  const earned = isEarned(t.id);
  const when = earnedAt(t.id);

  const head = document.createElement("div");
  head.className = "detail-head";
  head.innerHTML =
    `<a class="back" href="#/checklist">← Checklist</a>` +
    `<span class="grade-badge big">${GRADE_LABEL[t.grade]}</span>` +
    `<h2>${escapeHtml(displayName(t, state))}</h2>` +
    `<p class="detail-desc">${escapeHtml(displayDescription(t, state))}</p>` +
    `<p class="detail-meta">${KIND_LABEL[t.kind]}${t.count ? ` · target ${t.count}` : ""}${t.missable ? " · Missable" : ""}${masked ? " · Hidden until earned" : ""}</p>`;
  wrap.appendChild(head);

  const toggle = document.createElement("button");
  toggle.className = "primary";
  toggle.textContent = earned ? "Mark as not earned" : "Mark as earned";
  toggle.addEventListener("click", () => {
    toggleEarned(t.id);
    ctx.refresh();
  });
  wrap.appendChild(toggle);
  if (earned && when) {
    const stamp = document.createElement("p");
    stamp.className = "earned-stamp";
    stamp.textContent = "Earned " + new Date(when).toLocaleString();
    wrap.appendChild(stamp);
  }

  const guide = document.createElement("section");
  guide.className = "guide-block";
  guide.innerHTML = `<h3>How to get it</h3><p>${masked ? "Earn this trophy to reveal its guide." : escapeHtml(t.guide)}</p>`;
  wrap.appendChild(guide);

  const src = document.createElement("section");
  src.className = "source-block";
  const items = (t.sources || []).map((key) => {
    const url = sourceUrl(key);
    const name = sourceName(key);
    return url ? `<li><a href="${url}" target="_blank" rel="noopener">${escapeHtml(name)}</a></li>` : `<li>${escapeHtml(name)}</li>`;
  }).join("");
  src.innerHTML = `<h3>Sources</h3><p>Each fact above is cited, never copied. The official name and description are shown as PlayStation publishes them.</p><ul>${items}</ul>`;
  wrap.appendChild(src);

  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
