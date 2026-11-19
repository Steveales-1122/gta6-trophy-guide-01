// Saved progress: earned trophies, per-trophy notes and settings, kept in localStorage
// and exportable to a file / importable back. Nothing leaves the browser.
import { STORAGE_KEY, SETTINGS_KEY } from './config.js';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full store: the checklist still works for the session.
  }
}

export const store = {
  earned: new Set(readJson(STORAGE_KEY, []).filter((n) => typeof n === 'string')),
  notes: readJson(STORAGE_KEY + '-notes', {}),
  settings: Object.assign(
    { spoilers: false, theme: 'paper', kind: 'all', grade: 'all', state: 'all', missableOnly: false, query: '' },
    readJson(SETTINGS_KEY, {}),
  ),

  save() {
    writeJson(STORAGE_KEY, [...this.earned]);
    writeJson(STORAGE_KEY + '-notes', this.notes);
    writeJson(SETTINGS_KEY, this.settings);
  },

  toggle(name) {
    if (this.earned.has(name)) this.earned.delete(name);
    else this.earned.add(name);
    this.save();
  },

  setNote(name, text) {
    if (text.trim()) this.notes[name] = text;
    else delete this.notes[name];
    this.save();
  },

  reset() {
    this.earned = new Set();
    this.notes = {};
    this.save();
  },

  // Export: one JSON file with the earned names, notes and settings.
  exportData() {
    return {
      app: 'sunset-platinum',
      version: 1,
      exportedAt: new Date().toISOString(),
      earned: [...this.earned].sort(),
      notes: this.notes,
      settings: this.settings,
    };
  },

  // Import: keep only names the official list holds; ignore anything else.
  importData(data, knownNames) {
    if (!data || !Array.isArray(data.earned)) throw new Error('not a Sunset Platinum export');
    const known = new Set(knownNames);
    const earned = data.earned.filter((n) => typeof n === 'string' && known.has(n));
    this.earned = new Set(earned);
    this.notes = {};
    if (data.notes && typeof data.notes === 'object') {
      for (const [name, text] of Object.entries(data.notes)) {
        if (known.has(name) && typeof text === 'string' && text.trim()) this.notes[name] = text;
      }
    }
    if (data.settings && typeof data.settings === 'object') {
      this.settings = Object.assign(this.settings, data.settings);
    }
    this.save();
    return earned.length;
  },
};

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
