// Shared constants for the Sunset Platinum guide: storage keys, kinds, grades and the roadmap stages.
export const STORAGE_KEY = 'sunset-platinum-v1';
export const SETTINGS_KEY = 'sunset-platinum-settings-v1';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export const KINDS = [
  { id: 'story', label: 'Story' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'missable', label: 'Missable' },
  { id: 'online', label: 'Online' },
];

// The roadmap to the platinum, built from the official trophy descriptions:
// story chapters and missions first, then strangers, then the open-world grind.
export const ROADMAP = [
  { n: 1, title: 'Play the story', note: 'Chapters 1 to 4, the named missions and the final mission. Twelve trophies, all unmissable — just play. Do the first meditation in Chapter 1 while you are there (see Missables).' },
  { n: 2, title: 'Strangers of Leonida', note: 'Eight stranger mission strands, five of them ending in a named final mission. Start each strand as soon as it unlocks: their windows are tied to story progress.' },
  { n: 3, title: 'Try everything once', note: 'One try of each activity type, an arcade game, a fishing challenge against Cal, and the bowling alley and showroom oddities. Seven trophies, all low effort.' },
  { n: 4, title: 'Races, stunts and the range', note: '250 stunts, 20 different race wins, a drone-race win at all 14 Top Fun locations, and gold medals in all 42 Shooting Range challenges.' },
  { n: 5, title: 'Out in the open', note: 'The collection sweep: 100 vehicles discovered, 100 WAiNK locations, 3 card sets, all 18 meditation spots, 10 vehicles registered, and every corner of Leonida explored.' },
  { n: 6, title: 'Robberies', note: 'Five bank vaults, an armored truck, a jewelry store done quietly, three shops in a row with your partner, one illegal operation per gang, plus the airport jet and the tank.' },
  { n: 7, title: 'Money and property', note: 'Launder $250,000 in Marked Bills, spend $100,000 across the shops, and buy all 8 garages. These build up while you do everything else.' },
  { n: 8, title: 'The long tail', note: 'Fifty challenges, 500 actions that shape your Criminal Profile, maxed Strength for both characters, and the two story-flavoured secret trophies nobody has pinned down yet.' },
  { n: 9, title: 'Platinum', note: 'Finish the 100% checklist after the story — A Long Road, the gold for 100% completion — and Vice Got a Price! pops with it.' },
];

export const MISSABLE_INTRO = 'Only one trophy is reported as possibly missable, and five more sit behind stranger chains with story-tied windows. Everything else can be earned after the credits, in free roam.';
