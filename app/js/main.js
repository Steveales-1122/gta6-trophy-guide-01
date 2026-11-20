// Sunset Platinum: the router and the shared helpers every view uses.
// Views are small functions that take a context and return HTML; all clicks
// are handled here by delegation, so no view needs to know about the others.
import { loadTrophies } from "./data.js";
import { loadStore, saveStore, toggleEarned, earnedCount, resetStore, exportJson, importJson } from "./store.js";
import { blankFilter, applyFilter } from "./filters.js";
import { installKeys } from "./keys.js";
import { exportMarkdown, download } from "./export-md.js";
import { GRADE_POINTS, VIEW_IDS } from "./config.js";
import { renderChecklist } from "./views/checklist.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderStages } from "./views/stages.js";
import { renderMissables } from "./views/missables.js";
import { renderPlanner } from "./views/planner.js";
import { renderPicker } from "./views/picker.js";
import { renderStats } from "./views/stats.js";
import { renderTimeline } from "./views/timeline.js";
import { renderSettings } from "./views/settings.js";

const VIEW_LABELS = {
  checklist: "Checklist",
  roadmap: "Roadmap",
  stages: "100% Stages",
  missables: "Missables",
  planner: "Planner",
  picker: "What next?",
  stats: "Stats",
  timeline: "History",
  settings: "Settings",
};
const VIEW_RENDER = {
  checklist: renderChecklist,
  roadmap: renderRoadmap,
  stages: renderStages,
  missables: renderMissables,
  planner: renderPlanner,
  picker: renderPicker,
  stats: renderStats,
  timeline: renderTimeline,
  settings: renderSettings,
};

export function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const state = {
  trophies: [],
  store: loadStore(),
  filter: blankFilter(),
  route: "checklist",
  openId: null,
};

function masked(t) {
  return state.store.settings.spoilers && t.hidden && !state.store.earned[t.id];
}

function displayName(t) {
  return masked(t) ? "Hidden trophy" : t.name;
}

function displayDesc(t) {
  return masked(t) ? "Hidden until earned." : t.description;
}

function badge(grade) {
  return `<span class="badge ${esc(grade)}">${esc(grade)}</span>`;
}

function tag(kind, extra) {
  return `<span class="tag${extra ? " " + extra : ""}">${esc(kind)}</span>`;
}

function points() {
  return state.trophies.reduce(
    (sum, t) => sum + (state.store.earned[t.id] ? GRADE_POINTS[t.grade] : 0),
    0,
  );
}

function renderProgress() {
  const n = earnedCount(state.store);
  const total = state.trophies.length || 55;
  const pct = total ? Math.round((n / total) * 100) : 0;
  document.getElementById("progress").innerHTML =
    `<strong>${n} / ${total}</strong> trophies earned · ${points()} points · ${pct}%` +
    `<span class="bar"><i style="width:${pct}%"></i></span>`;
}

function renderTabs() {
  document.getElementById("tabs").innerHTML = VIEW_IDS.map(
    (id, i) =>
      `<a href="#/${id}" class="${id === state.route ? "active" : ""}">${i + 1} · ${VIEW_LABELS[id]}</a>`,
  ).join("");
}

function rerender() {
  renderProgress();
  renderTabs();
  const view = document.getElementById("view");
  const ctx = {
    state,
    esc,
    badge,
    tag,
    displayName,
    displayDesc,
    masked,
    applyFilter,
  };
  view.innerHTML = VIEW_RENDER[state.route](ctx);
  const box = view.querySelector('input[type="search"]');
  if (box && state.filter.q) box.value = state.filter.q;
}

function routeFromHash() {
  const id = location.hash.replace(/^#\/?/, "").split("?")[0];
  state.route = VIEW_IDS.includes(id) ? id : "checklist";
}

function readLaunchParams() {
  const params = new URLSearchParams(location.search);
  if (params.get("spoilers") === "1") state.store.settings.spoilers = true;
  const open = Number(params.get("open"));
  if (Number.isInteger(open) && open > 0) state.openId = open;
}

document.getElementById("view").addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const id = Number(el.dataset.id);
  if (action === "earn" && Number.isInteger(id)) {
    toggleEarned(state.store, id);
    rerender();
  } else if (action === "open" && Number.isInteger(id)) {
    state.openId = state.openId === id ? null : id;
    rerender();
  } else if (action === "view" && el.dataset.view) {
    location.hash = `#/${el.dataset.view}`;
  } else if (action === "export-md") {
    download("sunset-platinum-progress.md", exportMarkdown(state.trophies, state.store), "text/markdown");
  } else if (action === "export-json") {
    download("sunset-platinum-progress.json", exportJson(state.store), "application/json");
  } else if (action === "reset") {
    if (window.confirm("Reset all progress? This clears every tick and your history.")) {
      state.store = resetStore();
      rerender();
    }
  } else if (action === "toggle-spoilers") {
    state.store.settings.spoilers = !state.store.settings.spoilers;
    saveStore(state.store);
    rerender();
  } else if (action === "toggle-hide-earned") {
    state.store.settings.hideEarned = !state.store.settings.hideEarned;
    saveStore(state.store);
    rerender();
  }
});

document.getElementById("view").addEventListener("input", (event) => {
  const el = event.target;
  if (el.matches('input[type="search"]')) {
    state.filter.q = el.value;
    rerender();
    const box = document.querySelector('input[type="search"]');
    if (box) {
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    }
  }
});

document.getElementById("view").addEventListener("change", (event) => {
  const el = event.target;
  if (el.dataset.filter) {
    state.filter[el.dataset.filter] = el.value;
    rerender();
  }
  if (el.id === "import-file" && el.files && el.files[0]) {
    const file = el.files[0];
    file.text().then((text) => {
      try {
        state.store = importJson(text);
        rerender();
      } catch {
        window.alert("That file is not a progress export from this guide.");
      }
    });
  }
});

window.addEventListener("hashchange", () => {
  routeFromHash();
  rerender();
});

loadTrophies()
  .then((trophies) => {
    state.trophies = trophies;
    readLaunchParams();
    routeFromHash();
    installKeys(state, rerender);
    rerender();
  })
  .catch(() => {
    document.getElementById("view").innerHTML =
      '<p class="empty">The trophy list did not load. Serve app/ with <code>node serve.ts</code> and reload.</p>';
  });
