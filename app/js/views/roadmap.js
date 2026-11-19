// Roadmap view: the six stages in order, each with its blurb, its progress
// and its trophies. This is the order the guide recommends playing in —
// story first, then strangers, then the open world, then crime, then
// activities, then secrets and the Platinum.
import { STAGES } from "../config.js";
import { byStage, displayName } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderRoadmap(root, app) {
  const { trophies, state } = app;
  const done = Object.keys(state.earned).length;
  const sections = STAGES.map((stage) => {
    const members = byStage(trophies, stage.id);
    const got = members.filter((t) => state.earned[t.id]).length;
    const pct = members.length ? Math.round((got / members.length) * 100) : 0;
    const items = members
      .map((t) => {
        const earned = !!state.earned[t.id];
        return `<li class="${earned ? "is-earned" : ""}"><a href="#/trophy/${esc(t.id)}">${esc(displayName(t, state))}</a> <span class="mini-grade">${esc(t.grade)}</span>${t.missable ? ' <span class="flag-missable">MISSABLE</span>' : ""}</li>`;
      })
      .join("");
    return `<section class="stage-block">
      <header>
        <h3><span class="stage-num">Stage ${stage.id}</span> ${esc(stage.title)}</h3>
        <p>${esc(stage.blurb)}</p>
        <p class="stage-progress">${got} of ${members.length} earned</p>
        <div class="progress-track thin"><div class="progress-fill" style="width:${pct}%"></div></div>
      </header>
      <ul class="stage-list">${items}</ul>
    </section>`;
  }).join("");

  root.innerHTML = `
    <section class="view-head">
      <h2>Roadmap to the Platinum</h2>
      <p class="view-sub">${done} of ${trophies.length} earned. Six stages, in order — each one builds on the last, and the Platinum is stage 6's last step.</p>
    </section>
    <aside class="warn-box"><strong>Before you start:</strong> make a manual save at the start of every chapter. GTA VI has no mission replay, and the one missable trophy (Positive Mental Attitude) hinges on a Chapter 1 spot. Cheats disable trophies — keep them off this save.</aside>
    ${sections}`;
}
