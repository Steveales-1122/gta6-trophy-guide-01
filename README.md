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
- **Settings & save** — spoiler toggle, paper/night theme, export progress to a file and import it back, per-trophy notes, reset.

## The list

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation until earned; none online. Names, descriptions, grades and PSN progress targets were verified against Exophase (`exophase.com/game/grand-theft-auto-vi-psn/trophies/`) and PSNProfiles on 19 November 2026. The data lives in `app/data/trophies.json`.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
