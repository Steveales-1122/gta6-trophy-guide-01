// Planner view: what to do next. It looks at the earliest roadmap stage
// with anything left in it, lists the open trophies there, and reminds the
// player about the manual saves. It also lists the long grinds with their
// counts, so a session can be planned around them.
import { STAGES } from "../config.js";
import { byStage, displayName } from "../data.js";
import { nextTodo } from "../filters.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderPlanner(root, app) {
  const { trophies, state } = app;
  const done = Object.keys(state.earned).length;
  const current = STAGES.find((s) => byStage(trophies, s.id).some((t) => !state.earned[t.id]));
  const open = current ? byStage(trophies, current.id).filter((t) => !state.earned[t.id]) : [];
  const grinds = trophies
    .filter((t) => t.count && !state.earned[t.id])
    .sort((a, b) => b.count - a.count);
  const nextByKind = ["story", "collectible", "robbery", "activity"]
    .map((k) => ({ kind: k, next: nextTodo(trophies, state, k) }))
    .filter((x) => x.next);

  root.innerHTML = `
    <section class="view-head">
      <h2>Planner</h2>
      <p class="view-sub">${done} of ${trophies.length} earned. Here is the shortest sensible path from where you are now.</p>
    </section>
    ${
      current
        ? `<section class="stage-block">
          <header><h3><span class="stage-num">Now</span> Stage ${current.id} — ${esc(current.title)}</h3>
          <p>${esc(current.blurb)}</p></header>
          <ul class="stage-list">
            ${open.map((t) => `<li><a href="#/trophy/${esc(t.id)}">${esc(displayName(t, state))}</a> <span class="mini-grade">${esc(t.grade)}</span>${t.missable ? ' <span class="flag-missable">MISSABLE</span>' : ""}${t.count ? ` <span class="flag-count">${t.count}×</span>` : ""}</li>`).join("")}
          </ul>
        </section>`
        : `<section class="stage-block"><h3>All done</h3><p>Every trophy is earned — the Platinum should already be yours. Congratulations, Leonida Legend.</p></section>`
    }
    <section>
      <h3>Next up, by kind</h3>
      <ul class="stage-list">
        ${nextByKind.map((x) => `<li>${esc(x.kind)}: <a href="#/trophy/${esc(x.next.id)}">${esc(displayName(x.next, state))}</a></li>`).join("")}
      </ul>
    </section>
    <section>
      <h3>Long grinds — start these early</h3>
      <p>These count up over the whole game. They are listed biggest first; chip at them whenever you play rather than saving them for the end.</p>
      <ul class="stage-list">
        ${grinds.map((t) => `<li><a href="#/trophy/${esc(t.id)}">${esc(displayName(t, state))}</a> — ${t.count}× (${esc(t.desc)})</li>`).join("")}
      </ul>
    </section>
    <section class="save-discipline">
      <h3>Session checklist</h3>
      <ol class="steps">
        <li>Before you play: is there a manual save at the start of the current chapter? If not, make one.</li>
        <li>Chapter 1 only: meditate at Lucia's balcony spot before the chapter ends.</li>
        <li>Cheats stay off the trophy save — they disable trophies and saving.</li>
        <li>After you play: tick what you earned here, then export a backup from Settings once in a while.</li>
      </ol>
    </section>`;
}
