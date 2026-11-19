# Sunset Platinum — GTA VI Trophy Guide &amp; Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/steveales-1122/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/steveales-1122/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that is the best guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a checklist saved in the browser, export and import, filters by kind, a spoiler setting that hides story trophies until earned, a nine-stage roadmap to the platinum, missable warnings, and a guide to each trophy in our own words that cites its sources. No network requests at run time, no Rockstar artwork — just static files you can host anywhere.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. Or open `app/index.html` from any static server with `app/` at its root.

## What's inside

- **Checklist** — all 55 trophies with official names, descriptions and grades, saved in `localStorage`. Search, filter by kind (story, collectibles, activities, missable, online) and grade, and filter by earned / remaining.
- **Guide pane** — each trophy's guide in our own words with its sources cited beside it (Exophase's official list, PSNProfiles for the progress targets, and the EGamers round-up of PowerPyx / GTABase where a specific step or location is claimed). Five trophies are still unconfirmed in every guide and say so plainly instead of inventing steps.
- **Roadmap** — nine stages to the platinum, built from the official descriptions: story first, strangers while the story runs, then the open-world grind, 100% completion last.
- **Missables** — the one possibly missable trophy (Positive Mental Attitude: meditate in Chapter 1) and the five stranger finals with story-tied windows, plus the cheat warning.
- **Next up** — a planner listing your next ten unearned trophies in roadmap order.
- **Stats** — a dashboard with a progress ring, progress by grade and by kind, hidden-vs-revealed counts, per-roadmap-stage bars, and the rarest trophies still unearned.
- **Surprise me** — draws a random unearned trophy (never a spoiler-blocked one) and lets you pick another or mark it earned on the spot.
- **Stages** — the checklist grouped by the nine roadmap stages. Each stage is collapsible, shows its own progress bar and earned/total count, and the first stage with trophies still to earn is highlighted as the next one to work on. You can tick trophies off right here; progress is shared with the Checklist.
- **Earned history** — every earned trophy in the order it was earned, with the date and time it was ticked. Trophies ticked before the tracker started keeping dates are listed first as "earned before tracking" — no date is ever invented. The Stats dashboard also shows your latest earned trophy.
- **Settings & save** — spoiler toggle, paper/night theme, export progress to a file and import it back, per-trophy notes, reset.

## Export as Markdown

Settings & save has an **Export as Markdown** button next to the JSON export. It downloads `gta6-trophy-progress.md`: a plain-text checklist with one section per roadmap stage, checked boxes for earned trophies, the earned date where the tracker knows it, and your own notes beside their trophy — ready to paste into a note, a gist, or a repo. The JSON export carries the same earned timestamps, so importing it back keeps your history.

How the dates work: the moment you tick a trophy earned, the tracker records the current date and time in your browser (localStorage, beside the earned list). Untick it and the date is deleted with it. Trophies earned before this version — or imported from an export without dates — have no date stored and are shown as "earned before tracking" in the Checklist, the Stages view, the guide pane, and Earned history. Nothing in the app ever guesses a date.

Stages and Earned history need no setup: they read the same saved progress as the Checklist, work fully offline, and follow the spoiler setting — a hidden story trophy stays masked until earned, even in your own history list.

## Keyboard shortcuts

These work on the Checklist view and never fire while you type in a box:

| Key | Action |
| --- | --- |
| `/` | Focus the search box |
| `j` / `k` | Move the selection down / up the trophy list |
| `e` | Toggle earned on the selected trophy |
| `s` | Open the Stages view |
| `h` | Open the Earned-history view |
| `Esc` | Close the open guide pane |

The checklist also has a **Collapse earned** toggle that hides ticked rows, and each guide pane has a **Copy trophy summary** button. Printing the checklist gives a clean paper list with no navigation or buttons.

## The list

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation until earned; none online. Names, descriptions, grades and PSN progress targets were verified against Exophase (`exophase.com/game/grand-theft-auto-vi-psn/trophies/`) and PSNProfiles on 19 November 2026. The data lives in `app/data/trophies.json`.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
