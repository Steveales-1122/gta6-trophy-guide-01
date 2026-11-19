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

// Storage version guard: an export from a newer app version is refused
// rather than silently mangled, and a version-0 payload (no version field)
// is treated as the current format.
export const EXPORT_VERSION = 1;

export function exportVersionOk(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version === undefined) return true;
  return data.version === EXPORT_VERSION;
}

export const store = {
  earned: new Set(readJson(STORAGE_KEY, []).filter((n) => typeof n === 'string')),
  // Earned timestamps, added 19 Nov 2026 for the Earned-history view: name -> ISO
  // date string, or absent when the trophy was ticked before tracking began.
  // Old saves carry no timestamps, so those trophies show as "earned before
  // tracking" — the date is never invented.
  earnedAt: (() => {
    const raw = readJson(STORAGE_KEY + '-earned-at', {});
    const earned = new Set(readJson(STORAGE_KEY, []).filter((n) => typeof n === 'string'));
    const kept = {};
    if (raw && typeof raw === 'object') {
      for (const [name, at] of Object.entries(raw)) {
        if (earned.has(name) && typeof at === 'string' && !Number.isNaN(Date.parse(at))) kept[name] = at;
      }
    }
    return kept;
  })(),
  notes: readJson(STORAGE_KEY + '-notes', {}),
  settings: Object.assign(
    { spoilers: false, theme: 'paper', kind: 'all', grade: 'all', state: 'all', missableOnly: false, query: '' },
    readJson(SETTINGS_KEY, {}),
  ),

  save() {
    writeJson(STORAGE_KEY, [...this.earned]);
    writeJson(STORAGE_KEY + '-earned-at', this.earnedAt);
    writeJson(STORAGE_KEY + '-notes', this.notes);
    writeJson(SETTINGS_KEY, this.settings);
  },

  toggle(name) {
    if (this.earned.has(name)) {
      this.earned.delete(name);
      delete this.earnedAt[name];
    } else {
      this.earned.add(name);
      this.earnedAt[name] = new Date().toISOString();
    }
    this.save();
  },

  // When a trophy was earned, as a Date, or null when it was ticked before
  // timestamps were tracked (or is not earned at all).
  earnedWhen(name) {
    if (!this.earned.has(name)) return null;
    const at = this.earnedAt[name];
    if (typeof at !== 'string') return null;
    const d = new Date(at);
    return Number.isNaN(d.getTime()) ? null : d;
  },

  // Short label for a trophy's earned date: "12 Nov 2026" or the honest
  // "earned before tracking" when no timestamp was ever recorded.
  earnedWhenLabel(name) {
    const d = this.earnedWhen(name);
    if (!d) return 'earned before tracking';
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  },

  setNote(name, text) {
    if (text.trim()) this.notes[name] = text;
    else delete this.notes[name];
    this.save();
  },

  reset() {
    this.earned = new Set();
    this.earnedAt = {};
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
      // Earned timestamps travel with the export; names without one import
      // back as "earned before tracking", never with an invented date.
      earnedAt: this.earnedAt,
      notes: this.notes,
      settings: this.settings,
    };
  },

  // Import: keep only names the official list holds; ignore anything else.
  importData(data, knownNames) {
    if (!data || !Array.isArray(data.earned)) throw new Error('not a Sunset Platinum export');
    if (!exportVersionOk(data)) throw new Error('export is from a newer version of this guide');
    const known = new Set(knownNames);
    const earned = data.earned.filter((n) => typeof n === 'string' && known.has(n));
    this.earned = new Set(earned);
    this.earnedAt = {};
    if (data.earnedAt && typeof data.earnedAt === 'object') {
      for (const [name, at] of Object.entries(data.earnedAt)) {
        if (this.earned.has(name) && typeof at === 'string' && !Number.isNaN(Date.parse(at))) {
          this.earnedAt[name] = at;
        }
      }
    }
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
