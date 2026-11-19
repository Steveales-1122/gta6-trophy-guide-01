// Bootstrap and router for the Sunset Platinum guide.
// Hash routing: #/checklist, #/roadmap, #/stages, #/missables, #/stats,
// #/planner, #/picker, #/timeline, #/settings, #/trophy/<id>.
// Earned toggles are handled by one delegated listener, so every view
// gets them for free.
import { VIEWS } from "./config.js";
import { loadTrophies } from "./data.js";
import { loadState, saveState, toggleEarned } from "./store.js";
import { blankFilter } from "./filters.js";
import { installShortcuts } from "./keys.js";
import { exportJson } from "./store.js";
import { renderChecklist } from "./views/checklist.js";
import { renderDetail } from "./views/detail.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderMissables } from "./views/missables.js";
import { renderStats } from "./views/stats.js";
import { renderStages } from "./views/stages.js";
import { renderPlanner } from "./views/planner.js";
import { renderPicker } from "./views/picker.js";
import { renderTimeline } from "./views/timeline.js";
import { renderSettings } from "./views/settings.js";

const RENDERERS = {
  checklist: renderChecklist,
  roadmap: renderRoadmap,
  stages: renderStages,
  missables: renderMissables,
  stats: renderStats,
  planner: renderPlanner,
  picker: renderPicker,
  timeline: renderTimeline,
  settings: renderSettings,
};

const app = {
  trophies: [],
  state: loadState(),
  filter: blankFilter(),
  picked: null,
  view: "checklist",
  param: null,

  go(view, param) {
    this.view = view;
    this.param = param || null;
    location.hash = param ? `#/${view}/${param}` : `#/${view}`;
    this.render();
  },

  viewByKey(key) {
    const found = VIEWS.find((v) => v.key === key);
    return found ? found.id : null;
  },

  focusSearch() {
    if (this.view !== "checklist") this.go("checklist");
    const input = document.querySelector("[data-filter-query]");
    if (input) input.focus();
  },

  showHelp() {
    const dialog = document.getElementById("help-dialog");
    if (dialog && dialog.showModal) dialog.showModal();
  },

  downloadExport() {
    const blob = new Blob([exportJson(this.state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sunset-platinum-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  toggle(id) {
    toggleEarned(this.state, id);
    this.render();
  },

  setFilter(patch, keepFocus) {
    Object.assign(this.filter, patch);
    const query = keepFocus ? document.querySelector("[data-filter-query]") : null;
    const pos = query ? query.selectionStart : 0;
    this.render();
    if (keepFocus) {
      const next = document.querySelector("[data-filter-query]");
      if (next) {
        next.focus();
        try {
          next.setSelectionRange(pos, pos);
        } catch (err) {
          // Some browsers refuse a selection on search inputs; ignore it.
        }
      }
    }
  },

  setSpoilers(on) {
    this.state.spoilers = on;
    saveState(this.state);
    this.render();
  },

  replaceState(next) {
    this.state = next;
    this.render();
  },

  render() {
    const root = document.getElementById("view");
    const done = Object.keys(this.state.earned).length;
    const total = this.trophies.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById("header-progress-fill");
    if (fill) fill.style.width = pct + "%";
    const label = document.getElementById("header-progress-label");
    if (label) label.textContent = done + " of " + total + " earned (" + pct + "%)";

    document.querySelectorAll("#nav a").forEach((a) => {
      const view = a.getAttribute("href").replace(/^#\//, "").split("/")[0];
      if (view === this.view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    if (this.view === "trophy") {
      renderDetail(root, this, this.param);
      return;
    }
    const render = RENDERERS[this.view] || RENDERERS.checklist;
    render(root, this);
  },
};

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [view, param] = raw.split("/");
  if (view === "trophy" && param) return { view: "trophy", param };
  if (RENDERERS[view]) return { view, param: null };
  return { view: "checklist", param: null };
}

async function boot() {
  try {
    app.trophies = await loadTrophies();
  } catch (err) {
    document.getElementById("view").innerHTML =
      `<section class="view-head"><h2>Could not load the trophy list</h2>` +
      `<p class="view-sub">The guide reads its data from data/trophies.json inside app/. ` +
      `Serve app/ with a static server (for example: node serve.ts) and reload.</p></section>`;
    return;
  }

  const nav = document.getElementById("nav");
  nav.innerHTML = VIEWS.map(
    (v) => `<a href="#/${v.id}" title="Shortcut: ${v.key}">${v.label}</a>`,
  ).join("");

  window.addEventListener("hashchange", () => {
    const parsed = parseHash();
    app.view = parsed.view;
    app.param = parsed.param;
    app.render();
  });

  // One delegated listener for every earned toggle in every view, whether
  // it is a checkbox in a row or a button on a detail card.
  document.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-toggle]");
    if (!input) return;
    event.preventDefault();
    app.toggle(input.getAttribute("data-toggle"));
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-toggle]");
    if (!btn) return;
    event.preventDefault();
    app.toggle(btn.getAttribute("data-toggle"));
  });

  installShortcuts(app);

  const parsed = parseHash();
  app.view = parsed.view;
  app.param = parsed.param;
  app.render();
}

boot();
