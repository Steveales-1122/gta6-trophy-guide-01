// Keyboard shortcuts for the guide. Typing in a field never triggers them.
export function bindShortcuts(handlers) {
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (event.key === "/" && !typing) {
      event.preventDefault();
      handlers.focusSearch && handlers.focusSearch();
      return;
    }
    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "s" || event.key === "S") {
      handlers.toggleSpoilers && handlers.toggleSpoilers();
    } else if (event.key === "e" || event.key === "E") {
      handlers.exportMarkdown && handlers.exportMarkdown();
    } else if (event.key === "?") {
      handlers.showShortcuts && handlers.showShortcuts();
    } else if (/^[1-9]$/.test(event.key)) {
      handlers.goView && handlers.goView(Number(event.key) - 1);
    }
  });
}
