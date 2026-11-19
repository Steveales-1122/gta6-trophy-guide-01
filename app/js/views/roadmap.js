// The roadmap view: nine stages to the platinum, each with its trophies and a
// per-stage progress bar, built from the official trophy descriptions.
import { ROADMAP } from '../config.js';
import { store } from '../store.js';
import { visibleName } from '../filters.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function renderRoadmap(view, data) {
  view.replaceChildren();
  view.append(el('p', 'count-line', 'The order to earn them in: story first, strangers while the story is still running, then the open-world grind, and 100% completion last. Each stage lists its trophies; tick them off in the Checklist as you go.'));
  // The Stages view shows this same order as collapsible groups with
  // checkboxes, so the player can work through it without leaving the page.
  const stagesLink = el('p', 'count-line', '');
  const stagesA = document.createElement('a');
  stagesA.href = '#/stages';
  stagesA.textContent = 'Open the collapsible Stages view →';
  stagesLink.append(stagesA);
  view.append(stagesLink);

  for (const stage of ROADMAP) {
    const members = data.trophies.filter((t) => t.stage === stage.n);
    const done = members.filter((t) => store.earned.has(t.name)).length;
    const block = el('section', 'stage-block');
    block.append(el('h2', '', `Stage ${stage.n} — ${stage.title}`));
    block.append(el('p', 'stage-note', `${stage.note} (${done} of ${members.length} earned)`));
    // A one-word completion label beside the count, so the stage's state
    // reads at a glance without opening it.
    const label = members.length === 0 ? '—' : done === 0 ? 'Not started' : done === members.length ? 'Complete' : 'In progress';
    block.append(el('p', 'stage-note', `Status: ${label}.`));
    const bar = el('div', 'progress-bar');
    const fill = el('div', 'progress-fill');
    fill.style.width = `${members.length ? (done / members.length) * 100 : 0}%`;
    bar.append(fill);
    block.append(bar);
    const ul = el('ul', 'stage-trophies');
    for (const t of members) {
      const earned = store.earned.has(t.name);
      const li = document.createElement('li');
      li.append(el('span', earned ? 'done' : 'todo', earned ? '✓' : '○'));
      const a = document.createElement('a');
      a.href = `#/trophy/${t.id}`;
      a.textContent = visibleName(t, store.settings, store.earned);
      li.append(a);
      li.append(el('span', 'tag', t.grade));
      ul.append(li);
    }
    block.append(ul);
    view.append(block);
  }
}
