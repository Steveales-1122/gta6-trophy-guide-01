// "Surprise me": picks a random unearned trophy that the spoiler setting
// does not block, shows its card, and lets the player pick another or mark
// it earned right here. Pure chance — no history, no stored state.
import { store } from '../store.js';
import { isSpoiled, visibleName, visibleDescription } from '../filters.js';
import { gradeLabel, kindLabel } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function pickOne(trophies) {
  const pool = trophies.filter((t) => !store.earned.has(t.name) && !isSpoiled(t, store.settings, store.earned));
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function renderPicker(view, data) {
  view.replaceChildren();
  view.append(el('p', 'count-line', 'Stuck for what to do next? Draw a random trophy you have not earned yet. Spoiler-blocked story trophies never come up.'));
  // A progress reminder beside the draw, so a lucky pick lands in context.
  view.append(el('p', 'count-line', `${store.earned.size} of ${data.trophies.length} earned — ${data.trophies.length - store.earned.size} left in the hat.`));

  const card = el('section', 'picker-card');
  view.append(card);

  function draw() {
    card.replaceChildren();
    const t = pickOne(data.trophies);
    if (!t) {
      card.append(el('h2', '', 'Nothing left to draw'));
      card.append(el('p', '', 'Every trophy is earned, or the rest are hidden behind the spoiler setting. Turn spoilers off in Settings, or enjoy the platinum.'));
      return;
    }
    card.append(el('p', 'kicker', `${gradeLabel(t.grade)} · ${kindLabel(t.kind)}${t.hidden ? ' · Hidden on PSN' : ''}`));
    card.append(el('h2', '', visibleName(t, store.settings, store.earned)));
    card.append(el('p', 'trophy-desc', visibleDescription(t, store.settings, store.earned)));
    card.append(el('p', 'trophy-guide', t.guide));
    const row = el('div', 'row');
    const again = el('button', '', 'Pick another');
    again.type = 'button';
    again.addEventListener('click', draw);
    row.append(again);
    const earn = el('button', 'primary', 'Mark earned');
    earn.type = 'button';
    earn.addEventListener('click', () => {
      store.toggle(t.name);
      document.dispatchEvent(new CustomEvent('progress-changed'));
      draw();
    });
    row.append(earn);
    const open = el('button', '', 'Open full guide');
    open.type = 'button';
    open.addEventListener('click', () => { location.hash = `#/trophy/${t.id}`; });
    row.append(open);
    card.append(row);
  }

  draw();
}
