// Keyboard shortcuts: digits switch views, / focuses the search box,
// h toggles the spoiler setting. Nothing else listens to keys.
import { VIEW_IDS } from "./config.js";

export function installKeys(state, rerender) {
  document.addEventListener("keydown", (event) => {
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key >= "1" && event.key <= String(VIEW_IDS.length)) {
      const id = VIEW_IDS[Number(event.key) - 1];
      if (id) location.hash = `#/${id}`;
    } else if (event.key === "/") {
      const box = document.querySelector('input[type="search"]');
      if (box) {
        event.preventDefault();
        box.focus();
      }
    } else if (event.key === "h" || event.key === "H") {
      state.store.settings.spoilers = !state.store.settings.spoilers;
      rerender();
    }
  });
}
