// Settings view: the spoiler switch, progress export and import, the
// reset button, and the shortcuts list. Nothing here leaves the browser:
// export downloads a file, import reads a file the player picks.
import { exportJson, importJson, resetState } from "../store.js";
import { buildMarkdown } from "../export-md.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function download(filename, text, type) {
  const blob = new Blob([text], { type: type || "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function renderSettings(root, app) {
  const { trophies, state } = app;
  const done = Object.keys(state.earned).length;
  const size = (() => {
    try {
      return (localStorage.getItem("sunset-platinum-v2") || "").length;
    } catch (err) {
      return 0;
    }
  })();

  root.innerHTML = `
    <section class="view-head">
      <h2>Settings</h2>
      <p class="view-sub">Your progress lives in this browser's localStorage (${done} of ${trophies.length} earned, ${size} bytes stored). Nothing is sent anywhere.</p>
    </section>
    <section class="settings-block">
      <h3>Spoilers</h3>
      <label class="toggle-row">
        <input type="checkbox" data-spoiler-toggle${state.spoilers ? " checked" : ""}>
        <span>Hide story trophy names and descriptions until they are earned</span>
      </label>
      <p>With spoilers on, the 17 story trophies show as "Hidden story trophy" until you tick them earned. Their guides stay hidden too. Turn it off to see the whole list at once — the mission and chapter names are spoilers.</p>
    </section>
    <section class="settings-block">
      <h3>Export</h3>
      <p>Download your progress to keep it or move it to another browser.</p>
      <p>
        <button class="btn-primary" data-export-json>Export progress (.json)</button>
        <button class="btn" data-export-md>Export checklist (.md)</button>
      </p>
    </section>
    <section class="settings-block">
      <h3>Import</h3>
      <p>Import a .json file exported by this guide. Earned trophies in the file are merged into your current progress.</p>
      <p><input type="file" accept=".json,application/json" data-import-file></p>
      <p class="import-status" data-import-status></p>
    </section>
    <section class="settings-block">
      <h3>Reset</h3>
      <p>Clear every earned mark and start the hunt again. This cannot be undone — export first if you want a backup.</p>
      <p><button class="btn-danger" data-reset>Reset all progress</button></p>
    </section>
    <section class="settings-block">
      <h3>Keyboard shortcuts</h3>
      <ul class="steps">
        <li><kbd>1</kbd>–<kbd>9</kbd> — switch views (checklist, roadmap, stages, missables, stats, planner, surprise me, history, settings)</li>
        <li><kbd>/</kbd> — focus the checklist search</li>
        <li><kbd>E</kbd> — export progress as JSON</li>
        <li><kbd>?</kbd> — show this help</li>
      </ul>
    </section>
    <section class="settings-block">
      <h3>About this guide</h3>
      <p>Sunset Platinum covers all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 hidden. Official names, descriptions and grades are PlayStation's, taken from Exophase on 18 November 2026 and cross-checked with PSNProfiles and TrueAchievements. Every guide is written for this entry, in its own words, and cites its sources. The app is static files only and works with the network off; no Rockstar logo or official artwork is used.</p>
    </section>`;

  root.querySelector("[data-spoiler-toggle]").addEventListener("change", (e) => {
    app.setSpoilers(e.target.checked);
  });
  root.querySelector("[data-export-json]").addEventListener("click", () => {
    download("sunset-platinum-progress.json", exportJson(app.state));
  });
  root.querySelector("[data-export-md]").addEventListener("click", () => {
    download("sunset-platinum-checklist.md", buildMarkdown(app.trophies, app.state), "text/markdown");
  });
  root.querySelector("[data-import-file]").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    const status = root.querySelector("[data-import-status]");
    if (!file) return;
    try {
      const text = await file.text();
      app.replaceState(importJson(text));
      status.textContent = "Imported " + file.name + " — progress merged.";
    } catch (err) {
      status.textContent = "Could not import that file: " + err.message;
    }
  });
  root.querySelector("[data-reset]").addEventListener("click", () => {
    if (window.confirm("Reset all progress? This clears every earned mark.")) {
      app.replaceState(resetState());
    }
  });
}
