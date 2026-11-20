# Sunset Platinum — GTA VI Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Steveales-1122/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Steveales-1122/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

A complete, offline trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5 — all 55 trophies, with a roadmap, a 100% checklist, a missables guide, and a progress tracker that works entirely in your browser.

## What it covers

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden, 1 potentially missable.
- **The Platinum, "Vice Got a Price!"** — the road to it in six stages, from the story (Chapter 1 first) to the final cleanup.
- **The one missable trophy** — Positive Mental Attitude (meditate at all 18 spots). Do the first one in Chapter 1: after the mission Down to Earth, find Lucia at Jason's house in the morning and accept her balcony invitation. It may disappear once Chapter 1 ends.
- **100% completion** — A Long Road (Gold) follows the in-game 100% checklist under Progress, Stats. The thresholds are lenient (about 60% of true completion), so the hardest leftovers can be skipped.
- **No online trophies** — every trophy is earnable solo. One playthrough, no mission replay, cheats disable trophies.
- **Sources** — every trophy is sourced from Keeengamer, EGamers, PowerPyx, and GTABase, cross-checked against each other. Five hidden trophies are still unconfirmed (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) — the guide says so instead of guessing.

## The tracker

Open `app/index.html` (or run `node serve.ts` and visit the printed address). Everything is local:

- **Checklist** — search, filter by kind/grade/earned, tick trophies off as they pop; progress is saved in your browser.
- **Roadmap** — six stages in the order to play them, each with its trophies and your progress.
- **100% Stages** — the four groups of the in-game 100% checklist, with the numbers the game counts.
- **Missables** — the one missable trophy, plus the five still-unconfirmed hidden ones.
- **Planner** — everything still open, ordered by roadmap stage, missable first.
- **What next?** — one suggestion at a time.
- **Stats** — earned by grade and kind, trophy points, overall progress.
- **History** — every trophy you ticked off, in the order it landed.
- **Settings** — a spoiler mode that masks hidden story trophies until you earn them, plus export/import of your progress (Markdown or JSON) and a reset.

Keyboard: `1`–`9` switch views, `/` focuses search, `h` toggles spoilers.

## Run it

```sh
node serve.ts            # serves app/ on http://127.0.0.1:8123
node main.ts             # writes the submission dossier to $MAKEFUN_OUTPUT_DIR
```

`main.ts` uses only the Node standard library and the bundled `vendor/makefun-frontend.ts` helper. It reads the app and screenshots, writes `dossier.json`, and never touches the network.

## Trophy facts

- 55 trophies: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze.
- 28 hidden (27 Bronze + 1 Gold — the final mission).
- 1 potentially missable: Positive Mental Attitude.
- ~200 hours for 100%, difficulty about 4/10.

Built for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).
