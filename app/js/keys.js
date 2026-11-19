// Keyboard shortcuts for the checklist:
//   /  focus the search box
//   j / k  move the selection down / up the visible trophy rows
//   e  toggle earned on the selected trophy
//   s  open the Stages view
//   h  open the Earned-history view
//   Escape  close the detail pane (handled there too — this is the fallback)
// Shortcuts stay silent while the user types in an input, textarea or select,
// so typing a note or a search never toggles anything by accident.
import { store } from './store.js';

function typingTarget(e) {
  const t = e.target;
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
}

function selectedRow() {
  return document.querySelector('.trophy-list .trophy.selected');
}

function selectRow(row) {
  for (const r of document.querySelectorAll('.trophy-list .trophy')) r.classList.remove('selected');
  if (!row) return;
  row.classList.add('selected');
  row.scrollIntoView({ block: 'nearest' });
}

export function initShortcuts(data) {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') return; // Detail pane owns Escape.
    if (typingTarget(e)) return;

    if (e.key === '/') {
      const search = document.querySelector('.toolbar input[type="search"]');
      if (search) {
        e.preventDefault();
        search.focus();
      }
      return;
    }
    if (e.key === 'j' || e.key === 'k') {
      const rows = [...document.querySelectorAll('.trophy-list .trophy')];
      if (!rows.length) return;
      const current = selectedRow();
      const idx = current ? rows.indexOf(current) : -1;
      const next = e.key === 'j' ? rows[Math.min(idx + 1, rows.length - 1)] : rows[Math.max(idx - 1, 0)];
      selectRow(next);
      return;
    }
    if (e.key === 'e') {
      const row = selectedRow();
      if (!row) return;
      const box = row.querySelector('.check');
      if (!box) return;
      box.checked = !box.checked;
      box.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    // Jump keys: 's' for the Stages view, 'h' for the Earned-history view.
    // They never fire while typing, like every other shortcut here.
    if (e.key === 's') {
      location.hash = '#/stages';
      return;
    }
    if (e.key === 'h') {
      location.hash = '#/timeline';
    }
  });
}
