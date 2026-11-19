// The checklist view: toolbar (search, kind chips, grade and state filters) and the
// trophy rows with their earned checkbox, official description, guide and tags.
import { KINDS, GRADES } from '../config.js';
import { store } from '../store.js';
import { filterTrophies, visibleName, visibleDescription, isSpoiled } from '../filters.js';
import { gradeLabel, kindLabel } from '../data.js';
import { openDetail } from './detail.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function missableTag(t) {
  if (t.missable === 'yes') return el('span', 'tag missable', 'Possibly missable');
  if (t.missable === 'window') return el('span', 'tag window', 'Story window');
  return null;
}

export function renderChecklist(view, data) {
  const { trophies } = data;
  const s = store.settings;
  view.replaceChildren();

  const toolbar = el('div', 'toolbar');
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search trophies, descriptions and guides…';
  search.value = s.query;
  search.setAttribute('aria-label', 'Search trophies');
  search.addEventListener('input', () => { s.query = search.value; store.save(); renderChecklist(view, data); });
  toolbar.append(search);

  const chips = el('div', 'chips');
  const kindOptions = [{ id: 'all', label: 'All kinds' }, ...KINDS];
  for (const k of kindOptions) {
    const b = el('button', 'chip', k.label);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(s.kind === k.id));
    b.addEventListener('click', () => { s.kind = k.id; store.save(); renderChecklist(view, data); });
    chips.append(b);
  }
  toolbar.append(chips);

  const gradeSel = document.createElement('select');
  gradeSel.setAttribute('aria-label', 'Filter by grade');
  for (const g of ['all', ...GRADES]) {
    const o = document.createElement('option');
    o.value = g;
    o.textContent = g === 'all' ? 'All grades' : gradeLabel(g);
    gradeSel.append(o);
  }
  gradeSel.value = s.grade;
  gradeSel.addEventListener('change', () => { s.grade = gradeSel.value; store.save(); renderChecklist(view, data); });
  toolbar.append(el('label', '', 'Grade '), gradeSel);

  const stateSel = document.createElement('select');
  stateSel.setAttribute('aria-label', 'Filter by earned state');
  for (const [v, label] of [['all', 'All'], ['earned', 'Earned'], ['remaining', 'Remaining']]) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = label;
    stateSel.append(o);
  }
  stateSel.value = s.state;
  stateSel.addEventListener('change', () => { s.state = stateSel.value; store.save(); renderChecklist(view, data); });
  toolbar.append(el('label', '', 'Show '), stateSel);

  const missable = el('button', 'chip', 'Missable only');
  missable.type = 'button';
  missable.setAttribute('aria-pressed', String(s.missableOnly));
  missable.addEventListener('click', () => { s.missableOnly = !s.missableOnly; store.save(); renderChecklist(view, data); });
  toolbar.append(missable);
  view.append(toolbar);

  const shown = filterTrophies(trophies, s, store.earned);
  const earnedShown = shown.filter((t) => store.earned.has(t.name)).length;
  view.append(el('p', 'count-line', `Showing ${shown.length} of ${trophies.length} trophies · ${earnedShown} earned in this view`));

  if (shown.length === 0) {
    const empty = el('div', 'empty');
    empty.append(el('p', '', s.kind === 'online'
      ? 'No online trophies: all 55 trophies are offline and single-player, so this filter is empty on purpose.'
      : 'No trophies match these filters. Clear the search or pick another kind.'));
    view.append(empty);
    return;
  }

  const list = el('ul', 'trophy-list');
  for (const t of shown) {
    const earned = store.earned.has(t.name);
    const li = el('li', `trophy grade-${t.grade}${earned ? ' earned' : ''}`);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'check';
    box.checked = earned;
    box.setAttribute('aria-label', `Earned: ${visibleName(t, s, store.earned)}`);
    box.addEventListener('change', () => {
      store.toggle(t.name);
      document.dispatchEvent(new CustomEvent('progress-changed'));
      renderChecklist(view, data);
    });
    li.append(box);

    const body = el('div');
    const name = el('div', 'trophy-name');
    name.append(el('span', 'grade-dot'));
    name.append(document.createTextNode(visibleName(t, s, store.earned)));
    body.append(name);
    body.append(el('p', 'trophy-desc', visibleDescription(t, s, store.earned)));
    const meta = el('div', 'trophy-meta');
    meta.append(el('span', 'tag', gradeLabel(t.grade)));
    meta.append(el('span', 'tag', kindLabel(t.kind)));
    if (t.hidden) meta.append(el('span', 'tag hidden-t', 'Hidden on PSN'));
    const mt = missableTag(t);
    if (mt) meta.append(mt);
    if (t.target) meta.append(el('span', 'tag', `PSN target: ${t.target.toLocaleString()}`));
    if (store.notes[t.name]) meta.append(el('span', 'tag', 'Has a note'));
    body.append(meta);
    if (!isSpoiled(t, s, store.earned)) {
      body.append(el('p', 'trophy-guide', t.guide));
    } else {
      body.append(el('p', 'trophy-guide spoiled', 'Turn spoilers off in Settings to read this trophy, or earn it in the game.'));
    }
    li.append(body);

    const actions = el('div', 'trophy-actions');
    const guideBtn = el('button', '', 'Guide & sources');
    guideBtn.type = 'button';
    guideBtn.addEventListener('click', () => openDetail(data, t.id));
    actions.append(guideBtn);
    li.append(actions);
    list.append(li);
  }
  view.append(list);
}
