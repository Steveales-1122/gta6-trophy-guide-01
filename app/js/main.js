// Sunset Platinum — boot and router. Loads the trophy data, keeps the
// header (progress, search, spoiler switch) steady, and renders one view
// at a time from the hash: #/checklist, #/roadmap, #/missables, #/stages,
// #/planner, #/picker, #/stats, #/timeline, #/settings, #/trophy/<id>.
import { VIEW_DEFS } from "./config.js";
import { loadTrophies, allTrophies } from "./data.js";
import { loadState, getState, setSetting, getSetting, earnedCount, onChange } from "./store.js";
import { bindShortcuts } from "./keys.js";
import { buildMarkdown, download } from "./export-md.js";
import { renderChecklist } from "./views/checklist.js";
import { renderDetail } from "./views/detail.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderMissables } from "./views/missables.js";
import { renderStages } from "./views/stages.js";
import { renderPlanner } from "./views/planner.js";
import { renderPicker } from "./views/picker.js";
import { renderStats } from "./views/stats.js";
import { renderTimeline } from "./views/timeline.js";
import { renderSettings } from "./views/settings.js";

const VIEWS = {
  checklist: renderChecklist,
  roadmap: renderRoadmap,
  missables: renderMissables,
  stages: renderStages,
  planner: renderPlanner,
  picker: renderPicker,
  stats: renderStats,
  timeline: renderTimeline,
  settings: renderSettings,
};

const filter = { kind: "all", query: "", earned: "all", missableOnly: false };
let current = { view: "checklist", param: null };
let trophies = [];
let hiddenPicks = new Set();

const app = document.getElementById("app");

function parseHash() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [view, param] = hash.split("/");
  if (view === "trophy" && param) return { view: "trophy", param };
  if (VIEWS[view]) return { view, param: null };
  return { view: "checklist", param: null };
}

function go(view, param) {
  location.hash = "#/" + view + (param ? "/" + param : "");
}

function refresh() {
  render();
}

function header() {
  const total = trophies.length;
  const earned = earnedCount();
  const pct = total ? Math.round((earned / total) * 100) : 0;
  return `
    <header>
      <div class="brand">
        <h1>Sunset Platinum</h1>
        <p class="tagline">GTA VI trophy guide &amp; tracker — all 55 trophies, offline</p>
      </div>
      <div class="progress" role="status" aria-label="${earned} of ${total} trophies earned">
        <span class="progress-text">${earned} / ${total} · ${pct}%</span>
        <div class="bar big"><span style="width:${pct}%"></span></div>
      </div>
      <div class="toolbar">
        <input id="search" type="search" placeholder="Search trophies…  ( / )" aria-label="Search trophies" value="${escapeAttr(filter.query)}">
        <label class="spoiler-switch"><input id="spoilers" type="checkbox" ${getSetting("spoilers") ? "checked" : ""}> Hide spoilers</label>
      </div>
      <nav class="tabs" aria-label="Views">
        ${VIEW_DEFS.map((v, i) => `<a href="#/${v.id}" data-view="${v.id}" class="${current.view === v.id ? "active" : ""}">${v.label}<span class="key-hint">${i + 1}</span></a>`).join("")}
      </nav>
    </header>`;
}

function render() {
  current = parseHash();
  const state = getState();
  app.innerHTML = header() + `<main id="main"></main><footer><p>Sunset Platinum — an offline guide to the 55 trophies of Grand Theft Auto VI on PlayStation 5. Official names and descriptions are shown as PlayStation publishes them; every guide is written for this entry and cites its sources. No Rockstar artwork, no network requests.</p></footer>`;
  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    filter.query = search.value;
    if (current.view !== "checklist") go("checklist");
    else renderMain();
  });
  document.getElementById("spoilers").addEventListener("change", (e) => {
    setSetting("spoilers", e.target.checked);
    renderMain();
  });
  renderMain();
  const active = app.querySelector(".tabs a.active");
  if (active) active.scrollIntoView({ block: "nearest" });
}

function renderMain() {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = "";
  const ctx = {
    trophies,
    filter,
    hiddenPicks,
    setFilter: (patch) => {
      Object.assign(filter, patch);
      if (current.view !== "checklist") go("checklist");
      else renderMain();
    },
    refresh,
    openTrophy: (id) => go("trophy", id),
    go,
  };
  if (current.view === "trophy") renderDetail(main, ctx, current.param);
  else VIEWS[current.view](main, ctx);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

async function boot() {
  loadState();
  try {
    trophies = await loadTrophies();
  } catch (err) {
    app.innerHTML = `<p class="error">Could not load the trophy list. Open this guide from its own folder (node serve.ts) so data/trophies.json loads.</p>`;
    return;
  }
  onChange(() => {
    const bar = app.querySelector(".progress-text");
    if (bar) {
      const total = trophies.length;
      const earned = earnedCount();
      bar.textContent = `${earned} / ${total} · ${Math.round((earned / total) * 100)}%`;
      const fill = app.querySelector(".progress .bar span");
      if (fill) fill.style.width = Math.round((earned / total) * 100) + "%";
    }
  });
  bindShortcuts({
    focusSearch: () => {
      const s = document.getElementById("search");
      if (s) s.focus();
    },
    toggleSpoilers: () => {
      setSetting("spoilers", !getSetting("spoilers"));
      render();
    },
    exportMarkdown: () => download("sunset-platinum-progress.md", buildMarkdown(trophies), "text/markdown;charset=utf-8"),
    showShortcuts: () => go("settings"),
    goView: (i) => {
      if (VIEW_DEFS[i]) go(VIEW_DEFS[i].id);
    },
  });
  window.addEventListener("hashchange", render);
  render();
}

boot();
