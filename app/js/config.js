// Shared constants for the Sunset Platinum guide.
// Every value here is written for this entry; nothing is loaded from outside.
export const STORAGE_KEY = "sunset-platinum-v2";
export const DATA_URL = "data/trophies.json";
export const APP_NAME = "Sunset Platinum";
export const APP_TAGLINE = "An offline GTA VI trophy guide and tracker for all 55 PlayStation 5 trophies";

// Grade labels in the order the game lists them, with the points this
// guide uses for its progress math (a rough weight, not an official score).
export const GRADES = ["Platinum", "Gold", "Silver", "Bronze"];
export const GRADE_POINTS = { Platinum: 0, Gold: 90, Silver: 30, Bronze: 15 };

// Filter kinds the checklist offers. "online" is deliberately empty:
// the game has no online trophies, and the filter says so when picked.
export const KINDS = [
  { id: "all", label: "All trophies" },
  { id: "story", label: "Story" },
  { id: "missable", label: "Missable" },
  { id: "collectible", label: "Collectibles" },
  { id: "activity", label: "Activities" },
  { id: "robbery", label: "Robberies" },
  { id: "combat", label: "Combat" },
  { id: "exploration", label: "Exploration" },
  { id: "money", label: "Money" },
  { id: "secret", label: "Secret" },
  { id: "online", label: "Online" },
  { id: "platinum", label: "Platinum path" },
];

// The six roadmap stages, in the order the guide recommends playing them.
export const STAGES = [
  {
    id: 1,
    title: "Play the story",
    blurb:
      "Chapters 1 to 4 and the final mission. Make a manual save at the start of every chapter — the game has no mission replay.",
  },
  {
    id: 2,
    title: "Strangers and side strands",
    blurb:
      "Finish the stranger mission strands — Andy, Kenton, Billy, Randy, Tyrone and Bret — for 8 strands in all.",
  },
  {
    id: 3,
    title: "See all of Leonida",
    blurb:
      "Explore every region and sweep the collectibles: WAiNK spots, card sets, vehicles, meditation spots and garages.",
  },
  {
    id: 4,
    title: "Crime pays",
    blurb:
      "Robberies and money: bank vaults, the armored truck, the jewelry store, one illegal operation per gang, and laundering.",
  },
  {
    id: 5,
    title: "Master the activities",
    blurb:
      "The long grinds and the skill tests: 250 stunts, 42 shooting-range golds, races, drone races, fishing and challenges.",
  },
  {
    id: 6,
    title: "Secrets and the Platinum",
    blurb:
      "The eight cryptic 5G secret trophies, then 100% completion for A Long Road — and the Platinum pops with it.",
  },
];

// Sources the guides cite, with a link only where this entry verified one.
// A name with no link is still a citation: the reader can search it.
export const SOURCE_LINKS = {
  "Exophase (via Planet GTA 6)": "https://www.planetgta6.com/en/gta-6-trophies/",
  "Output Lag": "https://outputlag.com/guides/gta-6-trophy-list/",
  "GTA Vibes": "https://www.gtavibes.com/guides/gta-6-trophy-list-achievements",
};

// Views the app routes to, in nav order. The detail view is reached by
// clicking a trophy and is not a nav tab.
export const VIEWS = [
  { id: "checklist", label: "Checklist", key: "1" },
  { id: "roadmap", label: "Roadmap", key: "2" },
  { id: "stages", label: "Stages", key: "3" },
  { id: "missables", label: "Missables", key: "4" },
  { id: "stats", label: "Stats", key: "5" },
  { id: "planner", label: "Planner", key: "6" },
  { id: "picker", label: "Surprise me", key: "7" },
  { id: "timeline", label: "History", key: "8" },
  { id: "settings", label: "Settings", key: "9" },
];
