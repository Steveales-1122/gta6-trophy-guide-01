// Settings and save: spoiler toggle, theme, export / import of progress, and reset.
// Progress lives in localStorage; export writes a file, import reads one back.
import { store, downloadJson } from '../store.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function renderSettings(view, data) {
  view.replaceChildren();
  const grid = el('div', 'settings-grid');

  const spoilers = el('section');
  spoilers.append(el('h2', '', 'Spoilers'));
  spoilers.append(el('p', '', 'When spoilers are on, hidden story trophies stay masked — name and description replaced — until you earn them. The other 27 trophies are never hidden.'));
  const sw = el('label', 'switch');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = store.settings.spoilers;
  box.addEventListener('change', () => {
    store.settings.spoilers = box.checked;
    store.save();
    document.dispatchEvent(new CustomEvent('progress-changed'));
  });
  sw.append(box);
  sw.append(document.createTextNode('Hide story trophies until earned'));
  spoilers.append(sw);
  grid.append(spoilers);

  const theme = el('section');
  theme.append(el('h2', '', 'Theme'));
  theme.append(el('p', '', 'Paper is the light look; night is the dark one. The choice saves in this browser.'));
  const night = el('button', '', store.settings.theme === 'night' ? 'Night theme (on)' : 'Switch to night theme');
  night.type = 'button';
  night.addEventListener('click', () => {
    store.settings.theme = store.settings.theme === 'night' ? 'paper' : 'night';
    store.save();
    document.dispatchEvent(new CustomEvent('theme-changed'));
    renderSettings(view, data);
  });
  theme.append(night);
  grid.append(theme);

  const save = el('section');
  save.append(el('h2', '', 'Save & export'));
  save.append(el('p', '', `Your progress (${store.earned.size} of ${data.trophies.length} earned, plus ${Object.keys(store.notes).length} notes) is saved in this browser automatically. Export it to a file to back it up or move it to another browser.`));
  const row = el('div', 'row');
  const exp = el('button', 'primary', 'Export progress');
  exp.type = 'button';
  exp.addEventListener('click', () => downloadJson('gta6-trophy-progress.json', store.exportData()));
  row.append(exp);
  const impLabel = el('label', '');
  impLabel.textContent = 'Import progress ';
  const imp = document.createElement('input');
  imp.type = 'file';
  imp.accept = 'application/json';
  imp.addEventListener('change', async () => {
    const file = imp.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const n = store.importData(parsed, data.trophies.map((t) => t.name));
      document.dispatchEvent(new CustomEvent('progress-changed'));
      save.querySelector('.import-result')?.remove();
      save.append(el('p', 'import-result', `Imported ${n} earned trophies.`));
    } catch {
      save.querySelector('.import-result')?.remove();
      save.append(el('p', 'import-result', 'That file is not a Sunset Platinum export. Nothing was changed.'));
    }
    imp.value = '';
  });
  impLabel.append(imp);
  row.append(impLabel);
  save.append(row);
  grid.append(save);

  const danger = el('section');
  danger.append(el('h2', '', 'Start over'));
  danger.append(el('p', '', 'Clears every earned tick and note in this browser. This cannot be undone — export first if you want a backup.'));
  const reset = el('button', '', 'Reset all progress');
  reset.type = 'button';
  reset.addEventListener('click', () => {
    if (window.confirm('Clear all earned trophies and notes?')) {
      store.reset();
      document.dispatchEvent(new CustomEvent('progress-changed'));
      renderSettings(view, data);
    }
  });
  danger.append(reset);
  grid.append(danger);

  const about = el('section');
  about.append(el('h2', '', 'About this guide'));
  about.append(el('p', '', '55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation until earned; none online. Names, descriptions, grades and PSN progress targets were verified against Exophase and PSNProfiles on 19 November 2026. Guides are written in our own words and cite their sources; five trophies are still unconfirmed in every guide and say so plainly.'));
  grid.append(about);

  view.append(grid);
}
