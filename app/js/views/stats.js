// Stats view: the dashboard. Totals, per-grade and per-kind bars, per-stage
// progress, and the grade points this guide uses as a rough weight.
import { GRADES, KINDS, STAGES } from "../config.js";
import { countByGrade, earnedByGrade, byStage } from "../data.js";
import { gradePoints } from "../export-md.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function bar(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<div class="progress-track thin"><div class="progress-fill" style="width:${pct}%"></div></div><span class="bar-num">${done}/${total}</span>`;
}

export function renderStats(root, app) {
  const { trophies, state } = app;
  const done = Object.keys(state.earned).length;
  const total = trophies.length;
  const pct = Math.round((done / total) * 100);
  const totals = countByGrade(trophies);
  const earned = earnedByGrade(trophies, state);
  const points = gradePoints(trophies, state);
  const maxPoints = trophies.reduce((sum, t) => sum + ({ Platinum: 0, Gold: 90, Silver: 30, Bronze: 15 }[t.grade] || 0), 0);

  const gradeRows = GRADES.map((g) => {
    const n = totals[g] || 0;
    const e = earned[g] || 0;
    return `<tr><td><span class="grade-chip grade-${g.toLowerCase()}">${esc(g)}</span></td><td>${bar(e, n)}</td></tr>`;
  }).join("");

  const kindRows = KINDS.filter((k) => !["all", "online"].includes(k.id))
    .map((k) => {
      let members;
      if (k.id === "missable") members = trophies.filter((t) => t.missable);
      else members = trophies.filter((t) => t.kind === k.id);
      const e = members.filter((t) => state.earned[t.id]).length;
      return `<tr><td>${esc(k.label)}</td><td>${bar(e, members.length)}</td></tr>`;
    })
    .join("");

  const stageRows = STAGES.map((s) => {
    const members = byStage(trophies, s.id);
    const e = members.filter((t) => state.earned[t.id]).length;
    return `<tr><td>Stage ${s.id} — ${esc(s.title)}</td><td>${bar(e, members.length)}</td></tr>`;
  }).join("");

  root.innerHTML = `
    <section class="view-head">
      <h2>Stats</h2>
      <p class="view-sub">Your hunt so far, measured three ways: by grade, by kind and by roadmap stage.</p>
    </section>
    <div class="stat-grid">
      <div class="stat-card"><span class="stat-big">${done}</span><span class="stat-label">of ${total} trophies (${pct}%)</span></div>
      <div class="stat-card"><span class="stat-big">${points}</span><span class="stat-label">grade points of ${maxPoints}</span></div>
      <div class="stat-card"><span class="stat-big">${trophies.filter((t) => t.hidden).length}</span><span class="stat-label">hidden trophies in the list</span></div>
      <div class="stat-card"><span class="stat-big">${trophies.filter((t) => t.missable).length}</span><span class="stat-label">missable trophies</span></div>
    </div>
    <section><h3>By grade</h3><table class="stat-table">${gradeRows}</table></section>
    <section><h3>By kind</h3><table class="stat-table">${kindRows}</table></section>
    <section><h3>By roadmap stage</h3><table class="stat-table">${stageRows}</table></section>
    <p class="sources-note">Grade points are this guide's own rough weight (Bronze 15, Silver 30, Gold 90, Platinum 0) — not an official score. The counts are the official list: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze.</p>`;
}
