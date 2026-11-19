// Filtering and the spoiler rule for the checklist.
// Spoilers on: a hidden story trophy stays masked (name and description replaced)
// until it is earned. Everything else is always shown.
export function isSpoiled(trophy, settings, earned) {
  return settings.spoilers && trophy.hidden && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function visibleName(trophy, settings, earned) {
  return isSpoiled(trophy, settings, earned) ? 'Hidden trophy' : trophy.name;
}

export function visibleDescription(trophy, settings, earned) {
  return isSpoiled(trophy, settings, earned)
    ? 'A hidden story trophy. Earn it to reveal its name and description.'
    : trophy.description;
}

export function filterTrophies(trophies, settings, earned) {
  const q = settings.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (settings.kind !== 'all') {
      if (settings.kind === 'missable') {
        if (t.missable === 'no') return false;
      } else if (settings.kind === 'online') {
        return false; // No online trophies: the game lists none.
      } else if (t.kind !== settings.kind) return false;
    }
    if (settings.missableOnly && t.missable === 'no') return false;
    if (settings.grade !== 'all' && t.grade !== settings.grade) return false;
    if (settings.state === 'earned' && !earned.has(t.name)) return false;
    if (settings.state === 'remaining' && earned.has(t.name)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// Next up: unearned trophies in roadmap order, quick story wins first.
export function nextUp(trophies, earned, limit = 10) {
  return trophies
    .filter((t) => !earned.has(t.name))
    .sort((a, b) => a.stage - b.stage || a.id - b.id)
    .slice(0, limit);
}
