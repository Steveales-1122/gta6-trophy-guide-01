// Sunset Platinum — shared constants: grades, kinds, filters, roadmap stages,
// the 100% completion checklist groups, and the keyboard shortcuts.
// No network, no imports: every other module reads from here.
export const STORAGE_KEY = "sunset-platinum-v1";

export const GRADES = ["platinum", "gold", "silver", "bronze"];

export const GRADE_LABEL = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

export const GRADE_POINTS = { platinum: 300, gold: 90, silver: 30, bronze: 15 };

export const KINDS = ["story", "strangers", "collectibles", "activities", "completion", "platinum"];

export const KIND_LABEL = {
  story: "Story",
  strangers: "Strangers",
  collectibles: "Collectibles",
  activities: "Activities",
  completion: "100% Completion",
  platinum: "Platinum",
};

// The five filters the rules ask for, plus "all". Online is real here: the
// game has zero online trophies, so that filter honestly shows an empty list.
export const FILTER_DEFS = [
  { id: "all", label: "All trophies", match: () => true },
  { id: "story", label: "Story", match: (t) => t.kind === "story" || t.kind === "strangers" },
  { id: "missable", label: "Missable", match: (t) => t.missable === true },
  { id: "collectibles", label: "Collectibles", match: (t) => t.kind === "collectibles" },
  { id: "activities", label: "Activities", match: (t) => t.kind === "activities" },
  { id: "online", label: "Online", match: () => false },
];

export const VIEW_DEFS = [
  { id: "checklist", label: "Checklist" },
  { id: "roadmap", label: "Roadmap" },
  { id: "missables", label: "Missables" },
  { id: "stages", label: "100% Stages" },
  { id: "planner", label: "Planner" },
  { id: "picker", label: "What next?" },
  { id: "stats", label: "Stats" },
  { id: "timeline", label: "History" },
  { id: "settings", label: "Settings" },
];

// The road to the platinum, in the order to play it. Each stage names the
// trophy ids it covers; a stage is done when every one of them is earned.
export const ROADMAP = [
  {
    id: "story",
    title: "Stage 1 — Play the story",
    hours: "60–80 hours",
    text: "Play the campaign with Jason and Lucia and enjoy it. No gold medals are needed in story missions, and free roam stays open after the credits, so there is no rush — except for one balcony meditation in Stage 2.",
    trophies: [
      "just-like-paradise", "paradise-lost", "t-ass-drug-money", "vice-city-baby",
      "top-of-the-world-ma", "you-gotta-know-when-to-get-off", "trust", "break-the-bank",
      "family-matters", "dwnfall", "hi-jacked", "snow-storm",
    ],
  },
  {
    id: "meditate",
    title: "Stage 2 — Meditate early (the only missable)",
    hours: "Do it in Chapter 1",
    text: "After the mission Down to Earth, Lucia invites Jason to meditate on the balcony in Chapter 1. Accept and finish it before leaving the chapter — it is the only currently identified missable step. Then work through the other 17 meditation spots; a spot only counts once the final zen animation plays.",
    trophies: ["positive-mental-attitude"],
  },
  {
    id: "strangers",
    title: "Stage 3 — Strangers & Freaks",
    hours: "10–20 hours",
    text: "Finish the five named stranger strands — Andy, Kenton, Billy, Randy and Tyrone — and any three other strands. Eight strands earn the silver; the five finales are trophies of their own.",
    trophies: [
      "road-to-rehabilitation", "this-was-no-boat-accident", "the-lone-rider",
      "supply-and-demand", "spin-on-this", "strangers-and-freaks", "fair-game",
    ],
  },
  {
    id: "collect",
    title: "Stage 4 — Collectibles and activities",
    hours: "Around 100 hours",
    text: "The long middle: cards, WAiNK scans, vehicles, stunts, shooting ranges, races and challenges. Do them as you pass them and clean up the rest after the story, using the 100% checklist in the Stages view.",
    trophies: [
      "cunning-stunts", "master-of-none", "the-shootist", "top-fun", "earn-cash-not-kudos",
      "baited-my-tackle", "stick-fiddler", "dont-touch-my-deck", "you-wainker",
      "one-last-thing", "whip-it-good", "gunslinger", "sneakthief", "maximum-withdrawal",
      "a-classic-blitz-play", "the-goodtime-state", "pest-control", "dime-on-the-dollar",
      "treat-yo-self", "little-boxes", "on-the-spot", "hot-together", "retail-therapy",
    ],
  },
  {
    id: "hundred",
    title: "Stage 5 — Reach 100% completion",
    hours: "Finishes with Stage 4",
    text: "Open Progress, then 100% Completion, after the story. You need 35 checklist tasks, not literally everything: 15 of 18 card sets, 70 of 80 Challenges, 300 of 397 stunts. The Stages view lists every target.",
    trophies: ["a-long-road"],
  },
  {
    id: "cleanup",
    title: "Stage 6 — Cleanup and Platinum",
    hours: "A few hours",
    text: "Sweep up whatever is left — the cryptic hidden trophies, the tank, the plane, the showroom — and the Platinum lands the moment the 54th trophy pops.",
    trophies: [
      "catch-me-if-you-can", "challenging-tank", "in-the-beginning", "capital-offense",
      "lets-go-bowling", "personal-best", "actions-speak-louder", "bad-luck-i-guess",
      "the-truth-is-out-there", "ten-pin", "vice-got-a-price",
    ],
  },
];

// The 100% completion checklist, as the in-game Progress screen counts it.
// Numbers come from the cited completion guides; "needed" is what counts.
export const COMPLETION_GROUPS = [
  { label: "Main story", tasks: [{ label: "Finish all chapters", needed: 1, of: 1 }] },
  {
    label: "Robberies",
    tasks: [
      { label: "Optional tasks", needed: 100, of: 100 },
      { label: "Gang Operations", needed: 39, of: 39 },
      { label: "Bank Jobs", needed: 22, of: 22 },
      { label: "Payday Loan Jobs", needed: 7, of: 7 },
      { label: "Smash 'N' Grabs", needed: 34, of: 35 },
      { label: "Stick Ups", needed: 50, of: 91 },
      { label: "Bank Vaults", needed: 8, of: 8 },
      { label: "Narcotics fenced", needed: 100000, of: 100000, money: true },
      { label: "Jewelry fenced", needed: 100000, of: 100000, money: true },
      { label: "Marked Bills fenced", needed: 250000, of: 250000, money: true },
      { label: "Vehicles fenced", needed: 200000, of: 200000, money: true },
    ],
  },
  {
    label: "Collectibles and exploration",
    tasks: [
      { label: "Kenton's Treasure Sets", needed: 5, of: 7 },
      { label: "Collectible Card Sets", needed: 15, of: 18 },
      { label: "WAiNK Locations", needed: 100, of: 100 },
      { label: "Underwater Discoveries", needed: 33, of: 33 },
      { label: "Magazines, Books and Comics", needed: 30, of: 34 },
      { label: "Meditations", needed: 15, of: 18 },
      { label: "Cocaine Flamingos", needed: 100, of: 125 },
      { label: "Unique Playlists", needed: 2, of: 2 },
      { label: "Discovered Styles", needed: 70, of: 79 },
      { label: "Base-Model Vehicles", needed: 200, of: 277 },
      { label: "Standard Issue Weapons", needed: 50, of: 66 },
      { label: "Animals Studied", needed: 100, of: 255 },
    ],
  },
  {
    label: "Activities",
    tasks: [
      { label: "Unique Races won", needed: 30, of: 40 },
      { label: "Race Challenge Gold Medals", needed: 10, of: 13 },
      { label: "Shooting Range Gold Medals", needed: 42, of: 42 },
      { label: "Video Games played", needed: 4, of: 4 },
      { label: "Pool Opponents defeated", needed: 5, of: 7 },
      { label: "Mini Golf locations", needed: 2, of: 3 },
      { label: "Basketball Hoops scored", needed: 90, of: 100 },
      { label: "Drone Time Trials", needed: 42, of: 42 },
      { label: "Stunts", needed: 300, of: 397 },
      { label: "Challenges", needed: 70, of: 80 },
      { label: "Bret's Target Decks", needed: 15, of: 15 },
    ],
  },
];

export const SHORTCUTS = [
  { key: "/", label: "Focus search" },
  { key: "s", label: "Toggle spoiler hiding" },
  { key: "e", label: "Export progress as Markdown" },
  { key: "1–9", label: "Switch views" },
  { key: "?", label: "Show this list" },
];
