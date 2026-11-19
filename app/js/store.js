// Progress state: what the player earned, when, and the spoiler setting.
// Everything lives in localStorage under one key, so the checklist survives
// a reload and the app never talks to a server.
import { STORAGE_KEY } from "./config.js";

export function blankState() {
  return { earned: {}, spoilers: true, version: 2 };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return blankState();
    return {
      earned: parsed.earned && typeof parsed.earned === "object" ? parsed.earned : {},
      spoilers: parsed.spoilers !== false,
      version: 2,
    };
  } catch (err) {
    return blankState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Private browsing or a full store: the checklist still works in memory.
  }
}

// Mark a trophy earned (recording the moment) or un-earn it again.
export function toggleEarned(state, id) {
  if (state.earned[id]) {
    delete state.earned[id];
  } else {
    state.earned[id] = new Date().toISOString();
  }
  saveState(state);
  return state;
}

export function earnedCount(state) {
  return Object.keys(state.earned).length;
}

export function earnedList(state) {
  return Object.entries(state.earned)
    .map(([id, at]) => ({ id, at }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

// Export: a JSON file the player can keep or move to another browser.
export function exportJson(state) {
  return JSON.stringify(
    { app: "sunset-platinum", version: 2, exportedAt: new Date().toISOString(), state },
    null,
    2,
  );
}

// Import: accepts a file exported by this app (or hand-written in the same
// shape) and merges its earned trophies into the current state.
export function importJson(text) {
  const doc = JSON.parse(text);
  const incoming = doc.state || doc;
  if (!incoming || typeof incoming.earned !== "object") {
    throw new Error("That file is not a Sunset Platinum export.");
  }
  const state = loadState();
  for (const [id, at] of Object.entries(incoming.earned)) {
    if (typeof at === "string" && !state.earned[id]) state.earned[id] = at;
  }
  if (typeof incoming.spoilers === "boolean") state.spoilers = incoming.spoilers;
  saveState(state);
  return state;
}

export function resetState() {
  const state = blankState();
  saveState(state);
  return state;
}
