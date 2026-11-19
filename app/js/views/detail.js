// Detail view: one trophy, whole. Official name and description, grade,
// kind, stage, missable warning, the guide in this entry's own words with
// its steps, and the sources it cites. Story trophies stay masked here too
// while spoilers are on and the trophy is not earned yet.
import { SOURCE_LINKS, STAGES } from "../config.js";
import { displayName, displayDesc } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sourceLink(name) {
  const url = SOURCE_LINKS[name];
  if (url) return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`;
  return esc(name);
}

export function renderDetail(root, app, id) {
  const { trophies, state } = app;
  const t = trophies.find((x) => x.id === id);
  if (!t) {
    root.innerHTML = `<section class="view-head"><h2>Trophy not found</h2><p class="view-sub">No trophy with that id. <a href="#/checklist">Back to the checklist</a>.</p></section>`;
    return;
  }
  const earned = !!state.earned[t.id];
  const stage = STAGES.find((s) => s.id === t.stage);
  const idx = trophies.indexOf(t);
  const prev = trophies[(idx - 1 + trophies.length) % trophies.length];
  const next = trophies[(idx + 1) % trophies.length];
  const steps = (t.steps || []).map((s) => `<li>${esc(s)}</li>`).join("");
  const sources = (t.sources || []).map((s) => `<li>${sourceLink(s)}</li>`).join("");
  const masked = state.spoilers && t.kind === "story" && !earned;

  root.innerHTML = `
    <p class="crumbs"><a href="#/checklist">Checklist</a> &rsaquo; ${esc(t.kind)} &rsaquo; stage ${t.stage}</p>
    <article class="detail-card${earned ? " is-earned" : ""}">
      <header>
        <span class="grade-chip grade-${t.grade.toLowerCase()}">${esc(t.grade)}</span>
        ${t.hidden ? `<span class="flag-hidden">HIDDEN ON PLAYSTATION</span>` : ""}
        ${t.missable ? `<span class="flag-missable">MISSABLE</span>` : ""}
        <h2>${esc(displayName(t, state))}</h2>
        <p class="official-desc">${esc(displayDesc(t, state))}</p>
        <p class="detail-meta">
          Kind: ${esc(t.kind)} &middot; Roadmap stage ${t.stage} — ${esc(stage ? stage.title : "")}
          ${t.count ? ` &middot; Count: ${t.count}` : ""}
          ${earned ? ` &middot; Earned ${esc(state.earned[t.id].slice(0, 10))}` : ""}
        </p>
      </header>
      ${
        t.missable
          ? `<aside class="warn-box"><strong>Missable — read this first.</strong> ${esc(t.name)} can be missed: ${esc(t.id === "positive-mental-attitude" ? "Lucia's Chapter 1 balcony meditation spot disappears after Chapter 1, and the game has no mission replay. Meditate there before finishing Chapter 1, and keep a manual save at the start of every chapter." : "Check the guide below before the window for it passes.")}</aside>`
          : ""
      }
      <section>
        <h3>Guide</h3>
        <p>${masked ? "This story trophy's guide is hidden until you earn it — turn spoilers off in Settings to read it now." : esc(t.guide)}</p>
        ${steps && !masked ? `<ol class="steps">${steps}</ol>` : ""}
      </section>
      <section>
        <h3>Sources</h3>
        <p class="sources-note">Each fact in this guide comes from one of these sources. The official name and description are PlayStation's own words; the rest is written for this guide.</p>
        <ul class="sources">${sources}</ul>
      </section>
      <footer class="detail-actions">
        <button class="btn-primary" data-toggle="${esc(t.id)}">${earned ? "Mark as not earned" : "Mark as earned"}</button>
        <a class="btn" href="#/trophy/${esc(prev.id)}">&larr; ${esc(prev.name)}</a>
        <a class="btn" href="#/trophy/${esc(next.id)}">${esc(next.name)} &rarr;</a>
      </footer>
    </article>`;
}
