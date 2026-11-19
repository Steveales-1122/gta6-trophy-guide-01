// Markdown export: the whole checklist as a portable .md file, with the
// earned marks, the roadmap stages and the per-trophy guides included.
import { GRADE_POINTS } from "./config.js";

function check(state, trophy) {
  return state.earned[trophy.id] ? "x" : " ";
}

function gradeLine(trophy) {
  return trophy.grade + (trophy.hidden ? " (hidden)" : "");
}

export function buildMarkdown(trophies, state) {
  const done = Object.keys(state.earned).length;
  const lines = [];
  lines.push("# Sunset Platinum — GTA VI Trophy Checklist");
  lines.push("");
  lines.push(
    "Grand Theft Auto VI on PlayStation 5: 55 trophies — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze. " +
      "Progress: " + done + " of " + trophies.length + " earned.",
  );
  lines.push("");
  lines.push("Exported from the Sunset Platinum guide (offline, localStorage progress).");
  lines.push("");
  lines.push("## Progress by grade");
  lines.push("");
  for (const grade of ["Platinum", "Gold", "Silver", "Bronze"]) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && state.earned[t.id]).length;
    lines.push("- " + grade + ": " + got + " / " + total);
  }
  lines.push("");
  lines.push("## Roadmap");
  lines.push("");
  const stages = [1, 2, 3, 4, 5, 6];
  const stageNames = {
    1: "Play the story",
    2: "Strangers and side strands",
    3: "See all of Leonida",
    4: "Crime pays",
    5: "Master the activities",
    6: "Secrets and the Platinum",
  };
  for (const stage of stages) {
    const members = trophies.filter((t) => t.stage === stage);
    const got = members.filter((t) => state.earned[t.id]).length;
    lines.push("### Stage " + stage + ": " + stageNames[stage] + " (" + got + "/" + members.length + ")");
    lines.push("");
    for (const t of members) {
      const when = state.earned[t.id] ? " — earned " + state.earned[t.id].slice(0, 10) : "";
      lines.push("- [" + check(state, t) + "] **" + t.name + "** (" + gradeLine(t) + ")" + when);
      lines.push("  - Official: " + t.desc);
      lines.push("  - Guide: " + t.guide);
      if (t.missable) lines.push("  - Missable: yes — see the guide.");
      if (t.sources && t.sources.length) lines.push("  - Sources: " + t.sources.join("; "));
    }
    lines.push("");
  }
  lines.push("## Missable trophies");
  lines.push("");
  const missable = trophies.filter((t) => t.missable);
  if (missable.length === 0) {
    lines.push("None flagged.");
  } else {
    for (const t of missable) {
      lines.push("- [" + check(state, t) + "] **" + t.name + "** — " + t.guide);
    }
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- The game has no mission replay: keep a manual save at the start of every chapter.");
  lines.push("- Cheats disable trophies (and saving) — keep them off the trophy save.");
  lines.push("- There are no online trophies: every trophy unlocks in single-player.");
  lines.push("");
  return lines.join("\n");
}

export function gradePoints(trophies, state) {
  let points = 0;
  for (const t of trophies) {
    if (state.earned[t.id]) points += GRADE_POINTS[t.grade] || 0;
  }
  return points;
}
