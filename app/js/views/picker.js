// Surprise-me picker: one random unearned trophy, with its guide, and a
// button for another one. For the player who opens the guide and asks
// "what should I do tonight?" — plus a mark-earned button right there.
import { displayName, displayDesc } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pickRandom(trophies, state, excludeId) {
  const pool = trophies.filter((t) => !state.earned[t.id] && t.id !== excludeId);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function renderPicker(root, app) {
  const { trophies, state } = app;
  const remaining = trophies.filter((t) => !state.earned[t.id]).length;
  const current = app.picked && !state.earned[app.picked] ? trophies.find((t) => t.id === app.picked) : null;
  const choice = current || pickRandom(trophies, state, null);
  if (choice) app.picked = choice.id;

  if (!choice) {
    root.innerHTML = `
      <section class="view-head">
        <h2>Surprise me</h2>
        <p class="view-sub">Nothing left to pick — every trophy is earned. The Platinum is yours.</p>
      </section>
      <p><a class="btn" href="#/stats">See your stats</a></p>`;
    return;
  }

  root.innerHTML = `
    <section class="view-head">
      <h2>Surprise me</h2>
      <p class="view-sub">One random trophy from the ${remaining} you have not earned yet. Do it tonight, or roll again.</p>
    </section>
    <article class="detail-card">
      <header>
        <span class="grade-chip grade-${choice.grade.toLowerCase()}">${esc(choice.grade)}</span>
        ${choice.hidden ? `<span class="flag-hidden">HIDDEN ON PLAYSTATION</span>` : ""}
        ${choice.missable ? `<span class="flag-missable">MISSABLE</span>` : ""}
        <h2><a href="#/trophy/${esc(choice.id)}">${esc(displayName(choice, state))}</a></h2>
        <p class="official-desc">${esc(displayDesc(choice, state))}</p>
        <p class="detail-meta">Kind: ${esc(choice.kind)} &middot; Roadmap stage ${choice.stage}${choice.count ? ` &middot; Count: ${choice.count}` : ""}</p>
      </header>
      <section>
        <h3>Guide</h3>
        <p>${esc(choice.guide)}</p>
        <ol class="steps">${(choice.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      </section>
      <footer class="detail-actions">
        <button class="btn-primary" data-toggle="${esc(choice.id)}">Mark as earned</button>
        <button class="btn" data-pick-another>Another one</button>
        <a class="btn" href="#/trophy/${esc(choice.id)}">Full guide &rarr;</a>
      </footer>
    </article>`;

  root.querySelector("[data-pick-another]").addEventListener("click", () => {
    const next = pickRandom(trophies, state, choice.id);
    app.picked = next ? next.id : null;
    app.render();
  });
}
