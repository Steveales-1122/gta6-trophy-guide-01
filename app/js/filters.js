// Checklist filtering: kind, earned state, and the search box.
// Pure functions over the trophy list, so the views stay thin.
export function blankFilter() {
  return { kind: "all", show: "all", query: "" };
}

// show is one of "all" | "earned" | "todo".
export function applyFilter(trophies, state, filter) {
  const q = filter.query.trim().toLowerCase();
  let list = trophies;
  if (filter.kind === "missable") {
    list = list.filter((t) => t.missable);
  } else if (filter.kind === "online") {
    list = [];
  } else if (filter.kind !== "all") {
    list = list.filter((t) => t.kind === filter.kind);
  }
  if (filter.show === "earned") {
    list = list.filter((t) => state.earned[t.id]);
  } else if (filter.show === "todo") {
    list = list.filter((t) => !state.earned[t.id]);
  }
  if (q) {
    list = list.filter((t) => {
      const hay = [t.name, t.desc, t.guide, t.kind, t.grade].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }
  return list;
}

// Progress inside one filtered list, for the "x of y" line above it.
export function filterProgress(trophies, state, filter) {
  const list = applyFilter(trophies, state, filter);
  const done = list.filter((t) => state.earned[t.id]).length;
  return { done, total: list.length };
}

// The next unearned trophy of a kind, for the planner's "do this next" line.
export function nextTodo(trophies, state, kind) {
  const list = applyFilter(trophies, state, { kind, show: "todo", query: "" });
  return list.length ? list[0] : null;
}
