// The guide panel for one trophy: its guide in our own words, the sources
// each fact comes from, and the facts that place it on the roadmap.
export function detailHtml(ctx, t) {
  const { esc, badge, tag } = ctx;
  const earned = Boolean(ctx.state.store.earned[t.id]);
  const parts = [];
  if (t.count) parts.push(`Target: <strong>${t.count.toLocaleString("en-US")}</strong>`);
  parts.push(`Stage ${t.stage} of the roadmap`);
  if (t.missable) parts.push(`<strong>Potentially missable</strong> — see the Missables view`);
  if (t.hidden) parts.push("Hidden on PlayStation until earned");
  return `<div class="guide">${esc(t.guide)}` +
    `<div class="sources">Sources: ${t.sources.map(esc).join(" · ")} · ${badge(t.grade)} ${tag(t.kind)}</div>` +
    `<div class="sources">${parts.join(" · ")}</div>` +
    `<div class="sources">${earned ? "Earned — untick it in the checklist to mark it open again." : "Not earned yet."}</div></div>`;
}
