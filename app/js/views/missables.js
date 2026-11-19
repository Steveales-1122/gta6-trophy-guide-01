// The missables view: the one possibly missable trophy, the five stranger finals
// with story-tied windows, and the cheat warning.
import { MISSABLE_INTRO } from '../config.js';
import { store } from '../store.js';
import { visibleName, visibleDescription } from '../filters.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function trophyCard(data, t, heading) {
  const earned = store.earned.has(t.name);
  const card = el('section', 'stage-block');
  card.append(el('h2', '', heading));
  const name = el('p', 'trophy-name');
  name.append(el('span', 'grade-dot'));
  name.append(document.createTextNode(visibleName(t, store.settings, store.earned)));
  card.append(name);
  card.append(el('p', 'trophy-desc', visibleDescription(t, store.settings, store.earned)));
  card.append(el('p', 'trophy-guide', t.guide));
  // Earned date, where the tracker knows it — the one date that matters most
  // for a missable is whether it is already safely in the bag.
  if (earned) card.append(el('p', 'stage-note', `Earned ${store.earnedWhenLabel(t.name)}.`));
  const btn = el('button', earned ? '' : 'primary', earned ? '✓ Earned' : 'Mark as earned');
  btn.type = 'button';
  btn.addEventListener('click', () => {
    store.toggle(t.name);
    document.dispatchEvent(new CustomEvent('progress-changed'));
    renderMissables(document.getElementById('view'), data);
  });
  card.append(btn);
  return card;
}

export function renderMissables(view, data) {
  view.replaceChildren();
  const risky = data.trophies.filter((t) => t.missable !== 'no');
  const riskyDone = risky.filter((t) => store.earned.has(t.name)).length;
  view.append(el('p', 'count-line', MISSABLE_INTRO));
  view.append(el('p', 'count-line', `${risky.length} trophies carry a timing risk — ${riskyDone} earned, ${risky.length - riskyDone} still open. Do the Chapter 1 one first, then start each stranger chain as soon as it unlocks.`));

  const pma = data.byName.get('Positive Mental Attitude');
  if (pma) view.append(trophyCard(data, pma, 'Possibly missable — do it in Chapter 1'));

  const windowTrophies = data.trophies.filter((t) => t.missable === 'window');
  if (windowTrophies.length) {
    const block = el('section', 'stage-block');
    block.append(el('h2', '', 'Story windows — start these early'));
    block.append(el('p', 'stage-note', 'TechWiser reports that the stranger mission chains behind these five trophies have windows linked to story progress. Only one source gives that warning, so the safe move is to begin each chain as soon as it unlocks.'));
    const ul = el('ul', 'stage-trophies');
    for (const t of windowTrophies) {
      const earned = store.earned.has(t.name);
      const li = document.createElement('li');
      li.append(el('span', earned ? 'done' : 'todo', earned ? '✓' : '○'));
      const a = document.createElement('a');
      a.href = `#/trophy/${t.id}`;
      a.textContent = visibleName(t, store.settings, store.earned);
      li.append(a);
      ul.append(li);
    }
    block.append(ul);
    view.append(block);
  }

  const warn = el('div', 'callout');
  warn.append(el('h2', '', 'Cheats switch trophies off'));
  warn.append(el('p', '', 'GTABase and TechWiser report that using cheats disables trophy tracking and saving. Leave cheats off for the whole trophy run; the only fix they mention is a clean save.'));
  view.append(warn);
}
