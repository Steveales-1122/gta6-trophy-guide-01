// Saved progress: earned trophies with timestamps, plus the reader's
// settings. Everything lives in localStorage under one key, so the guide
// works offline and survives a reload. Export and import move it as JSON.
import { STORAGE_KEY } from "./config.js";

function blankState() {
  return {
    earned: {},
    settings: { spoilers: true, hideEarned: false },
  };
}

let state = blankState();
let listeners = [];

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state = {
          earned: parsed.earned && typeof parsed.earned === "object" ? parsed.earned : {},
          settings: { ...blankState().settings, ...(parsed.settings || {}) },
        };
      }
    }
  } catch (err) {
    state = blankState();
  }
  return state;
}

export function getState() {
  return state;
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage full or blocked: the session still works in memory.
  }
  for (const fn of listeners) fn(state);
}

export function onChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

export function isEarned(id) {
  return Object.prototype.hasOwnProperty.call(state.earned, id);
}

export function earnedAt(id) {
  return state.earned[id] || null;
}

export function earnedCount() {
  return Object.keys(state.earned).length;
}

export function toggleEarned(id) {
  if (isEarned(id)) {
    delete state.earned[id];
  } else {
    state.earned[id] = new Date().toISOString();
  }
  saveState();
  return isEarned(id);
}

export function setEarned(id, when) {
  if (when) state.earned[id] = when;
  else delete state.earned[id];
  saveState();
}

export function setSetting(key, value) {
  state.settings[key] = value;
  saveState();
}

export function getSetting(key) {
  return state.settings[key];
}

export function earnedList() {
  return Object.entries(state.earned)
    .map(([id, at]) => ({ id, at }))
    .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}

export function exportState() {
  return JSON.stringify({ app: "sunset-platinum", version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2);
}

export function importState(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || typeof parsed.earned !== "object") {
    throw new Error("That file is not a Sunset Platinum export.");
  }
  const earned = {};
  for (const [id, at] of Object.entries(parsed.earned)) {
    if (typeof id === "string" && typeof at === "string") earned[id] = at;
  }
  state = {
    earned,
    settings: { ...blankState().settings, ...(parsed.settings || {}) },
  };
  saveState();
  return Object.keys(earned).length;
}

export function resetAll() {
  state = blankState();
  saveState();
}
