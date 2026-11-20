// Settings view: spoiler hiding, export and import of saved progress,
// the keyboard shortcuts, and reset. Everything here works offline.
import { getState, getSetting, setSetting, exportState, importState, resetAll, earnedCount } from "../store.js";
import { SHORTCUTS } from "../config.js";
import { buildMarkdown, download } from "../export-md.js";

export function renderSettings(el, ctx) {
  const state = getState();
  const wrap = document.createElement("div");
  wrap.className = "view settings-view";
  wrap.innerHTML = `<h2>Settings</h2><p>Progress saves in this browser only — nothing leaves your machine unless you export it.</p>`;

  const spoil = document.createElement("label");
  spoil.className = "setting-row";
  spoil.innerHTML = `<input type="checkbox" ${getSetting("spoilers") ? "checked" : ""}> <span><strong>Hide story trophies until earned</strong><br>Hidden trophies show as "Hidden trophy" until you tick them off.</span>`;
  spoil.querySelector("input").addEventListener("change", (e) => {
    setSetting("spoilers", e.target.checked);
    ctx.refresh();
  });
  wrap.appendChild(spoil);

  const hideEarned = document.createElement("label");
  hideEarned.className = "setting-row";
  hideEarned.innerHTML = `<input type="checkbox" ${getSetting("hideEarned") ? "checked" : ""}> <span><strong>Hide earned trophies in the checklist</strong><br>Only what is left shows.</span>`;
  hideEarned.querySelector("input").addEventListener("change", (e) => {
    setSetting("hideEarned", e.target.checked);
    ctx.refresh();
  });
  wrap.appendChild(hideEarned);

  const exp = document.createElement("section");
  exp.innerHTML = `<h3>Export / Import</h3><p>${earnedCount()} of ${ctx.trophies.length} trophies earned. Export saves a copy; import reads one back.</p>`;
  const mdBtn = document.createElement("button");
  mdBtn.className = "primary";
  mdBtn.textContent = "Export progress as Markdown";
  mdBtn.addEventListener("click", () => download("sunset-platinum-progress.md", buildMarkdown(ctx.trophies), "text/markdown;charset=utf-8"));
  exp.appendChild(mdBtn);
  const jsonBtn = document.createElement("button");
  jsonBtn.textContent = "Export progress as JSON";
  jsonBtn.addEventListener("click", () => download("sunset-platinum-progress.json", exportState(), "application/json;charset=utf-8"));
  exp.appendChild(jsonBtn);
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".json,application/json";
  file.setAttribute("aria-label", "Import progress JSON");
  const importBtn = document.createElement("button");
  importBtn.textContent = "Import progress JSON";
  importBtn.addEventListener("click", () => file.click());
  file.addEventListener("change", async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const n = importState(text);
      alert(`Imported ${n} earned trophies.`);
      ctx.refresh();
    } catch (err) {
      alert("Could not import that file: " + err.message);
    }
  });
  exp.appendChild(importBtn);
  exp.appendChild(file);
  wrap.appendChild(exp);

  const keys = document.createElement("section");
  keys.innerHTML = `<h3>Keyboard shortcuts</h3>`;
  const list = document.createElement("ul");
  for (const s of SHORTCUTS) {
    const li = document.createElement("li");
    li.innerHTML = `<kbd>${escapeHtml(s.key)}</kbd> — ${escapeHtml(s.label)}`;
    list.appendChild(li);
  }
  keys.appendChild(list);
  wrap.appendChild(keys);

  const danger = document.createElement("section");
  danger.innerHTML = `<h3>Reset</h3><p>Clears every earned mark and setting in this browser.</p>`;
  const reset = document.createElement("button");
  reset.className = "danger";
  reset.textContent = "Reset all progress";
  reset.addEventListener("click", () => {
    if (window.confirm("Clear all earned trophies and settings?")) {
      resetAll();
      ctx.refresh();
    }
  });
  danger.appendChild(reset);
  wrap.appendChild(danger);
  el.appendChild(wrap);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
