// The planner: everything still open, ordered by roadmap stage, with the
// missable trophy pinned first so it never gets forgotten.
export function renderPlanner(ctx) {
  const { state, esc, badge, tag } = ctx;
  const open = state.trophies.filter((t) => !state.store.earned[t.id]);
  if (!open.length) {
    return `<h2>Planner</h2><p class="lede">Nothing left — every trophy is earned. The Platinum is yours.</p>`;
  }
  const ordered = [...open].sort((a, b) => {
    if (a.missable !== b.missable) return a.missable ? -1 : 1;
    return a.stage - b.stage || a.id - b.id;
  });
  const rows = ordered
    .map((t) => {
      const label = ctx.masked(t) ? "Hidden trophy" : t.name;
      return `<tr><td><input type="checkbox" data-action="earn" data-id="${t.id}" aria-label="Mark ${esc(label)} earned"></td>` +
        `<td><button class="tname" data-action="open" data-id="${t.id}">${esc(label)}</button>${t.missable ? ` ${tag("missable", "missable")}` : ""}</td>` +
        `<td>${badge(t.grade)}</td><td>Stage ${t.stage}</td><td>${esc(ctx.displayDesc(t))}</td></tr>`;
    })
    .join("");
  return `<h2>Planner</h2><p class="lede">${open.length} trophies still open, ordered by roadmap stage — the missable one first. Tick one off when it pops.</p>` +
    `<table class="list"><thead><tr><th></th><th>Trophy</th><th>Grade</th><th>Stage</th><th>What it asks</th></tr></thead><tbody>${rows}</tbody></table>`;
}
