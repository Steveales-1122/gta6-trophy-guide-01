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

// Count trophies by a field (grade, kind or stage) for the Stats dashboard.
// Returns a Map from field value to count, in first-seen order.
export function countBy(trophies, field) {
  const counts = new Map();
  for (const t of trophies) {
    const key = t[field];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// The unearned trophies of one grade, rarest grade first when the caller
// passes grades in rarity order (platinum, gold, silver, bronze).
export function unearnedByGrade(trophies, earned, grades) {
  const out = [];
  for (const grade of grades) {
    for (const t of trophies) {
      if (t.grade === grade && !earned.has(t.name)) out.push(t);
    }
  }
  return out;
}
