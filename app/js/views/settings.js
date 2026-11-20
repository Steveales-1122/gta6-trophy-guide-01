// Settings: the spoiler toggle, progress export and import, and reset.
// Shortcuts: 1–9 switch views, / focuses search, h toggles spoilers.
export function renderSettings(ctx) {
  const { state } = ctx;
  return `<h2>Settings</h2>
<section class="card"><h3>Spoilers</h3>
<p class="lede">When spoilers are on, story trophies you have not earned yet read as "Hidden trophy" until you earn them.</p>
<p><button class="btn" data-action="toggle-spoilers">Spoilers: ${state.store.settings.spoilers ? "hidden" : "shown"}</button></p></section>
<section class="card"><h3>Progress</h3>
<p class="lede">Progress is saved in this browser only. Export it to keep a copy, or to move it to another browser.</p>
<p><button class="btn" data-action="export-md">Export as Markdown</button> <button class="btn ghost" data-action="export-json">Export as JSON</button></p>
<p><label>Import a progress file: <input type="file" id="import-file" accept="application/json"></label></p>
<p><button class="btn ghost" data-action="reset">Reset all progress</button></p></section>
<section class="card"><h3>Shortcuts</h3>
<p class="lede"><kbd>1</kbd>–<kbd>9</kbd> switch views · <kbd>/</kbd> focuses search · <kbd>h</kbd> toggles spoilers.</p></section>`;
}
