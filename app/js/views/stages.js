// Stages view: each roadmap stage as its own checklist, with its progress
// bar and its trophies in order. The roadmap view tells the story of the
// six stages; this view is where you tick them off one stage at a time.
import { STAGES } from "../config.js";
import { byStage, displayName, displayDesc } from "../data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderStages(root, app) {
  const { trophies, state } = app;
  const sections = STAGES.map((stage) => {
    const members = byStage(trophies, stage.id);
    const got = members.filter((t) => state.earned[t.id]).length;
    const pct = members.length ? Math.round((got / members.length) * 100) : 0;
    const items = members
      .map((t) => {
        const earned = !!state.earned[t.id];
        return `<li class="trophy-row${earned ? " is-earned" : ""}">
          <label class="row-check"><input type="checkbox" data-toggle="${esc(t.id)}"${earned ? " checked" : ""} aria-label="Mark ${esc(t.name)} earned"><span class="box" aria-hidden="true"></span></label>
          <a class="row-main" href="#/trophy/${esc(t.id)}">
            <span class="row-name">${esc(displayName(t, state))}</span>
            <span class="row-desc">${esc(displayDesc(t, state))}</span>
            <span class="row-meta"><span class="grade-chip grade-${t.grade.toLowerCase()}">${esc(t.grade)}</span><span class="kind-chip">${esc(t.kind)}</span>${t.missable ? ' <span class="flag-missable">MISSABLE</span>' : ""}</span>
          </a>
        </li>`;
      })
      .join("");
    return `<section class="stage-block" id="stage-${stage.id}">
      <header>
        <h3><span class="stage-num">Stage ${stage.id}</span> ${esc(stage.title)}</h3>
        <p>${esc(stage.blurb)}</p>
        <p class="stage-progress">${got} of ${members.length} earned</p>
        <div class="progress-track thin"><div class="progress-fill" style="width:${pct}%"></div></div>
      </header>
      <ul class="trophy-list">${items}</ul>
    </section>`;
  }).join("");

  root.innerHTML = `
    <section class="view-head">
      <h2>Stages</h2>
      <p class="view-sub">Six stages, each a checklist of its own. Finish a stage, then move to the next — the Platinum is the last line of stage 6.</p>
    </section>
    <nav class="stage-jump">${STAGES.map((s) => `<a href="#stage-${s.id}">Stage ${s.id}</a>`).join(" ")}</nav>
    ${sections}`;
}
