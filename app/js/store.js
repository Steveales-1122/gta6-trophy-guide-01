// Progress lives in localStorage: which trophies are earned, when each one
// landed, and the reader's settings. Nothing leaves the browser.
const KEY = "sunset-platinum-v1";

function blank() {
  return { earned: {}, history: [], settings: { spoilers: false, hideEarned: false } };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const doc = JSON.parse(raw);
    if (!doc || typeof doc !== "object") return blank();
    return {
      earned: doc.earned && typeof doc.earned === "object" ? doc.earned : {},
      history: Array.isArray(doc.history) ? doc.history : [],
      settings: { ...blank().settings, ...(doc.settings || {}) },
    };
  } catch {
    return blank();
  }
}

export function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function isEarned(store, id) {
  return Boolean(store.earned[id]);
}

export function toggleEarned(store, id) {
  if (store.earned[id]) {
    delete store.earned[id];
    store.history = store.history.filter((h) => h.id !== id);
  } else {
    store.earned[id] = Date.now();
    store.history.push({ id, at: Date.now() });
  }
  saveStore(store);
  return store;
}

export function earnedCount(store) {
  return Object.keys(store.earned).length;
}

export function resetStore() {
  const next = blank();
  saveStore(next);
  return next;
}

export function exportJson(store) {
  return JSON.stringify(store, null, 2);
}

export function importJson(text) {
  const doc = JSON.parse(text);
  if (!doc || typeof doc !== "object" || !doc.earned) throw new Error("not a progress file");
  const next = {
    earned: doc.earned,
    history: Array.isArray(doc.history) ? doc.history : [],
    settings: { ...blank().settings, ...(doc.settings || {}) },
  };
  saveStore(next);
  return next;
}
