// Missables view: everything that can be missed, and the save discipline
// that protects against it. Honest about what is known at launch: exactly
// one trophy is confirmed missable, and the rest are flagged only where the
// official description gives a reason to watch a window.
import { displayName } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderMissables(root, app) {
  const { trophies, state } = app;
  const missable = trophies.filter((t) => t.missable);
  const cards = missable
    .map((t) => {
      const earned = !!state.earned[t.id];
      return `<article class="missable-card${earned ? " is-earned" : ""}">
        <h3><a href="#/trophy/${esc(t.id)}">${esc(displayName(t, state))}</a> <span class="grade-chip grade-${t.grade.toLowerCase()}">${esc(t.grade)}</span></h3>
        <p class="official-desc">${esc(t.desc)}</p>
        <p>${esc(t.guide)}</p>
        <ol class="steps">${(t.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        <p><button class="btn-primary" data-toggle="${esc(t.id)}">${earned ? "Mark as not earned" : "Mark as earned"}</button></p>
      </article>`;
    })
    .join("");

  root.innerHTML = `
    <section class="view-head">
      <h2>Missable trophies</h2>
      <p class="view-sub">${missable.length} trophy in this list is confirmed missable at launch. Everything else unlocks whenever you get to it — story trophies included, as long as you finish the story.</p>
    </section>
    ${cards}
    <section class="save-discipline">
      <h3>The save discipline</h3>
      <p>GTA VI has no mission replay and no New Game Plus. One manual save per chapter is the whole insurance policy:</p>
      <ol class="steps">
        <li>At the start of Chapter 1 — and meditate at Lucia's balcony spot before the chapter ends.</li>
        <li>At the start of Chapter 2, when Jason and Lucia both become playable.</li>
        <li>At the start of Chapter 3, before the robbery trophies open up.</li>
        <li>At the start of Chapter 4.</li>
        <li>Before the final mission — the point of no return for the story.</li>
      </ol>
      <p>Keep those five saves in separate slots and don't overwrite them. If a trophy ever fails to pop, an earlier save is the only way back.</p>
    </section>
    <section>
      <h3>What is not missable</h3>
      <p>Story trophies unlock by finishing the story — none of them can be missed, they just take time. Collectibles, activities, robberies and the secret trophies all stay available in the open world after the credits. The only thing the game takes away is the Chapter 1 meditation spot, which is why it is the single flagged missable here.</p>
      <p class="sources-note">Sources: Output Lag and GTA Vibes on the Chapter 1 meditation window; Exophase (via Planet GTA 6) for the official list.</p>
    </section>`;
}
