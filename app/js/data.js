// Trophy data: loading it, indexing it, and the small queries the views use.
// The file itself is fetched at run time from inside app/, never from the
// network, so the guide works with the network off.
import { DATA_URL } from "./config.js";

let cached = null;

export async function loadTrophies() {
  if (cached) return cached;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error("Could not load " + DATA_URL);
  const doc = await res.json();
  const list = Array.isArray(doc) ? doc : doc.trophies;
  cached = list.map((t, i) => ({ ...t, index: i }));
  return cached;
}

// The official counts the guide promises: 55 trophies, 1 Platinum,
// 2 Gold, 6 Silver, 46 Bronze, 28 of them hidden on PlayStation.
export function countByGrade(trophies) {
  const out = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
  for (const t of trophies) out[t.grade] = (out[t.grade] || 0) + 1;
  return out;
}

export function byId(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function byKind(trophies, kind) {
  if (kind === "all") return trophies;
  if (kind === "missable") return trophies.filter((t) => t.missable);
  if (kind === "online") return [];
  return trophies.filter((t) => t.kind === kind);
}

export function byStage(trophies, stage) {
  return trophies.filter((t) => t.stage === stage);
}

export function storyTrophies(trophies) {
  return trophies.filter((t) => t.kind === "story");
}

export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}

// Earned counts per grade, for the stats view.
export function earnedByGrade(trophies, earned) {
  const out = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
  for (const t of trophies) {
    if (earned[t.id]) out[t.grade] = (out[t.grade] || 0) + 1;
  }
  return out;
}

// A trophy's display name under the spoiler setting: story trophies stay
// hidden — name and description both — until they are earned.
export function displayName(trophy, state) {
  if (state.spoilers && trophy.kind === "story" && !state.earned[trophy.id]) {
    return "Hidden story trophy";
  }
  return trophy.name;
}

export function displayDesc(trophy, state) {
  if (state.spoilers && trophy.kind === "story" && !state.earned[trophy.id]) {
    return "This trophy's name and description stay hidden until you earn it. Turn spoilers off in Settings to reveal all story trophies.";
  }
  return trophy.desc;
}
