// Next up: the planner. The next unearned trophies in roadmap order, with the
// story wins first, so the player always knows what to do next.
import { store } from '../store.js';
import { nextUp, visibleName, visibleDescription } from '../filters.js';
import { gradeLabel } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function renderPlanner(view, data) {
  view.replaceChildren();
  const upcoming = nextUp(data.trophies, store.earned, 10);
  if (upcoming.length === 0) {
    view.append(el('div', 'empty', 'Every trophy is earned. Vice Got a Price! should have popped — congratulations, Leonida Legend.'));
    return;
  }
  view.append(el('p', 'count-line', 'Your next ten, in roadmap order. Story trophies come first because they are unmissable and unlock the rest of the game.'));
  const list = el('ol', 'next-list');
  upcoming.forEach((t, i) => {
    const li = document.createElement('li');
    li.append(el('span', 'rank', `${i + 1}.`));
    const name = el('span', 'trophy-name', visibleName(t, store.settings, store.earned));
    li.append(name);
    li.append(el('span', 'tag', gradeLabel(t.grade)));
    li.append(el('span', 'tag', `Stage ${t.stage}`));
    li.append(el('p', 'trophy-desc', visibleDescription(t, store.settings, store.earned)));
    const btn = el('button', '', 'Open guide');
    btn.type = 'button';
    btn.addEventListener('click', () => { location.hash = `#/trophy/${t.id}`; });
    li.append(btn);
    list.append(li);
  });
  view.append(list);
}
