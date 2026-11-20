// Loads the trophy file and gives the views one clean shape to work with.
let cache = null;

export async function loadTrophies() {
  if (cache) return cache;
  const res = await fetch("data/trophies.json");
  if (!res.ok) throw new Error("trophies.json did not load");
  const doc = await res.json();
  cache = doc.trophies.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    grade: t.grade,
    hidden: Boolean(t.hidden),
    kind: t.kind,
    missable: Boolean(t.missable),
    stage: t.stage,
    count: typeof t.count === "number" ? t.count : null,
    guide: t.guide,
    sources: Array.isArray(t.sources) ? t.sources : [],
  }));
  return cache;
}

export function byId(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function byKind(trophies, kind) {
  return trophies.filter((t) => t.kind === kind);
}

export function byGrade(trophies, grade) {
  return trophies.filter((t) => t.grade === grade);
}

export function isStorySpoiler(t) {
  return t.hidden && (t.kind === "story" || t.kind === "misc");
}
