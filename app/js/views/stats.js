// The stats dashboard: progress by grade, by kind, hidden vs revealed counts,
// per-roadmap-stage bars, and the rarest trophies still unearned.
// Reads only the shared store and data — no network, no new state.
import { ROADMAP, GRADES, KINDS } from '../config.js';
import { store } from '../store.js';
import { isSpoiled, visibleName } from '../filters.js';
import { gradeLabel, kindLabel } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function bar(done, total) {
  const wrap = el('div', 'stat-bar');
  const fill = el('div', 'stat-fill');
  fill.style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
  wrap.append(fill);
  return wrap;
}

function row(label, done, total) {
  const line = el('div', 'stat-row');
  line.append(el('span', 'stat-label', label));
  line.append(bar(done, total));
  line.append(el('span', 'stat-count', `${done}/${total}`));
  return line;
}

function gradeOrder(a, b) {
  return GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade);
}

export function renderStats(view, data) {
  const { trophies } = data;
  const s = store.settings;
  const earned = store.earned;
  const total = trophies.length;
  const doneCount = earned.size;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  view.replaceChildren();

  const head = el('div', 'stats-head');
  const ring = el('div', 'stat-ring');
  ring.style.setProperty('--pct', `${pct}`);
  ring.append(el('span', 'stat-ring-num', `${pct}%`));
  head.append(ring);
  const summary = el('div');
  summary.append(el('h2', '', `${doneCount} of ${total} trophies earned`));
  summary.append(el('p', 'count-line', doneCount === total
    ? 'Every trophy is earned — Vice Got a Price! is yours.'
    : `${total - doneCount} to go. The platinum pops when the last one lands.`));
  head.append(summary);
  view.append(head);

  const byGrade = el('section', 'stats-block');
  byGrade.append(el('h2', '', 'Progress by grade'));
  for (const grade of GRADES) {
    const members = trophies.filter((t) => t.grade === grade);
    const done = members.filter((t) => earned.has(t.name)).length;
    byGrade.append(row(gradeLabel(grade), done, members.length));
  }
  view.append(byGrade);

  const byKind = el('section', 'stats-block');
  byKind.append(el('h2', '', 'Progress by kind'));
  for (const kind of KINDS) {
    if (kind.id === 'online') continue; // No online trophies exist in this list.
    const members = trophies.filter((t) => t.kind === kind.id);
    if (!members.length) continue; // 'Missable' is a flag, not a kind — no members.
    const done = members.filter((t) => earned.has(t.name)).length;
    byKind.append(row(kindLabel(kind.id), done, members.length));
  }
  view.append(byKind);

  const hiddenAll = trophies.filter((t) => t.hidden);
  const hiddenRevealed = hiddenAll.filter((t) => earned.has(t.name) || !isSpoiled(t, s, earned)).length;
  const hiddenBlock = el('section', 'stats-block');
  hiddenBlock.append(el('h2', '', 'Hidden trophies'));
  hiddenBlock.append(el('p', 'count-line',
    `${hiddenRevealed} of ${hiddenAll.length} hidden trophies revealed ` +
    `(earned, or spoilers off in Settings). ${hiddenAll.length - hiddenRevealed} still masked.`));
  view.append(hiddenBlock);

  const stages = el('section', 'stats-block');
  stages.append(el('h2', '', 'Progress by roadmap stage'));
  for (const stage of ROADMAP) {
    const members = trophies.filter((t) => t.stage === stage.n);
    const done = members.filter((t) => earned.has(t.name)).length;
    stages.append(row(`Stage ${stage.n} — ${stage.title}`, done, members.length));
  }
  view.append(stages);

  const rarest = trophies
    .filter((t) => !earned.has(t.name))
    .sort(gradeOrder)
    .slice(0, 8);
  // Latest earned: the most recent dated trophy, so the dashboard shows the
  // player's last win. Undated trophies (earned before tracking) never count
  // as "latest" — their date is unknown.
  const datedEarned = trophies
    .filter((t) => earned.has(t.name) && store.earnedWhen(t.name))
    .sort((a, b) => store.earnedWhen(b.name) - store.earnedWhen(a.name));
  const latestBlock = el('section', 'stats-block');
  latestBlock.append(el('h2', '', 'Latest earned'));
  if (!datedEarned.length) {
    latestBlock.append(el('p', 'count-line', earned.size ? 'Your earned trophies were ticked before this tracker kept dates — see Earned history for the full list.' : 'Nothing earned yet.'));
  } else {
    const t = datedEarned[0];
    latestBlock.append(el('p', 'count-line', `${visibleName(t, s, earned)} — ${store.earnedWhenLabel(t.name)}. See Earned history for every trophy in the order it was earned.`));
  }
  view.append(latestBlock);
  const rareBlock = el('section', 'stats-block');
  rareBlock.append(el('h2', '', 'Rarest still unearned'));
  if (!rarest.length) {
    rareBlock.append(el('p', 'count-line', 'Nothing left — every trophy is earned.'));
  } else {
    const ul = el('ul', 'stage-trophies');
    for (const t of rarest) {
      const li = document.createElement('li');
      li.append(el('span', 'todo', '○'));
      const a = document.createElement('a');
      a.href = `#/trophy/${t.id}`;
      a.textContent = visibleName(t, s, earned);
      li.append(a);
      li.append(el('span', 'tag', gradeLabel(t.grade)));
      ul.append(li);
    }
    rareBlock.append(ul);
  }
  view.append(rareBlock);
}
