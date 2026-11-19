// Loads the official trophy list (app/data/trophies.json) and indexes it by id and name.
let cache = null;

export async function loadTrophies() {
  if (cache) return cache;
  const res = await fetch('data/trophies.json');
  if (!res.ok) throw new Error('trophy list failed to load');
  const doc = await res.json();
  const trophies = doc.trophies.slice().sort((a, b) => a.id - b.id);
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const byName = new Map(trophies.map((t) => [t.name, t]));
  cache = { doc, trophies, byId, byName };
  return cache;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}
