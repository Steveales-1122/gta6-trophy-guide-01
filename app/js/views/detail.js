// The detail pane: one trophy's full guide, its cited sources, its roadmap stage,
// its PSN progress target, and a personal note box.
import { store } from '../store.js';
import { visibleName, visibleDescription, isSpoiled } from '../filters.js';
import { gradeLabel, kindLabel } from '../data.js';
import { ROADMAP } from '../config.js';

const panel = document.getElementById('detail');
let currentId = null;
let currentData = null;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function openDetail(data, id) {
  currentData = data;
  currentId = id;
  render();
  panel.hidden = false;
  panel.querySelector('.close')?.focus();
}

export function closeDetail() {
  panel.hidden = true;
  currentId = null;
}

function render() {
  const t = currentData.byId.get(currentId);
  if (!t) return;
  const s = store.settings;
  const earned = store.earned.has(t.name);
  const stage = ROADMAP.find((r) => r.n === t.stage);
  panel.replaceChildren();

  const close = el('button', 'close', 'Close ×');
  close.type = 'button';
  close.addEventListener('click', closeDetail);
  panel.append(close);

  panel.append(el('p', 'kicker', `${gradeLabel(t.grade)} · ${kindLabel(t.kind)}${t.hidden ? ' · Hidden on PSN' : ''}`));
  panel.append(el('h2', '', visibleName(t, s, store.earned)));
  panel.append(el('p', 'trophy-desc', visibleDescription(t, s, store.earned)));

  const toggle = el('button', earned ? '' : 'primary', earned ? '✓ Earned — tap to unmark' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => {
    store.toggle(t.name);
    document.dispatchEvent(new CustomEvent('progress-changed'));
    render();
  });
  panel.append(toggle);

  if (isSpoiled(t, s, store.earned)) {
    panel.append(el('p', 'guide-text spoiled', 'Spoilers are on and this story trophy is still hidden. Earn it in the game, or turn spoilers off in Settings, to read the guide.'));
  } else {
    panel.append(el('h3', '', 'Guide'));
    panel.append(el('p', 'guide-text', t.guide));
  }
  if (t.target) {
    panel.append(el('p', '', `PSN progress target: ${t.target.toLocaleString()} (tracked on your PlayStation profile).`));
  }
  if (t.missable === 'yes') {
    panel.append(el('p', '', 'Possibly missable: the first meditation spot is reported to disappear after Chapter 1. Do it as soon as it is offered.'));
  } else if (t.missable === 'window') {
    panel.append(el('p', '', 'Story window: this stranger chain is reported to have windows tied to story progress. Start it early.'));
  }
  if (stage) {
    panel.append(el('p', '', `Roadmap stage ${stage.n}: ${stage.title}.`));
  }

  panel.append(el('h3', '', 'Sources'));
  const list = el('ul', 'sources');
  for (const src of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = src.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = src.name;
    li.append(a);
    list.append(li);
  }
  panel.append(list);
  panel.append(el('p', 'sources', 'Guides are written in our own words for this page. A source is cited, never copied; the official names and descriptions are shown as PlayStation publishes them.'));

  panel.append(el('h3', '', 'Your note'));
  const note = document.createElement('textarea');
  note.value = store.notes[t.name] ?? '';
  note.placeholder = 'Where is it? What worked? Notes save in this browser.';
  note.setAttribute('aria-label', 'Personal note for this trophy');
  note.addEventListener('input', () => store.setNote(t.name, note.value));
  panel.append(note);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) closeDetail();
});
