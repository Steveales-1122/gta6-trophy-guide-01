// History: every trophy ticked off, in the order it landed.
export function renderTimeline(ctx) {
  const { state, esc } = ctx;
  if (!state.store.history.length) {
    return `<h2>History</h2><p class="lede">Nothing earned yet. Tick a trophy off in the checklist and it will show up here, in order.</p>`;
  }
  const rows = [...state.store.history]
    .map((h) => {
      const t = state.trophies.find((x) => x.id === h.id);
      const when = new Date(h.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
      return `<li><strong>${t ? esc(ctx.masked(t) ? "Hidden trophy" : t.name) : "Trophy " + h.id}</strong> — ${esc(when)}</li>`;
    })
    .join("");
  return `<h2>History</h2><p class="lede">${state.store.history.length} trophies earned, in the order they landed.</p><ol class="tight">${rows}</ol>`;
}
