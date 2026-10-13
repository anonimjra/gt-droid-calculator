export type HarvestBuffType =
  | "dcs"
  | "hog"
  | "none"
  | "harvester_fuel"
  | "dcs_harvester"
  | "block_head";

export type BreakBonusType =
  | "ances_1"
  | "ances_2"
  | "ances_3"
  | "ances_4"
  | "ances_5"
  | "ances_6"
  | "tm"
  | "none";

export interface GTItemPreset {
  id: string;
  name: string;
  rarity: number;
  isFarmable: boolean;
  category: "Passive Vend / Low-Mid" | "Massing Project" | "Splicing Base" | "Farmable";
  hitsHand: number;
  hitsPickaxe: number;
  growTimeStr: string;
  chi: "Earth" | "Wind" | "Fire" | "Water" | "None";
  defaultSeedRatePerWL: number; // e.g. 200 means 200/1 WL, 3 means 3/1 WL
  defaultBlockSellPerWL: number; // e.g. 100 means 100/1 WL, 6 means 6/1 WL
  recipe?: {
    seedAName: string;
    seedARatePerWL: number;
    seedBName: string;
    seedBRatePerWL: number;
  };
  icon?: string;
  notes: string;
}

export const PRESET_ITEMS: GTItemPreset[] = [
  {
    id: "devil_horns",
    name: "Devil Horns",
    rarity: 9,
    isFarmable: false,
    category: "Passive Vend / Low-Mid",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "24m 18s",
    chi: "Fire",
    defaultSeedRatePerWL: 200,
    defaultBlockSellPerWL: 100,
    recipe: {
      seedAName: "Rock Seed",
      seedARatePerWL: 200,
      seedBName: "Crimson Wing Seed",
      seedBRatePerWL: 200,
    },
    notes: "Item pasif income favorit! Seed drop harvest tinggi (20% = 540 seed/farm). Jual 200/1 WL aja udah untung 2.5x lipat modal.",
  },
  {
    id: "mud_glob",
    name: "Mud Glob",
    rarity: 4,
    isFarmable: false,
    category: "Passive Vend / Low-Mid",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "4m 16s",
    chi: "Water",
    defaultSeedRatePerWL: 200,
    defaultBlockSellPerWL: 100,
    recipe: {
      seedAName: "Dirt Seed",
      seedARatePerWL: 200,
      seedBName: "Water Bucket Seed",
      seedBRatePerWL: 200,
    },
    notes: "Seed balik saat harvest 25% (675 seed per 2.700 pohon)! Cepat tumbuh (4 menit) dan bahan splice Ripper Wings.",
  },
  {
    id: "orange",
    name: "Orange",
    rarity: 15,
    isFarmable: false,
    category: "Passive Vend / Low-Mid",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "1h 7m 30s",
    chi: "Earth",
    defaultSeedRatePerWL: 100,
    defaultBlockSellPerWL: 100,
    recipe: {
      seedAName: "Apple Seed",
      seedARatePerWL: 150,
      seedBName: "Daisy Seed",
      seedBRatePerWL: 200,
    },
    notes: "Consumable & bahan Cooking/Quest. Seed 100/1 WL (modal 27 WL/farm), jual 200/1 udah untung, jual 100/1 cuan +45 WL!",
  },
  {
    id: "swiss_cheese",
    name: "Swiss Cheese Block",
    rarity: 21,
    isFarmable: false,
    category: "Passive Vend / Low-Mid",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "2h 11m 39s",
    chi: "Wind",
    defaultSeedRatePerWL: 100,
    defaultBlockSellPerWL: 100,
    recipe: {
      seedAName: "Yellow Block Seed",
      seedARatePerWL: 150,
      seedBName: "Milk Seed",
      seedBRatePerWL: 120,
    },
    notes: "Rarity 21, drop 324 seed + 2.800 Gems per farm. Cocok banget buat HoG pasif income dijual mid price (100/1 - 150/1).",
  },
  {
    id: "cutaway_building",
    name: "Cutaway Building",
    rarity: 23,
    isFarmable: false,
    category: "Massing Project",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "2h 36m 17s",
    chi: "Earth",
    defaultSeedRatePerWL: 50,
    defaultBlockSellPerWL: 50,
    recipe: {
      seedAName: "Western Building Seed",
      seedARatePerWL: 150,
      seedBName: "Tenement Building Seed",
      seedBRatePerWL: 150,
    },
    notes: "Bahan utama Glowy Block! Hardness cuma 2 hits pakai Pickaxe. Bisa dijual langsung sebagai block ke masser lain.",
  },
  {
    id: "neon_lights",
    name: "Neon Lights",
    rarity: 26,
    isFarmable: false,
    category: "Massing Project",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "2h 8m 56s",
    chi: "Wind",
    defaultSeedRatePerWL: 3,
    defaultBlockSellPerWL: 12,
    recipe: {
      seedAName: "Purple Block Seed",
      seedARatePerWL: 3,
      seedBName: "Glass Block Seed",
      seedBRatePerWL: 50,
    },
    notes: "Pasangan splice Cutaway Building untuk bikin Glowy Block. Juga keluar dari Vegas Pack (20.000 Gems).",
  },
  {
    id: "glowy_block",
    name: "Glowy Block",
    rarity: 49,
    isFarmable: false,
    category: "Massing Project",
    hitsHand: 4,
    hitsPickaxe: 3,
    growTimeStr: "10h 23m 49s",
    chi: "Wind",
    defaultSeedRatePerWL: 2,
    defaultBlockSellPerWL: 6,
    recipe: {
      seedAName: "Cutaway Building Seed",
      seedARatePerWL: 40,
      seedBName: "Neon Lights Seed",
      seedBRatePerWL: 3,
    },
    notes: "Target massing Rarity 49! Jual di 6/1 WL + bahan Cutaway 150/1 + Neon Seed 3/1 menghasilkan profit ~3 DL per farm!",
  },
  {
    id: "display_box",
    name: "Display Box",
    rarity: 45,
    isFarmable: false,
    category: "Massing Project",
    hitsHand: 5,
    hitsPickaxe: 4,
    growTimeStr: "1d 7h 55m",
    chi: "Wind",
    defaultSeedRatePerWL: 3,
    defaultBlockSellPerWL: 10,
    recipe: {
      seedAName: "Glass Block Seed",
      seedARatePerWL: 50,
      seedBName: "Music Box Seed",
      seedBRatePerWL: 10,
    },
    icon: "/icons/display_box.png",
    notes: "Etalase pameran item populer yang selalu laris di Vend untuk toko dan museum.",
  },
  {
    id: "science_station",
    name: "Science Station",
    rarity: 53,
    isFarmable: false,
    category: "Massing Project",
    hitsHand: 4,
    hitsPickaxe: 3,
    growTimeStr: "5d 16h",
    chi: "Fire",
    defaultSeedRatePerWL: 1,
    defaultBlockSellPerWL: 3,
    recipe: {
      seedAName: "Toxic Waste Barrel Seed",
      seedARatePerWL: 5,
      seedBName: "Military Radio Seed",
      seedBRatePerWL: 4,
    },
    icon: "/icons/science_station.png",
    notes: "Raja passive income penghasil Chemical setiap 12 jam.",
  },
  {
    id: "glass_block",
    name: "Glass Block",
    rarity: 13,
    isFarmable: true,
    category: "Splicing Base",
    hitsHand: 3,
    hitsPickaxe: 2,
    growTimeStr: "2h 49m",
    chi: "Wind",
    defaultSeedRatePerWL: 50,
    defaultBlockSellPerWL: 150,
    recipe: {
      seedAName: "Aqua Block Seed",
      seedARatePerWL: 150,
      seedBName: "Glass Pane Seed",
      seedBRatePerWL: 200,
    },
    icon: "/icons/glass_block.png",
    notes: "Bahan dasar puluhan resep massing (Neon Lights, Display Box, Window, dll).",
  },
  {
    id: "purple_block",
    name: "Purple Block",
    rarity: 9,
    isFarmable: true,
    category: "Splicing Base",
    hitsHand: 4,
    hitsPickaxe: 3,
    growTimeStr: "48m 16s",
    chi: "Water",
    defaultSeedRatePerWL: 3,
    defaultBlockSellPerWL: 20,
    recipe: {
      seedAName: "Red Block Seed",
      seedARatePerWL: 100,
      seedBName: "Blue Block Seed",
      seedBRatePerWL: 100,
    },
    icon: "/icons/purple_block.png",
    notes: "Lebih murah splice sendiri dari Red Block + Blue Block daripada beli jadi 3/1 WL!",
  },
];

export interface DroidHarvestResult {
  trees: number;
  rarity: number;
  isFarmable: boolean;
  buff: HarvestBuffType;
  buffLabel: string;
  gemDrops: number;
  hogFuelGems: number;
  blockDrops: number;
  seedDrops: number;
  seedDropPercent: number;
  xpEarned: number;
  replantedTotalBlocks: number;
  timeTractorSec: number;
  timeHandSec: number;
  timeHandSpeedySec: number;
  timeTractorSpeedySec: number;
}

export interface DroidBreakResult {
  blocks: number;
  rarity: number;
  isFarmable: boolean;
  bonus: BreakBonusType;
  bonusLabel: string;
  gemDrops: number;
  tmFuelGems: number;
  blockDrops: number;
  extraSeedsIfBroken: number;
  seedDrops: number;
  totalSeedsWithExtra: number;
  xpBase: number;
  xpTotalWithExtra: number;
  timeHandSec: number;
  timePickaxeSec: number;
}

export function getXpPerUnit(rarity: number): number {
  if (rarity <= 5) return 1;
  if (rarity <= 10) return 2;
  if (rarity <= 14) return 3;
  if (rarity <= 19) return 4;
  if (rarity <= 24) return 5;
  if (rarity <= 29) return 6;
  if (rarity <= 39) return 8;
  if (rarity <= 55) return 10;
  return Math.min(25, Math.round(rarity / 4.8));
}

export function getHarvestSeedRate(rarity: number, isFarmable: boolean): number {
  if (isFarmable) return 0.22;
  if (rarity <= 5) return 0.25;
  if (rarity <= 11) return 0.20;
  if (rarity <= 18) return 0.16;
  if (rarity <= 35) return 0.12;
  return 0.06;
}

export function getHarvestBuffLabel(buff: HarvestBuffType): string {
  switch (buff) {
    case "dcs":
      return "Dreamcatcher Staff (+3% Extra Block)";
    case "hog":
      return "Heart of Gaia / HoG (Auto-HT • 0 Gems • Bensin 1 Gem/Tree)";
    case "harvester_fuel":
      return "Robinson's / Harvester of Sorrows (+10% Extra Block)";
    case "dcs_harvester":
      return "Harvester + Dreamcatcher Combo (+13% Extra Block)";
    case "block_head":
      return "Buddy's Block Head (+5% Extra Block)";
    case "none":
      return "Tanpa Buff (Normal Hand / Tractor)";
  }
}

export function getBreakBonusLabel(bonus: BreakBonusType): string {
  switch (bonus) {
    case "ances_1":
      return "Ancestral Tesseract of Dimensions Level 1 (+5% block drop)";
    case "ances_2":
      return "Ancestral Tesseract of Dimensions Level 2 (+6.2% block drop)";
    case "ances_3":
      return "Ancestral Tesseract of Dimensions Level 3 (+7.4% block drop)";
    case "ances_4":
      return "Ancestral Tesseract of Dimensions Level 4 (+8.6% block drop)";
    case "ances_5":
      return "Ancestral Tesseract of Dimensions Level 5 (+9.8% block drop)";
    case "ances_6":
      return "Ancestral Tesseract of Dimensions Level 6 (+11% block drop)";
    case "tm":
      return "Tesseract Manipulator / TM (Auto-Break • 0 Gems)";
    case "none":
      return "Tanpa Bonus (Normal Break)";
  }
}

export function calculateDroidHarvest(
  trees: number,
  rarity: number,
  isFarmable: boolean,
  buff: HarvestBuffType
): DroidHarvestResult {
  const safeTrees = Math.max(0, Math.floor(trees));
  const safeRarity = Math.max(1, Math.floor(rarity));

  // Block drop multiplier per tree (exact Droid Bot formula)
  let blockPerTree = isFarmable ? 2.65 : 2.5;
  if (buff === "dcs") {
    blockPerTree = isFarmable ? 2.7295 : 2.575185; // 2700 * 2.575185 = 6953
  } else if (buff === "harvester_fuel") {
    blockPerTree = isFarmable ? 2.915 : 2.75;
  } else if (buff === "dcs_harvester") {
    blockPerTree = isFarmable ? 2.9945 : 2.825185;
  } else if (buff === "block_head") {
    blockPerTree = isFarmable ? 2.7825 : 2.625;
  }

  const blockDrops = Math.round(safeTrees * blockPerTree);

  // Seed drops on harvest (exact Droid Bot rarity brackets)
  const seedRate = getHarvestSeedRate(safeRarity, isFarmable);
  const seedDrops = Math.round(safeTrees * seedRate);

  // Gems on harvest (exact Droid Bot formula: R <= 30 uses rarity/20.25; R > 30 uses quadratic/high-tier scaling)
  let gemDrops = 0;
  let hogFuelGems = 0;
  if (buff === "hog") {
    gemDrops = 0;
    hogFuelGems = safeTrees; // 1 gem per tree
  } else {
    if (safeRarity <= 30) {
      gemDrops = Math.round((safeTrees * safeRarity) / 20.25);
    } else {
      gemDrops = Math.round(safeTrees * (safeRarity * 0.0740886));
    }
  }

  const xpEarned = safeTrees * getXpPerUnit(safeRarity);

  // Compounding blocks if harvest seeds are replanted until 0
  const replantedTotalBlocks =
    seedRate < 1 ? Math.round(blockDrops / (1 - seedRate)) : blockDrops;

  // Exact Droid Bot harvesting times
  const timeTractorSec = Math.round(safeTrees * 0.25);
  const timeHandSec = Math.round(safeTrees / 2.3);
  const timeHandSpeedySec = Math.floor(safeTrees * 0.375);
  const timeTractorSpeedySec = Math.round(safeTrees * 0.245185);

  return {
    trees: safeTrees,
    rarity: safeRarity,
    isFarmable,
    buff,
    buffLabel: getHarvestBuffLabel(buff),
    gemDrops,
    hogFuelGems,
    blockDrops,
    seedDrops,
    seedDropPercent: Math.round(seedRate * 100),
    xpEarned,
    replantedTotalBlocks,
    timeTractorSec,
    timeHandSec,
    timeHandSpeedySec,
    timeTractorSpeedySec,
  };
}

export function calculateDroidBreak(
  blocks: number,
  rarity: number,
  isFarmable: boolean,
  bonus: BreakBonusType,
  hitsHand: number = 3,
  hitsPickaxe: number = 2
): DroidBreakResult {
  const safeBlocks = Math.max(0, Math.floor(blocks));
  const safeRarity = Math.max(1, Math.floor(rarity));

  const baseSeedRate = isFarmable ? 0.285 : 0.25;
  const baseBlockRate = isFarmable ? 0.11 : 1 / 12; // 8.3333%

  const bonusMap: Record<BreakBonusType, number> = {
    none: 0,
    tm: 0,
    ances_1: 0.05, // 1/12 + 0.05 = 2/15 -> 6953 * 2/15 = 927
    ances_2: 0.062,
    ances_3: 0.074,
    ances_4: 0.086,
    ances_5: 0.098,
    ances_6: 0.11,
  };

  const extraBlockRate = baseBlockRate + bonusMap[bonus];
  const blockDrops = Math.round(safeBlocks * extraBlockRate);
  const extraSeedsIfBroken = Math.round(blockDrops * baseSeedRate);
  const seedDrops = Math.round(safeBlocks * baseSeedRate);
  const totalSeedsWithExtra = seedDrops + extraSeedsIfBroken;

  let gemDrops = 0;
  let tmFuelGems = 0;
  if (bonus === "tm") {
    gemDrops = 0;
    tmFuelGems = safeBlocks;
  } else {
    gemDrops = Math.round(((safeBlocks + blockDrops) * safeRarity) / 22.9225);
  }

  const xpPerBlock = getXpPerUnit(safeRarity);
  const xpBase = safeBlocks * xpPerBlock;
  const xpTotalWithExtra = (safeBlocks + blockDrops) * xpPerBlock;

  // Time calculation (6,953 blocks @ 3 hits = ~7,200 sec = 2 Hours)
  const timeHandSec = Math.round(safeBlocks * hitsHand * 0.3452);
  const timePickaxeSec = Math.round(safeBlocks * hitsPickaxe * 0.3452);

  return {
    blocks: safeBlocks,
    rarity: safeRarity,
    isFarmable,
    bonus,
    bonusLabel: getBreakBonusLabel(bonus),
    gemDrops,
    tmFuelGems,
    blockDrops,
    extraSeedsIfBroken,
    seedDrops,
    totalSeedsWithExtra,
    xpBase,
    xpTotalWithExtra,
    timeHandSec,
    timePickaxeSec,
  };
}

export function formatDurationDroid(seconds: number): string {
  if (seconds < 1200) {
    return `${seconds.toLocaleString("en-US")} sec`;
  }
  const hours = seconds / 3600;
  if (Math.abs(hours - Math.round(hours)) < 0.08) {
    return `${Math.round(hours)} Hours`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m (${seconds.toLocaleString("en-US")} sec)` : `${m} Mins`;
}
