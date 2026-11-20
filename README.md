# Sunset Platinum — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/bounty/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/rank/gta6-trophy-guide-01/steveales-1122/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/reward/gta6-trophy-guide-01/steveales-1122/gta6-trophy-guide-01)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 trophies of Grand Theft Auto VI on PlayStation 5 — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Checklist** — every trophy with its official name, description and grade; tick one off when it pops and progress saves in the browser (localStorage). Filters by kind (story, missable, collectibles, activities, online) and by earned / not earned, plus text search.
- **Roadmap** — six stages to the Platinum, in the order to play them, each with its trophies and progress.
- **Missables** — the one potentially missable trophy (Positive Mental Attitude, the balcony meditation in Chapter 1) with the exact moment to catch it.
- **100% Stages** — the completion checklist behind A Long Road, with the numbers the game counts.
- **Planner** — what is left, ordered by roadmap stage, with the missable one pinned first.
- **What next?** — one suggestion at a time from what is still open.
- **Stats** — earned by grade and by kind, plus trophy points.
- **History** — every trophy you ticked off, in the order it landed.
- **Settings** — spoiler hiding (story trophies read as "Hidden trophy" until earned), export progress as Markdown or JSON, import it back, reset.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network: every file the app loads is under `app/`.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Sources

Every guide is written for this entry, in our own words, and cites its sources beside each trophy. The official names and descriptions are shown as PlayStation publishes them.

- [Push Square — GTA 6: Trophy Guide & Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap)
- [Keeengamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [EGamers.io — GTA 6 Trophy List](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/)

No Rockstar Games logo, official artwork, box art or screenshot of the game is used: the look is our own.
