// Shared constants for the guide: grades, kinds, roadmap stages, and the
// four groups of the in-game 100% completion checklist behind A Long Road.
export const GRADE_POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
export const GRADE_ORDER = ["platinum", "gold", "silver", "bronze"];
export const KINDS = ["story", "missable", "collectibles", "activities", "crime", "misc"];
export const KIND_LABELS = {
  story: "Story",
  missable: "Missable",
  collectibles: "Collectibles",
  activities: "Activities",
  crime: "Crime",
  misc: "Misc",
};

export const VIEW_IDS = ["checklist", "roadmap", "stages", "missables", "planner", "picker", "stats", "timeline", "settings"];

export const STAGES = [
  { n: 1, title: "Story first", blurb: "Play the five chapters and catch the one meditation that can be missed." },
  { n: 2, title: "Learn the ropes", blurb: "Try every activity once and win the early races, games and challenges." },
  { n: 3, title: "Crime pays", blurb: "Robberies, vaults, shops and trucks — the crime trophies, most of them in Chapter 4." },
  { n: 4, title: "Collect everything", blurb: "Cards, scans, garages, vehicles and the whole map of Leonida." },
  { n: 5, title: "Skill and grind", blurb: "Stunts, ranges, challenges and the strange hidden trophies." },
  { n: 6, title: "Strangers and platinum", blurb: "Finish every stranger strand, then the 100% checklist and the Platinum." },
];

// The in-game 100% checklist behind A Long Road, as Keeengamer lists it.
export const GROUPS_100 = [
  {
    name: "Story and optional tasks",
    items: [
      ["Main story", "Finish all chapters"],
      ["Optional tasks", "100 completed"],
    ],
  },
  {
    name: "Robberies and fencing",
    items: [
      ["Gang Operations", "39 of 39"],
      ["Bank Jobs", "22 of 22"],
      ["Payday Loan Jobs", "7 of 7"],
      ["Smash 'N' Grabs", "34 of 35"],
      ["Stick Ups", "50 of 91"],
      ["Bank Vaults", "8 of 8"],
      ["Narcotics fenced", "$100,000"],
      ["Jewelry fenced", "$100,000"],
      ["Marked Bills fenced", "$250,000"],
      ["Vehicles fenced", "$200,000"],
    ],
  },
  {
    name: "Collectibles and exploration",
    items: [
      ["Kenton's Treasure Sets", "5 of 7"],
      ["Collectible Card Sets", "15 of 18"],
      ["WAiNK Locations", "100 scans"],
      ["Underwater Discoveries", "33 of 33"],
      ["Magazines, Books and Comics", "30 of 34"],
      ["Meditations", "15 of 18 (trophy needs all 18)"],
      ["Cocaine Flamingos", "100 of 125"],
      ["Unique Playlists", "2 of 2"],
      ["Discovered Styles", "70 of 79"],
      ["Base-Model Vehicles", "200 of 277"],
      ["Standard Issue Weapons", "50 of 66"],
      ["Animals Studied", "100 of 255"],
    ],
  },
  {
    name: "Activities and challenges",
    items: [
      ["Unique Races won", "30 of 40"],
      ["Race Challenge Gold Medals", "10 of 13"],
      ["Shooting Range Gold Medals", "42 of 42"],
      ["Video Games", "Play all 4"],
      ["Pool Opponents", "Defeat 5 of 7"],
      ["Mini Golf", "Play at 2 of 3 locations"],
      ["Basketball Hoops", "Score at 90 of 100"],
      ["Drone Time Trials", "42 of 42 completed"],
      ["Stunts", "300 of 397"],
      ["Challenges", "70 of 80"],
      ["Bret's Target Decks", "15 of 15"],
    ],
  },
];
