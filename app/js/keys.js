// Keyboard shortcuts for the whole app. They never fire while the player
// is typing in a search box, a textarea or any other input.
export function installShortcuts(app) {
  document.addEventListener("keydown", (event) => {
    const tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target.isContentEditable) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key;
    if (key === "/") {
      event.preventDefault();
      app.focusSearch();
      return;
    }
    if (key === "?") {
      event.preventDefault();
      app.showHelp();
      return;
    }
    if (key === "e" || key === "E") {
      event.preventDefault();
      app.downloadExport();
      return;
    }
    if (key >= "1" && key <= "9") {
      const view = app.viewByKey(key);
      if (view) {
        event.preventDefault();
        app.go(view);
      }
    }
  });
}
