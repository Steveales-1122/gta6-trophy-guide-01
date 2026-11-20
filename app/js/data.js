// Trophy data: loads app/data/trophies.json (a file of this app, nothing over
// the network) and offers the lookups the views share.
let cache = null;
let sourceList = {};

export async function loadTrophies() {
  if (cache) return cache;
  const res = await fetch("data/trophies.json");
  if (!res.ok) throw new Error("trophies.json failed to load: " + res.status);
  const doc = await res.json();
  sourceList = doc.sourceList || {};
  cache = doc.trophies || doc;
  return cache;
}

export function allTrophies() {
  return cache || [];
}

export function byId(id) {
  return (cache || []).find((t) => t.id === id) || null;
}

export function gradeRank(grade) {
  return { platinum: 0, gold: 1, silver: 2, bronze: 3 }[grade] ?? 4;
}

export function sourceName(key) {
  return (sourceList[key] && sourceList[key].name) || key;
}

export function sourceUrl(key) {
  return (sourceList[key] && sourceList[key].url) || null;
}

export function sourceKeys() {
  return Object.keys(sourceList);
}

// The official list, for the trophies check: every name the gate holds the
// app to, in the order PlayStation lists them.
export function officialNames() {
  return (cache || []).map((t) => t.name);
}
