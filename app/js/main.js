// Boot and routing for Sunset Platinum: loads the trophy list, renders the view
// named by the hash, and keeps the progress header and theme in sync.
import { loadTrophies } from './data.js';
import { store } from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderSettings } from './views/settings.js';
import { renderStats } from './views/stats.js';
import { renderPicker } from './views/picker.js';
import { initShortcuts } from './keys.js';
import { openDetail, closeDetail } from './views/detail.js';

const view = document.getElementById('view');
const earnedCount = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressLine = document.getElementById('progressLine');
const gradeLine = document.getElementById('gradeLine');
const themeToggle = document.getElementById('themeToggle');

function applyTheme() {
  const theme = store.settings.theme === 'night' ? 'night' : 'paper';
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'night' ? 'Switch to paper theme' : 'Switch to night theme';
}

function renderProgress(data) {
  const total = data.trophies.length;
  const earned = store.earned.size;
  earnedCount.textContent = String(earned);
  progressFill.style.width = `${total ? (earned / total) * 100 : 0}%`;
  progressLine.textContent = `${earned} earned · ${total - earned} to go`;
  const byGrade = {};
  for (const t of data.trophies) {
    if (store.earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const parts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${byGrade[g] ?? 0} ${g}`)
    .join(' · ');
  gradeLine.textContent = `Earned by grade: ${parts}`;
}

function setActiveTab(tab) {
  for (const a of document.querySelectorAll('.tabs a')) {
    a.classList.toggle('active', a.dataset.tab === tab);
  }
  // Keep the tab title in step with the view, so a bookmarked or shared
  // hash still says which section of the guide it opens.
  const labels = {
    checklist: 'Checklist',
    roadmap: 'Roadmap',
    missables: 'Missables',
    next: 'Next up',
    stats: 'Stats',
    picker: 'Surprise me',
    settings: 'Settings & save',
  };
  document.title = `${labels[tab] ?? 'Checklist'} — Sunset Platinum · GTA VI Trophy Guide`;
}

function route(data) {
  const hash = location.hash || '#/checklist';
  const match = hash.match(/^#\/trophy\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    if (data.byId.has(id)) {
      setActiveTab('checklist');
      renderChecklist(view, data);
      openDetail(data, id);
      return;
    }
  }
  closeDetail();
  const tab = hash.replace(/^#\//, '').split('/')[0] || 'checklist';
  setActiveTab(tab);
  if (tab === 'roadmap') renderRoadmap(view, data);
  else if (tab === 'missables') renderMissables(view, data);
  else if (tab === 'next') renderPlanner(view, data);
  else if (tab === 'stats') renderStats(view, data);
  else if (tab === 'picker') renderPicker(view, data);
  else if (tab === 'settings') renderSettings(view, data);
  else renderChecklist(view, data);
}

const data = await loadTrophies();
applyTheme();
renderProgress(data);
initShortcuts(data);
route(data);
window.addEventListener('hashchange', () => route(data));
document.addEventListener('progress-changed', () => renderProgress(data));
document.addEventListener('theme-changed', applyTheme);
themeToggle.addEventListener('click', () => {
  store.settings.theme = store.settings.theme === 'night' ? 'paper' : 'night';
  store.save();
  applyTheme();
});
