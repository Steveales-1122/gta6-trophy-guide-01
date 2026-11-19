// The Earned-history view: every earned trophy in the order it was earned,
// with the date and time it was ticked. Timestamps are recorded only from
// the day the tracker started keeping them; trophies ticked before that are
// listed first, honestly marked "earned before tracking" with no invented date.
import { store } from '../store.js';
import { earnedInOrder } from '../filters.js';
import { gradeLabel } from '../data.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function formatWhen(d) {
  return d.toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function renderTimeline(view, data) {
  view.replaceChildren();
  const ordered = earnedInOrder(data.trophies, store);
  if (!ordered.length) {
    view.append(el('div', 'empty', 'Nothing earned yet. Tick a trophy in the Checklist or the Stages view and it will appear here with the date and time you earned it.'));
    return;
  }
  view.append(el('p', 'count-line', `${ordered.length} trophies earned, in the order they were earned — the earliest at the top. Trophies ticked before this tracker kept dates are listed first as "earned before tracking".`));

  const list = el('ol', 'timeline-list');
  for (const { trophy: t, when } of ordered) {
    const li = document.createElement('li');
    li.className = 'timeline-entry';
    li.append(el('span', 'timeline-mark', '✓'));
    const body = el('div', 'timeline-body');
    const name = el('span', 'trophy-name', t.name);
    body.append(name);
    body.append(el('span', 'tag', gradeLabel(t.grade)));
    body.append(el('span', 'tag', `Stage ${t.stage}`));
    const whenText = when ? formatWhen(when) : 'earned before tracking';
    body.append(el('p', 'timeline-when', whenText));
    li.append(body);
    const open = el('button', '', 'Guide');
    open.type = 'button';
    open.addEventListener('click', () => { location.hash = `#/trophy/${t.id}`; });
    li.append(open);
    list.append(li);
  }
  view.append(list);
}
