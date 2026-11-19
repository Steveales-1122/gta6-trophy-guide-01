// The Stages view: the same checklist as the Roadmap, but grouped by the nine
// roadmap stages and collapsible — each stage shows its own progress bar and
// earned/total count, and the first stage with trophies still to earn is
// highlighted as the next one to work on.
import { ROADMAP } from '../config.js';
import { store } from '../store.js';
import { visibleName } from '../filters.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function renderStages(view, data) {
  view.replaceChildren();
  view.append(el('p', 'count-line', 'The checklist grouped by roadmap stage. Open a stage to see its trophies, tick them off here or in the Checklist — progress is the same either way. The highlighted stage is the next one with trophies still to earn.'));

  // The next stage to work on: the first stage (in roadmap order) that is
  // not yet complete. Once every stage is complete there is no next stage.
  const nextStage = ROADMAP.find((stage) => {
    const members = data.trophies.filter((t) => t.stage === stage.n);
    return members.length > 0 && members.some((t) => !store.earned.has(t.name));
  });

  for (const stage of ROADMAP) {
    const members = data.trophies.filter((t) => t.stage === stage.n);
    const done = members.filter((t) => store.earned.has(t.name)).length;
    const complete = members.length > 0 && done === members.length;
    const isNext = nextStage && stage.n === nextStage.n;

    const block = el('section', `stage-block stages-stage${isNext ? ' stages-next' : ''}`);
    const details = document.createElement('details');
    // The next stage starts open so the player lands on what to do; finished
    // stages start closed so the list stays short.
    details.open = isNext || !complete;
    const summary = document.createElement('summary');
    summary.className = 'stages-summary';
    summary.append(el('span', 'stages-title', `Stage ${stage.n} — ${stage.title}`));
    summary.append(el('span', 'stages-count', `${done}/${members.length}`));
    if (isNext) summary.append(el('span', 'tag stages-next-tag', 'Next up'));
    if (complete) summary.append(el('span', 'tag', 'Complete'));
    details.append(summary);

    const bar = el('div', 'progress-bar');
    const fill = el('div', 'progress-fill');
    fill.style.width = `${members.length ? (done / members.length) * 100 : 0}%`;
    bar.append(fill);
    details.append(bar);
    details.append(el('p', 'stage-note', stage.note));

    const ul = el('ul', 'stage-trophies');
    for (const t of members) {
      const earned = store.earned.has(t.name);
      const li = document.createElement('li');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.className = 'check';
      box.checked = earned;
      box.setAttribute('aria-label', `Earned: ${visibleName(t, store.settings, store.earned)}`);
      box.addEventListener('change', () => {
        store.toggle(t.name);
        document.dispatchEvent(new CustomEvent('progress-changed'));
        renderStages(view, data);
      });
      li.append(box);
      li.append(el('span', earned ? 'done' : 'todo', earned ? '✓' : '○'));
      const a = document.createElement('a');
      a.href = `#/trophy/${t.id}`;
      a.textContent = visibleName(t, store.settings, store.earned);
      li.append(a);
      li.append(el('span', 'tag', t.grade));
      if (earned) li.append(el('span', 'tag stages-earned-when', store.earnedWhenLabel(t.name)));
      ul.append(li);
    }
    details.append(ul);
    block.append(details);
    view.append(block);
  }

  if (!nextStage) {
    view.append(el('p', 'count-line', 'Every stage is complete — Vice Got a Price! is yours.'));
  }
}
