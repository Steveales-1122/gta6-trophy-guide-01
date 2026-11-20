// The checklist's filter state: kind, grade, text search and earned filter.
export function blankFilter() {
  return { kind: "all", grade: "all", q: "", earned: "all" };
}

export function applyFilter(trophies, filter, store) {
  const q = filter.q.trim().toLowerCase();
  return trophies.filter((t) => {
    if (filter.kind !== "all" && t.kind !== filter.kind) return false;
    if (filter.grade !== "all" && t.grade !== filter.grade) return false;
    if (filter.earned === "earned" && !store.earned[t.id]) return false;
    if (filter.earned === "open" && store.earned[t.id]) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function kindCounts(trophies) {
  const out = {};
  for (const t of trophies) out[t.kind] = (out[t.kind] || 0) + 1;
  return out;
}
