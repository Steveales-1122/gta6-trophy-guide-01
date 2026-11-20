// Filtering and spoiler handling: one place where the checklist, the stats
// and the picker all agree on what "visible" means.
import { FILTER_DEFS } from "./config.js";
import { isEarned } from "./store.js";

export function filterDef(id) {
  return FILTER_DEFS.find((f) => f.id === id) || FILTER_DEFS[0];
}

// A hidden trophy stays hidden while spoilers are on and it is not earned:
// its name and description read as "Hidden trophy" until then.
export function isMasked(trophy, state) {
  if (!trophy.hidden) return false;
  if (!state.settings.spoilers) return false;
  return !isEarned(trophy.id);
}

export function displayName(trophy, state) {
  return isMasked(trophy, state) ? "Hidden trophy" : trophy.name;
}

export function displayDescription(trophy, state) {
  return isMasked(trophy, state) ? "Earn it to reveal the name and description." : trophy.description;
}

export function applyFilters(trophies, state, opts) {
  const { kind = "all", query = "", earned = "all", missableOnly = false } = opts || {};
  const def = filterDef(kind);
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (!def.match(t)) return false;
    if (missableOnly && !t.missable) return false;
    if (earned === "earned" && !isEarned(t.id)) return false;
    if (earned === "unearned" && isEarned(t.id)) return false;
    if (q) {
      const hay = (t.name + " " + t.description + " " + t.guide + " " + t.kind).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortForChecklist(trophies) {
  const rank = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
  return [...trophies].sort((a, b) => {
    const r = (rank[a.grade] ?? 4) - (rank[b.grade] ?? 4);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name);
  });
}
