"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Calculator,
  Sprout,
  Hammer,
  Coins,
  Bookmark,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Zap,
  X,
  ChevronDown,
  Table,
  Cloud,
  RefreshCw,
  Download,
  LayoutGrid,
  Minimize2,
} from "lucide-react";
import {
  PRESET_ITEMS,
  GTItemPreset,
  HarvestBuffType,
  BreakBonusType,
  calculateDroidHarvest,
  calculateDroidBreak,
  formatDurationDroid,
} from "@/lib/gt-droid-engine";

interface SavedScenario {
  id: string;
  title: string;
  itemName: string;
  rarity: number;
  isFarmable: boolean;
  trees: number;
  harvestBuff: HarvestBuffType;
  costMode: "single_seed" | "splice_two" | "two_stage_mass";
  seedRateA: number;
  seedNameA: string;
  seedRateB: number;
  seedNameB: string;
  targetSellRate: number;
  seedBonusAction: "sell" | "replant" | "ignore";
  createdAt: string;
}

const DEFAULT_GITHUB_DB_URL =
  "https://anonimjra.github.io/gt-droid-calculator/droid_db.json";

const DEFAULT_SAVED_SCENARIOS: SavedScenario[] = [
  {
    id: "preset-devil-horns-hog",
    title: "🔥 Pasif Income: Devil Horns (HoG • Seed 200/1)",
    itemName: "Devil Horns",
    rarity: 9,
    isFarmable: false,
    trees: 2700,
    harvestBuff: "hog",
    costMode: "single_seed",
    seedRateA: 200,
    seedNameA: "Devil Horns Seed",
    seedRateB: 200,
    seedNameB: "-",
    targetSellRate: 200,
    seedBonusAction: "sell",
    createdAt: "GitHub DB",
  },
  {
    id: "preset-mud-glob-hog",
    title: "💧 Pasif Income: Mud Glob (HoG • Seed 200/1)",
    itemName: "Mud Glob",
    rarity: 4,
    isFarmable: false,
    trees: 2700,
    harvestBuff: "hog",
    costMode: "single_seed",
    seedRateA: 200,
    seedNameA: "Mud Glob Seed",
    seedRateB: 200,
    seedNameB: "-",
    targetSellRate: 200,
    seedBonusAction: "replant",
    createdAt: "GitHub DB",
  },
  {
    id: "preset-orange-hog",
    title: "🍊 Pasif Income: Orange Tree (HoG • Seed 100/1)",
    itemName: "Orange",
    rarity: 15,
    isFarmable: false,
    trees: 2700,
    harvestBuff: "hog",
    costMode: "single_seed",
    seedRateA: 100,
    seedNameA: "Orange Seed",
    seedRateB: 100,
    seedNameB: "-",
    targetSellRate: 150,
    seedBonusAction: "sell",
    createdAt: "GitHub DB",
  },
  {
    id: "preset-swiss-cheese-hog",
    title: "🧀 Pasif Income: Swiss Cheese (HoG • Seed 100/1)",
    itemName: "Swiss Cheese Block",
    rarity: 21,
    isFarmable: false,
    trees: 2700,
    harvestBuff: "hog",
    costMode: "single_seed",
    seedRateA: 100,
    seedNameA: "Swiss Cheese Seed",
    seedRateB: 100,
    seedNameB: "-",
    targetSellRate: 100,
    seedBonusAction: "sell",
    createdAt: "GitHub DB",
  },
  {
    id: "preset-glowy-opsi3",
    title: "⚡ Massing Glowy Block (Opsi 3: Cutaway 150/1 + Neon 3/1 ➔ Jual 6/1)",
    itemName: "Glowy Block",
    rarity: 49,
    isFarmable: false,
    trees: 2700,
    harvestBuff: "dcs",
    costMode: "two_stage_mass",
    seedRateA: 40,
    seedNameA: "Cutaway Seed",
    seedRateB: 3,
    seedNameB: "Neon Lights Seed",
    targetSellRate: 6,
    seedBonusAction: "replant",
    createdAt: "GitHub DB",
  },
];

type PopupModalType =
  | null
  | "items"
  | "harvest"
  | "break"
  | "vend_table"
  | "advanced_cost"
  | "saved"
  | "cloud_db";

export default function GTDroidCalculatorApp() {
  // UI Version Mode: "v2" (Compact Popup Window) vs "v1" (Full Dashboard)
  const [uiVersion, setUiVersion] = useState<"v1" | "v2">("v2");

  // Active tab in Versi 1 (Full Dashboard)
  const [activeTabV1, setActiveTabV1] = useState<
    "droid" | "profit" | "database"
  >("droid");

  // Active small popup window in Versi 2 (Compact)
  const [openModal, setOpenModal] = useState<PopupModalType>(null);

  // Cloud GitHub Pages DB Sync State
  const [githubDbUrl, setGithubDbUrl] = useState<string>(DEFAULT_GITHUB_DB_URL);
  const [dbSyncStatus, setDbSyncStatus] = useState<
    "syncing" | "synced" | "fallback"
  >("syncing");
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("-");
  const [remoteItems, setRemoteItems] = useState<GTItemPreset[]>(PRESET_ITEMS);

  // LocalStorage custom items & scenarios
  const [customItems, setCustomItems] = useState<GTItemPreset[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(
    DEFAULT_SAVED_SCENARIOS
  );

  // Core Item State
  const [selectedItemId, setSelectedItemId] = useState<string>("devil_horns");
  const [itemName, setItemName] = useState<string>("Devil Horns");
  const [rarity, setRarity] = useState<number>(9);
  const [isFarmable, setIsFarmable] = useState<boolean>(false);
  const [hitsHand, setHitsHand] = useState<number>(3);
  const [hitsPickaxe, setHitsPickaxe] = useState<number>(2);

  // Core Calculator Inputs
  const [trees, setTrees] = useState<number>(2700);
  const [harvestBuff, setHarvestBuff] = useState<HarvestBuffType>("hog");
  const [requesterName] = useState<string>("dabomarimasjeruk");
  const [breakBlocksInput, setBreakBlocksInput] = useState<number>(6750);
  const [autoSyncBreakBlocks, setAutoSyncBreakBlocks] = useState<boolean>(true);
  const [breakBonus, setBreakBonus] = useState<BreakBonusType>("ances_1");

  // Cost & Selling Inputs
  const [costMode, setCostMode] = useState<
    "single_seed" | "splice_two" | "two_stage_mass"
  >("single_seed");
  const [seedRateA, setSeedRateA] = useState<number>(200);
  const [seedRateB, setSeedRateB] = useState<number>(200);
  const [stage1A, setStage1A] = useState<number>(150);
  const [stage1B, setStage1B] = useState<number>(150);
  const [stage2Mode, setStage2Mode] = useState<"buy_seed" | "splice_raw">(
    "buy_seed"
  );
  const [stage2DirectSeedRate, setStage2DirectSeedRate] = useState<number>(3);
  const [stage2RawA, setStage2RawA] = useState<number>(3);
  const [stage2RawB, setStage2RawB] = useState<number>(50);

  const [targetSellRate, setTargetSellRate] = useState<number>(200);
  const [seedBonusAction, setSeedBonusAction] = useState<
    "sell" | "replant" | "ignore"
  >("sell");

  // Copy states
  const [copiedHarvest, setCopiedHarvest] = useState<boolean>(false);
  const [copiedBreak, setCopiedBreak] = useState<boolean>(false);

  // New Custom Item Form
  const [newCustomName, setNewCustomName] = useState<string>("");
  const [newCustomRarity, setNewCustomRarity] = useState<number>(15);
  const [newCustomSeedRate, setNewCustomSeedRate] = useState<number>(100);
  const [newCustomBlockRate, setNewCustomBlockRate] = useState<number>(100);
  const [newCustomFarmable, setNewCustomFarmable] = useState<boolean>(false);

  // Fetch Database from GitHub Pages (with fallback to Raw GitHub & local /droid_db.json)
  const syncFromGithubPages = useCallback(
    async (customUrl?: string) => {
      setDbSyncStatus("syncing");
      const targetUrl = customUrl || githubDbUrl;
      const cacheBuster = `?t=${Date.now()}`;
      const urlsToTry = [
        `${targetUrl}${cacheBuster}`,
        `https://raw.githubusercontent.com/anonimjra/gt-droid-calculator/gh-pages/droid_db.json${cacheBuster}`,
        `https://raw.githubusercontent.com/anonimjra/gt-droid-calculator/main/public/droid_db.json${cacheBuster}`,
        `/droid_db.json${cacheBuster}`,
      ];

      for (const url of urlsToTry) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.items) && data.items.length > 0) {
              setRemoteItems(data.items);
            }
            if (Array.isArray(data.scenarios) && data.scenarios.length > 0) {
              const localSaved = localStorage.getItem(
                "gt_droid_saved_scenarios_v1"
              );
              const parsedLocal: SavedScenario[] = localSaved
                ? JSON.parse(localSaved)
                : [];
              const customOnly = parsedLocal.filter(
                (s) => !s.id.startsWith("preset-")
              );
              setSavedScenarios([...customOnly, ...data.scenarios]);
            }
            setDbSyncStatus("synced");
            setLastSyncedAt(
              new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            );
            return;
          }
        } catch {
          // Continue to next fallback URL
        }
      }

      setDbSyncStatus("fallback");
    },
    [githubDbUrl]
  );

  useEffect(() => {
    try {
      const savedVer = localStorage.getItem("gt_droid_ui_version");
      if (savedVer === "v1" || savedVer === "v2") {
        setUiVersion(savedVer);
      }
      const savedCustom = localStorage.getItem("gt_droid_custom_items_v1");
      if (savedCustom) setCustomItems(JSON.parse(savedCustom));
      const savedScen = localStorage.getItem("gt_droid_saved_scenarios_v1");
      if (savedScen) setSavedScenarios(JSON.parse(savedScen));
      const savedDbUrl = localStorage.getItem("gt_droid_github_db_url");
      if (savedDbUrl) setGithubDbUrl(savedDbUrl);
    } catch (e) {
      console.error(e);
    }
    syncFromGithubPages();
  }, [syncFromGithubPages]);

  const handleSwitchVersion = (ver: "v1" | "v2") => {
    setUiVersion(ver);
    setOpenModal(null);
    localStorage.setItem("gt_droid_ui_version", ver);
  };

  const allItems = useMemo(() => {
    const map = new Map<string, GTItemPreset>();
    remoteItems.forEach((item) => map.set(item.id, item));
    customItems.forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  }, [remoteItems, customItems]);

  const handleSelectItem = (item: GTItemPreset) => {
    setSelectedItemId(item.id);
    setItemName(item.name);
    setRarity(item.rarity);
    setIsFarmable(item.isFarmable);
    setHitsHand(item.hitsHand);
    setHitsPickaxe(item.hitsPickaxe);
    setSeedRateA(item.defaultSeedRatePerWL);
    setTargetSellRate(item.defaultBlockSellPerWL);
    if (item.recipe) {
      setSeedRateB(item.recipe.seedBRatePerWL);
    }
    if (item.id === "glowy_block") {
      setCostMode("two_stage_mass");
      setHarvestBuff("dcs");
      setTargetSellRate(6);
      setSeedBonusAction("replant");
    } else {
      setCostMode("single_seed");
    }
    setOpenModal(null);
  };

  const harvestResult = useMemo(
    () => calculateDroidHarvest(trees, rarity, isFarmable, harvestBuff),
    [trees, rarity, isFarmable, harvestBuff]
  );

  useEffect(() => {
    if (autoSyncBreakBlocks) {
      setBreakBlocksInput(harvestResult.blockDrops);
    }
  }, [harvestResult.blockDrops, autoSyncBreakBlocks]);

  const breakResult = useMemo(
    () =>
      calculateDroidBreak(
        breakBlocksInput,
        rarity,
        isFarmable,
        breakBonus,
        hitsHand,
        hitsPickaxe
      ),
    [breakBlocksInput, rarity, isFarmable, breakBonus, hitsHand, hitsPickaxe]
  );

  const totalNetSeedsAfterBreak =
    harvestResult.seedDrops + breakResult.totalSeedsWithExtra;
  const seedRetentionRatio =
    trees > 0 ? totalNetSeedsAfterBreak / trees : 0.84963;
  const requiredTreesForFullFarm =
    seedRetentionRatio > 0 ? Math.ceil(trees / seedRetentionRatio) : 3178;

  const profitAnalysis = useMemo(() => {
    const safeTrees = Math.max(1, trees);
    const safeGemsRate = 2000;

    let seedCostWL = 0;
    let costBreakdownText = "";

    if (costMode === "single_seed") {
      const rateA = Math.max(0.01, seedRateA);
      seedCostWL = safeTrees / rateA;
      costBreakdownText = `Beli ${safeTrees.toLocaleString("en-US")} ${itemName} Seed @ ${rateA}/1 WL = ${seedCostWL.toFixed(1)} WL`;
    } else if (costMode === "splice_two") {
      const rateA = Math.max(0.01, seedRateA);
      const rateB = Math.max(0.01, seedRateB);
      const costA = safeTrees / rateA;
      const costB = safeTrees / rateB;
      seedCostWL = costA + costB;
      costBreakdownText = `Splice ${safeTrees.toLocaleString("en-US")} Pohon: Bahan A (@ ${rateA}/1 = ${costA.toFixed(1)} WL) + Bahan B (@ ${rateB}/1 = ${costB.toFixed(1)} WL)`;
    } else {
      const treesNeededUpstream = Math.ceil(safeTrees / 0.84963);
      const costStage1 =
        treesNeededUpstream / Math.max(0.01, stage1A) +
        treesNeededUpstream / Math.max(0.01, stage1B);
      const costStage2 =
        stage2Mode === "buy_seed"
          ? safeTrees / Math.max(0.01, stage2DirectSeedRate)
          : treesNeededUpstream / Math.max(0.01, stage2RawA) +
            treesNeededUpstream / Math.max(0.01, stage2RawB);
      seedCostWL = costStage1 + costStage2;
      costBreakdownText = `Hulu 1 (${treesNeededUpstream.toLocaleString("en-US")} Pohon Cutaway = ${costStage1.toFixed(1)} WL) + Hulu 2 (Neon Lights = ${costStage2.toFixed(1)} WL)`;
    }

    const hogFuelWL =
      harvestBuff === "hog" ? harvestResult.hogFuelGems / safeGemsRate : 0;
    const totalModalWL = seedCostWL + hogFuelWL;

    const effectiveBlocks =
      seedBonusAction === "replant"
        ? harvestResult.replantedTotalBlocks
        : harvestResult.blockDrops;

    const effectiveSeedSellWL =
      seedBonusAction === "sell"
        ? harvestResult.seedDrops /
          Math.max(
            0.01,
            costMode === "single_seed"
              ? seedRateA
              : Math.max(1, targetSellRate / 2.5)
          )
        : 0;

    const gemsEarnedWL = harvestResult.gemDrops / safeGemsRate;
    const safeSellRate = Math.max(0.01, targetSellRate);
    const blockRevenueWL = effectiveBlocks / safeSellRate;
    const totalRevenueWL =
      blockRevenueWL + effectiveSeedSellWL + gemsEarnedWL;
    const netProfitWL = totalRevenueWL - totalModalWL;
    const roiPercent =
      totalModalWL > 0 ? (netProfitWL / totalModalWL) * 100 : 0;

    const netCostToCoverByBlocks = Math.max(
      0.01,
      totalModalWL - effectiveSeedSellWL - gemsEarnedWL
    );
    const breakEvenBlockPerWL = effectiveBlocks / netCostToCoverByBlocks;

    const standardRates = [200, 150, 120, 100, 80, 50, 25, 15, 10, 7, 6, 5];
    if (!standardRates.includes(targetSellRate) && targetSellRate > 0) {
      standardRates.push(targetSellRate);
      standardRates.sort((a, b) => b - a);
    }

    const simulationRows = standardRates.map((rate) => {
      const revBlock = effectiveBlocks / rate;
      const revTotal = revBlock + effectiveSeedSellWL + gemsEarnedWL;
      const net = revTotal - totalModalWL;
      return { rate, revBlock, revTotal, net, isProfit: net >= 0 };
    });

    return {
      seedCostWL,
      hogFuelWL,
      totalModalWL,
      costBreakdownText,
      effectiveBlocks,
      effectiveSeedSellWL,
      gemsEarnedWL,
      blockRevenueWL,
      totalRevenueWL,
      netProfitWL,
      roiPercent,
      breakEvenBlockPerWL,
      simulationRows,
    };
  }, [
    trees,
    costMode,
    seedRateA,
    seedRateB,
    itemName,
    stage1A,
    stage1B,
    stage2Mode,
    stage2DirectSeedRate,
    stage2RawA,
    stage2RawB,
    harvestBuff,
    harvestResult,
    seedBonusAction,
    targetSellRate,
  ]);

  const handleCopyHarvestDiscord = () => {
    const text = `**Drops from harvesting ${harvestResult.trees} ${itemName} Tree**
(${isFarmable ? "Farmable" : "Non-Farmable"}, rarity ${rarity})
👨‍🌾 **Buffs**
🪄 ${harvestResult.buffLabel}
🚜 **Drops**
• Gem drops: ${harvestResult.gemDrops.toLocaleString("en-US")}
• Block drops: ${harvestResult.blockDrops.toLocaleString("en-US")}
• Seed Drops: ${harvestResult.seedDrops.toLocaleString("en-US")}
• XP Earned: ${harvestResult.xpEarned.toLocaleString("en-US")}
🕒 **Estimated Harvesting Time**
• Using any tractor: ${harvestResult.timeTractorSec} sec
• By hand: ${harvestResult.timeHandSec} sec
• By Hand and Speedy: ${harvestResult.timeHandSpeedySec} sec
• With tractor and Speedy: ${harvestResult.timeTractorSpeedySec}`;
    navigator.clipboard.writeText(text);
    setCopiedHarvest(true);
    setTimeout(() => setCopiedHarvest(false), 2000);
  };

  const handleCopyBreakDiscord = () => {
    const text = `👊 **Breaking ${breakResult.blocks.toLocaleString("en-US")} ${itemName}.**
(${isFarmable ? "Farmable" : "Non-farmable"}, rarity ${rarity})
👊 **Bonuses**
☑️ ${breakResult.bonusLabel}
📦 **Drops**
• **Gem drops:** ${breakResult.gemDrops.toLocaleString("en-US")}
• **Block drops:** ${breakResult.blockDrops.toLocaleString("en-US")}
↳ ± ${breakResult.extraSeedsIfBroken.toLocaleString("en-US")} seeds if broken
• **Seed drops:** ${breakResult.seedDrops.toLocaleString("en-US")} *(Total with extra seeds ≈ ${breakResult.totalSeedsWithExtra.toLocaleString("en-US")})*
• **XP Earned:** ${breakResult.xpBase.toLocaleString("en-US")} *(Total with extra blocks broken: ${breakResult.xpTotalWithExtra.toLocaleString("en-US")})*
⏱️ **Estimated Breaking Time**
• ${formatDurationDroid(breakResult.timeHandSec)} *(without pickaxe)*`;
    navigator.clipboard.writeText(text);
    setCopiedBreak(true);
    setTimeout(() => setCopiedBreak(false), 2000);
  };

  const handleSaveCurrentScenario = () => {
    const newScen: SavedScenario = {
      id: `scen-${Date.now()}`,
      title: `${itemName} (${trees} Pohon • Jual ${targetSellRate}/1)`,
      itemName,
      rarity,
      isFarmable,
      trees,
      harvestBuff,
      costMode,
      seedRateA,
      seedNameA: `${itemName} Seed`,
      seedRateB,
      seedNameB: "Seed B",
      targetSellRate,
      seedBonusAction,
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [newScen, ...savedScenarios];
    setSavedScenarios(updated);
    localStorage.setItem("gt_droid_saved_scenarios_v1", JSON.stringify(updated));
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
  };

  const handleLoadScenario = (scen: SavedScenario) => {
    setItemName(scen.itemName);
    setRarity(scen.rarity);
    setIsFarmable(scen.isFarmable);
    setTrees(scen.trees);
    setHarvestBuff(scen.harvestBuff);
    setCostMode(scen.costMode);
    setSeedRateA(scen.seedRateA);
    setSeedRateB(scen.seedRateB);
    setTargetSellRate(scen.targetSellRate);
    setSeedBonusAction(scen.seedBonusAction);
    setOpenModal(null);
    if (uiVersion === "v1") setActiveTabV1("profit");
  };

  const handleDeleteScenario = (id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id);
    setSavedScenarios(updated);
    localStorage.setItem("gt_droid_saved_scenarios_v1", JSON.stringify(updated));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;
    const newItem: GTItemPreset = {
      id: `custom_${Date.now()}`,
      name: newCustomName.trim(),
      rarity: Math.max(1, newCustomRarity),
      isFarmable: newCustomFarmable,
      category: "Passive Vend / Low-Mid",
      hitsHand: 3,
      hitsPickaxe: 2,
      growTimeStr: "Custom",
      chi: "None",
      defaultSeedRatePerWL: Math.max(1, newCustomSeedRate),
      defaultBlockSellPerWL: Math.max(1, newCustomBlockRate),
      notes: "Item custom buatan lu.",
    };
    const updated = [...customItems, newItem];
    setCustomItems(updated);
    localStorage.setItem("gt_droid_custom_items_v1", JSON.stringify(updated));
    handleSelectItem(newItem);
    setNewCustomName("");
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
  };

  const handleDownloadDbJson = () => {
    const payload = {
      version: "2.0.0",
      lastUpdated: new Date().toISOString().split("T")[0],
      repository: "https://github.com/anonimjra/gt-droid-calculator",
      githubPagesDbUrl: githubDbUrl,
      items: allItems,
      scenarios: savedScenarios,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(payload, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "droid_db.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="min-h-screen pb-16 px-3 sm:px-6 pt-4 max-w-7xl mx-auto">
      {/* =====================================================================
          TOP GLOBAL BAR: SWITCHER VERSI 1 vs VERSI 2 + GITHUB DB STATUS
         ===================================================================== */}
      <div className="comic-card bg-[#111116] text-white px-4 py-2.5 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-extrabold uppercase text-[#ffde00] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> PILIH TAMPILAN UI:
          </span>
          <div className="inline-flex rounded-xl bg-[#232428] p-1 border-2 border-white/15 gap-1">
            <button
              onClick={() => handleSwitchVersion("v1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition ${
                uiVersion === "v1"
                  ? "bg-[#ffde00] text-[#111116]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Versi 1: Full Dashboard
            </button>
            <button
              onClick={() => handleSwitchVersion("v2")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition ${
                uiVersion === "v2"
                  ? "bg-[#00f0ff] text-[#111116]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              Versi 2: Compact Window
            </button>
          </div>
        </div>

        {/* GITHUB PAGES DB SYNC BADGE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModal("cloud_db")}
            className="px-3 py-1.5 rounded-lg bg-[#232428] hover:bg-[#2f3136] border border-white/20 text-xs font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dbSyncStatus === "synced"
                  ? "bg-[#06d6a0]"
                  : dbSyncStatus === "syncing"
                  ? "bg-[#ffde00] animate-ping"
                  : "bg-[#ff5500]"
              }`}
            />
            <Cloud className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>
              GitHub Pages DB ({allItems.length} Items){" "}
              {lastSyncedAt !== "-" ? `• ${lastSyncedAt}` : ""}
            </span>
          </button>
          <button
            onClick={() => syncFromGithubPages()}
            title="Refresh Database dari GitHub Pages"
            className="p-1.5 rounded-lg bg-[#06d6a0] text-[#111116] font-extrabold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          VERSI 2: COMPACT WINDOW MODE (1 KARTU RINGKAS + POPUP MODALS)
         ===================================================================== */}
      {uiVersion === "v2" && (
        <div className="flex flex-col items-center justify-center py-2">
          <main className="w-full max-w-2xl comic-card bg-white p-5 sm:p-7 space-y-5">
            {/* TOP TITLE + ITEM PICKER BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-3 border-[#111116]">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#111116] text-[#00f0ff] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase">
                  ⚡ VERSI 2 • COMPACT WINDOW EDITION
                </div>
                <h1 className="font-bangers text-3xl sm:text-4xl text-[#111116] leading-none mt-1">
                  KALKULATOR MASS &amp; PASIF INCOME
                </h1>
              </div>

              <button
                onClick={() => setOpenModal("items")}
                className="comic-btn bg-[#ffde00] px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center justify-between gap-2 cursor-pointer shrink-0"
              >
                <span>
                  🎯 {itemName}{" "}
                  <span className="bg-[#111116] text-white px-1.5 py-0.5 rounded text-xs ml-1">
                    R{rarity}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* 3 SIMPLE INPUT BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3 rounded-xl bg-[#fffcf0] border-2 border-[#111116]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold uppercase text-gray-700">
                    1. Jumlah Pohon
                  </label>
                  <button
                    onClick={() => setTrees(2700)}
                    className="text-[10px] font-extrabold bg-[#ffde00] px-1.5 py-0.2 rounded border border-[#111116] cursor-pointer"
                  >
                    2.700
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  value={trees}
                  onChange={(e) =>
                    setTrees(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="comic-input w-full px-3 py-2 rounded-lg text-base"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#fffcf0] border-2 border-[#111116]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold uppercase text-gray-700">
                    2. Harga Seed (/1 WL)
                  </label>
                  <button
                    onClick={() => setOpenModal("advanced_cost")}
                    className="text-[10px] font-extrabold bg-[#00f0ff] px-1.5 py-0.2 rounded border border-[#111116] cursor-pointer"
                  >
                    {costMode === "single_seed" ? "Mode Splice?" : "Mode Aktif"}
                  </button>
                </div>
                {costMode === "single_seed" ? (
                  <input
                    type="number"
                    min={0.1}
                    step="any"
                    value={seedRateA}
                    onChange={(e) =>
                      setSeedRateA(
                        Math.max(0.1, parseFloat(e.target.value) || 1)
                      )
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-base"
                  />
                ) : (
                  <button
                    onClick={() => setOpenModal("advanced_cost")}
                    className="comic-btn w-full bg-[#00f0ff] py-2 rounded-lg text-xs font-extrabold cursor-pointer"
                  >
                    ⚙️ Edit Resep Splice
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#fffcf0] border-2 border-[#111116]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold uppercase text-gray-700">
                    3. Jual Block (/1 WL)
                  </label>
                  <span className="text-[10px] font-extrabold text-gray-500">
                    Di Vend
                  </span>
                </div>
                <input
                  type="number"
                  min={0.1}
                  step="any"
                  value={targetSellRate}
                  onChange={(e) =>
                    setTargetSellRate(
                      Math.max(0.1, parseFloat(e.target.value) || 1)
                    )
                  }
                  className="comic-input w-full px-3 py-2 rounded-lg text-base"
                />
              </div>
            </div>

            {/* QUICK BUFF TOGGLE PILLS */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fff9db] px-3.5 py-2.5 rounded-xl border-2 border-[#111116] text-xs font-extrabold">
              <span>Alat Panen (HT):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "hog", label: "⚙️ HoG (Auto • 0 Gems)" },
                  { id: "dcs", label: "🪄 Dreamcatcher (+3%)" },
                  { id: "none", label: "✋ Polosan" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setHarvestBuff(b.id as HarvestBuffType)}
                    className={`px-2.5 py-1 rounded-lg border-2 border-[#111116] cursor-pointer ${
                      harvestBuff === b.id
                        ? "bg-[#111116] text-[#ffde00]"
                        : "bg-white text-[#111116]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CLEAN & SIMPLE RESULT VERDICT BOX */}
            <div
              className={`p-5 rounded-2xl border-3 border-[#111116] shadow-[5px_5px_0px_#111116] ${
                profitAnalysis.netProfitWL >= 0
                  ? "bg-[#d8f3dc]"
                  : "bg-[#ffccd5]"
              }`}
            >
              <div className="grid grid-cols-3 gap-3 text-center pb-4 border-b-2 border-[#111116]/20">
                <div className="bg-white p-3 rounded-xl border-2 border-[#111116]">
                  <div className="text-[11px] font-extrabold text-gray-500 uppercase">
                    Modal Lu
                  </div>
                  <div className="font-bangers text-2xl sm:text-3xl text-[#111116]">
                    {profitAnalysis.totalModalWL.toFixed(1)} WL
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border-2 border-[#111116]">
                  <div className="text-[11px] font-extrabold text-gray-500 uppercase">
                    Total Dapet
                  </div>
                  <div className="font-bangers text-2xl sm:text-3xl text-[#111116]">
                    {profitAnalysis.totalRevenueWL.toFixed(1)} WL
                  </div>
                </div>

                <div className="bg-[#111116] p-3 rounded-xl border-2 border-[#111116]">
                  <div className="text-[11px] font-extrabold text-gray-300 uppercase">
                    Untung Bersih
                  </div>
                  <div
                    className={`font-bangers text-2xl sm:text-3xl ${
                      profitAnalysis.netProfitWL >= 0
                        ? "text-[#06d6a0]"
                        : "text-[#ff1f4b]"
                    }`}
                  >
                    {profitAnalysis.netProfitWL >= 0 ? "+" : ""}
                    {profitAnalysis.netProfitWL.toFixed(1)} WL
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs sm:text-sm font-bold text-[#111116] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  📦 Panen:{" "}
                  <strong>
                    {harvestResult.blockDrops.toLocaleString("en-US")} Block
                  </strong>{" "}
                  + <strong>{harvestResult.seedDrops} Seed</strong>
                </div>
                <div className="bg-[#111116] text-[#ffde00] px-3 py-1 rounded-lg text-xs font-extrabold">
                  Batas Anti-Rugi: Jual Maks{" "}
                  {Math.floor(profitAnalysis.breakEvenBlockPerWL)}/1 WL
                </div>
              </div>
            </div>

            {/* POPUP WINDOW TRIGGER BUTTONS */}
            <div>
              <div className="text-xs font-extrabold uppercase text-gray-600 mb-2">
                👇 Klik Tombol Buat Buka Window Kecil:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => setOpenModal("harvest")}
                  className="comic-btn bg-[#00f0ff] p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Sprout className="w-5 h-5" />
                  <span>Window Harvest</span>
                  <span className="text-[10px] font-bold opacity-80">
                    (Droid Bot)
                  </span>
                </button>

                <button
                  onClick={() => setOpenModal("break")}
                  className="comic-btn bg-[#ff5500] text-white p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Hammer className="w-5 h-5" />
                  <span>Window Break</span>
                  <span className="text-[10px] font-bold opacity-90">
                    (Droid Bot)
                  </span>
                </button>

                <button
                  onClick={() => setOpenModal("vend_table")}
                  className="comic-btn bg-[#06d6a0] p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Table className="w-5 h-5" />
                  <span>Tabel Harga Vend</span>
                  <span className="text-[10px] font-bold opacity-80">
                    (200/1 - 5/1)
                  </span>
                </button>

                <button
                  onClick={() => setOpenModal("saved")}
                  className="comic-btn bg-[#ffde00] p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Preset &amp; Simpan</span>
                  <span className="text-[10px] font-bold opacity-80">
                    ({savedScenarios.length} Proyek)
                  </span>
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* =====================================================================
          VERSI 1: FULL DASHBOARD MODE (SEMUA PANEL & TAB LENGKAP)
         ===================================================================== */}
      {uiVersion === "v1" && (
        <div className="space-y-6">
          {/* HEADER BANNER V1 */}
          <header className="comic-card bg-[#ffde00] p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#111116] text-[#00f0ff] px-3 py-1 rounded-full text-xs font-extrabold uppercase mb-2">
                  🖥️ VERSI 1 • FULL DASHBOARD MODE
                </div>
                <h1 className="font-bangers text-3xl sm:text-5xl text-[#111116] tracking-wide leading-none">
                  ⚡ DROID BOT &amp; VEND PROFIT ANALYZER ⚡
                </h1>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTabV1("droid")}
                  className={`comic-btn px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 cursor-pointer ${
                    activeTabV1 === "droid"
                      ? "bg-[#111116] text-[#00f0ff]"
                      : "bg-white text-[#111116]"
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  1. DROID BOT (/harvest &amp; /break)
                </button>
                <button
                  onClick={() => setActiveTabV1("profit")}
                  className={`comic-btn px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 cursor-pointer ${
                    activeTabV1 === "profit"
                      ? "bg-[#ff5500] text-white"
                      : "bg-white text-[#111116]"
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  2. HITUNG PROFIT &amp; VEND
                </button>
                <button
                  onClick={() => setActiveTabV1("database")}
                  className={`comic-btn px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 cursor-pointer ${
                    activeTabV1 === "database"
                      ? "bg-[#06d6a0] text-[#111116]"
                      : "bg-white text-[#111116]"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  3. PRESET &amp; CLOUD DB ({savedScenarios.length})
                </button>
              </div>
            </div>

            {/* QUICK ITEM BAR V1 */}
            <div className="mt-4 pt-4 border-t-3 border-[#111116] flex flex-wrap gap-2">
              {allItems.map((item) => {
                const active =
                  selectedItemId === item.id && itemName === item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`comic-btn px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                      active ? "bg-[#00f0ff] text-[#111116]" : "bg-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="bg-[#111116] text-[#ffde00] px-1.5 py-0.2 rounded text-[10px]">
                      R{item.rarity}
                    </span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* V1 TAB 1: DROID HARVEST & BREAK SIDE-BY-SIDE */}
          {activeTabV1 === "droid" && (
            <div className="space-y-6">
              <div className="comic-card p-4 bg-white grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Nama Item
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Rarity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rarity}
                    onChange={(e) =>
                      setRarity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Jumlah Pohon
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={trees}
                    onChange={(e) =>
                      setTrees(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Alat Panen (Buff)
                  </label>
                  <select
                    value={harvestBuff}
                    onChange={(e) =>
                      setHarvestBuff(e.target.value as HarvestBuffType)
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  >
                    <option value="hog">Heart of Gaia (HoG • 0 Gems)</option>
                    <option value="dcs">Dreamcatcher Staff (+3% Block)</option>
                    <option value="none">Polosan (Tanpa Buff)</option>
                    <option value="harvester_fuel">
                      Harvester + Fuel Pack (+10%)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* HARVEST CARD */}
                <div className="comic-card p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#111116] pb-2">
                    <h2 className="font-bangers text-2xl">
                      🚜 DROID HARVEST (/harvest)
                    </h2>
                    <button
                      onClick={handleCopyHarvestDiscord}
                      className="comic-btn bg-[#ffde00] px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                    >
                      {copiedHarvest ? "Copied!" : "Copy Discord"}
                    </button>
                  </div>
                  <div className="droid-embed p-4">
                    <h3 className="text-white font-bold text-base mb-1">
                      Drops from harvesting {harvestResult.trees} {itemName}{" "}
                      Tree
                    </h3>
                    <p className="text-[#dbdee1] text-xs mb-3">
                      ({isFarmable ? "Farmable" : "Non-Farmable"}, rarity{" "}
                      {harvestResult.rarity})
                    </p>
                    <div className="mb-2.5 text-xs">
                      <div className="font-bold text-white">👨‍🌾 Buffs</div>
                      <div className="text-[#dbdee1]">
                        🪄 {harvestResult.buffLabel}
                      </div>
                    </div>
                    <div className="mb-2.5 text-xs">
                      <div className="font-bold text-white mb-0.5">🚜 Drops</div>
                      <ul className="space-y-0.5">
                        <li>
                          <span className="text-[#ff1f4b]">•</span> Gem drops:{" "}
                          <strong className="text-white">
                            {harvestResult.gemDrops.toLocaleString("en-US")}
                          </strong>
                        </li>
                        <li>
                          <span className="text-[#ff1f4b]">•</span> Block drops:{" "}
                          <strong className="text-[#00f0ff]">
                            {harvestResult.blockDrops.toLocaleString("en-US")}
                          </strong>
                        </li>
                        <li>
                          <span className="text-[#ff1f4b]">•</span> Seed Drops:{" "}
                          <strong className="text-[#06d6a0]">
                            {harvestResult.seedDrops.toLocaleString("en-US")}
                          </strong>
                        </li>
                        <li>
                          <span className="text-[#ff1f4b]">•</span> XP Earned:{" "}
                          <strong className="text-white">
                            {harvestResult.xpEarned.toLocaleString("en-US")}
                          </strong>
                        </li>
                      </ul>
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white mb-0.5">
                        🕒 Estimated Harvesting Time
                      </div>
                      <ul className="space-y-0.5">
                        <li>
                          • Using any tractor: {harvestResult.timeTractorSec}{" "}
                          sec
                        </li>
                        <li>
                          • By hand:{" "}
                          {harvestResult.timeHandSec.toLocaleString("en-US")}{" "}
                          sec
                        </li>
                        <li>
                          • By Hand and Speedy:{" "}
                          {harvestResult.timeHandSpeedySec.toLocaleString(
                            "en-US"
                          )}{" "}
                          sec
                        </li>
                        <li>
                          • With tractor and Speedy:{" "}
                          {harvestResult.timeTractorSpeedySec}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* BREAK CARD */}
                <div className="comic-card p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#111116] pb-2">
                    <h2 className="font-bangers text-2xl">
                      👊 DROID BREAK (/break)
                    </h2>
                    <button
                      onClick={handleCopyBreakDiscord}
                      className="comic-btn bg-[#ffde00] px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                    >
                      {copiedBreak ? "Copied!" : "Copy Discord"}
                    </button>
                  </div>
                  <div className="droid-embed p-4 text-xs">
                    <h3 className="text-white font-bold text-base mb-1">
                      👊 Breaking {breakResult.blocks.toLocaleString("en-US")}{" "}
                      {itemName}.
                    </h3>
                    <p className="text-[#dbdee1] mb-2.5">
                      ({isFarmable ? "Farmable" : "Non-farmable"}, rarity{" "}
                      {breakResult.rarity})
                    </p>
                    <div className="mb-2.5">
                      <div className="font-bold text-white">👊 Bonuses</div>
                      <div className="text-[#dbdee1]">
                        ☑️ {breakResult.bonusLabel}
                      </div>
                    </div>
                    <div className="mb-2.5">
                      <div className="font-bold text-white mb-0.5">📦 Drops</div>
                      <ul className="space-y-0.5">
                        <li>
                          • <strong className="text-white">Gem drops:</strong>{" "}
                          {breakResult.gemDrops.toLocaleString("en-US")}
                        </li>
                        <li>
                          • <strong className="text-white">Block drops:</strong>{" "}
                          {breakResult.blockDrops.toLocaleString("en-US")}
                        </li>
                        <li className="pl-3">
                          ↳ ±{" "}
                          {breakResult.extraSeedsIfBroken.toLocaleString(
                            "en-US"
                          )}{" "}
                          seeds if broken
                        </li>
                        <li>
                          • <strong className="text-white">Seed drops:</strong>{" "}
                          {breakResult.seedDrops.toLocaleString("en-US")}{" "}
                          <em>
                            (Total with extra seeds ≈{" "}
                            <strong className="text-[#06d6a0]">
                              {breakResult.totalSeedsWithExtra.toLocaleString(
                                "en-US"
                              )}
                            </strong>
                            )
                          </em>
                        </li>
                        <li>
                          • <strong className="text-white">XP Earned:</strong>{" "}
                          {breakResult.xpBase.toLocaleString("en-US")}{" "}
                          <em>
                            (Total:{" "}
                            {breakResult.xpTotalWithExtra.toLocaleString(
                              "en-US"
                            )}
                            )
                          </em>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-0.5">
                        ⏱️ Estimated Breaking Time
                      </div>
                      <ul className="space-y-0.5">
                        <li>
                          • {formatDurationDroid(breakResult.timeHandSec)}{" "}
                          (without pickaxe)
                        </li>
                        <li className="text-[#06d6a0]">
                          • {formatDurationDroid(breakResult.timePickaxeSec)}{" "}
                          (with Pickaxe)
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#e0fbfc] border-2 border-[#111116] text-xs font-bold">
                    🌟 Total Net Seed (Harvest + Break):{" "}
                    <strong>
                      {totalNetSeedsAfterBreak.toLocaleString("en-US")} Seeds
                    </strong>{" "}
                    (Butuh{" "}
                    <strong>
                      {requiredTreesForFullFarm.toLocaleString("en-US")} pohon
                    </strong>{" "}
                    untuk dapat pas {trees} seed).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* V1 TAB 2: FULL PROFIT & VEND TABLE */}
          {activeTabV1 === "profit" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 comic-card p-5 bg-white space-y-4">
                <h2 className="font-bangers text-2xl border-b-2 border-[#111116] pb-2">
                  ⚙️ SETTING MODAL &amp; HARGA JUAL
                </h2>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Harga Beli {itemName} Seed (/1 WL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={seedRateA}
                    onChange={(e) =>
                      setSeedRateA(
                        Math.max(0.1, parseFloat(e.target.value) || 1)
                      )
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    Target Jual Block di Vend (/1 WL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={targetSellRate}
                    onChange={(e) =>
                      setTargetSellRate(
                        Math.max(0.1, parseFloat(e.target.value) || 1)
                      )
                    }
                    className="comic-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={handleSaveCurrentScenario}
                  className="comic-btn w-full bg-[#06d6a0] py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
                >
                  💾 Simpan Skenario Ini
                </button>
              </div>

              <div className="lg:col-span-7 comic-card p-5 bg-white space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#111116] pb-2">
                  <h2 className="font-bangers text-2xl">
                    📊 SIMULASI UNTUNG / RUGI DI VEND
                  </h2>
                  <span className="bg-[#111116] text-[#ffde00] px-3 py-1 rounded-lg text-xs font-extrabold">
                    Modal: {profitAnalysis.totalModalWL.toFixed(1)} WL
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#111116] text-white font-extrabold">
                        <th className="p-2.5">Harga Vend</th>
                        <th className="p-2.5">Dapet dari Block</th>
                        <th className="p-2.5">Total Dapet</th>
                        <th className="p-2.5 text-right">Untung Bersih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111116]/20 font-bold">
                      {profitAnalysis.simulationRows.map((row) => (
                        <tr
                          key={row.rate}
                          onClick={() => setTargetSellRate(row.rate)}
                          className={`cursor-pointer ${
                            row.rate === targetSellRate
                              ? "bg-[#00f0ff]/40"
                              : "hover:bg-[#fff9db]"
                          }`}
                        >
                          <td className="p-2.5 font-extrabold">
                            {row.rate} / 1 WL
                          </td>
                          <td className="p-2.5">
                            {row.revBlock.toFixed(1)} WL
                          </td>
                          <td className="p-2.5">
                            {row.revTotal.toFixed(1)} WL
                          </td>
                          <td className="p-2.5 text-right">
                            <span
                              className={`px-2.5 py-0.5 rounded border border-[#111116] font-extrabold ${
                                row.isProfit
                                  ? "bg-[#06d6a0] text-[#111116]"
                                  : "bg-[#ff1f4b] text-white"
                              }`}
                            >
                              {row.net >= 0 ? "+" : ""}
                              {row.net.toFixed(1)} WL
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* V1 TAB 3: DATABASE & CLOUD SYNC */}
          {activeTabV1 === "database" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="comic-card p-5 bg-white space-y-3">
                <h2 className="font-bangers text-2xl">
                  💾 SKENARIO TERSIMPAN ({savedScenarios.length})
                </h2>
                {savedScenarios.map((scen) => (
                  <div
                    key={scen.id}
                    className="p-3 rounded-xl bg-[#fff9db] border-2 border-[#111116] flex items-center justify-between gap-2"
                  >
                    <div className="text-xs font-extrabold">{scen.title}</div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleLoadScenario(scen)}
                        className="comic-btn bg-[#00f0ff] px-2.5 py-1 rounded text-xs font-extrabold cursor-pointer"
                      >
                        Pakai
                      </button>
                      {!scen.id.startsWith("preset-") && (
                        <button
                          onClick={() => handleDeleteScenario(scen.id)}
                          className="comic-btn bg-[#ff1f4b] text-white p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="comic-card p-5 bg-white space-y-3">
                <h2 className="font-bangers text-2xl">
                  ☁️ GITHUB PAGES DATABASE ➔ VERCEL LIVE
                </h2>
                <p className="text-xs font-bold text-gray-700">
                  Website di Vercel otomatis mengambil data item &amp; preset
                  terbaru dari file <code>droid_db.json</code> di GitHub Pages
                  lu.
                </p>
                <input
                  type="text"
                  value={githubDbUrl}
                  onChange={(e) => {
                    setGithubDbUrl(e.target.value);
                    localStorage.setItem(
                      "gt_droid_github_db_url",
                      e.target.value
                    );
                  }}
                  className="comic-input w-full px-3 py-2 rounded-lg text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => syncFromGithubPages()}
                    className="comic-btn bg-[#00f0ff] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tarik Data GitHub
                  </button>
                  <button
                    onClick={handleDownloadDbJson}
                    className="comic-btn bg-[#ffde00] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download droid_db.json
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SMALL POPUP WINDOWS (MODALS)
         ===================================================================== */}
      {openModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="w-full max-w-md comic-card bg-white p-5 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenModal(null)}
              className="comic-btn bg-[#ff1f4b] text-white p-1.5 rounded-lg absolute top-4 right-4 cursor-pointer"
              title="Tutup Window"
            >
              <X className="w-4 h-4" />
            </button>

            {/* CLOUD DB MODAL */}
            {openModal === "cloud_db" && (
              <div className="space-y-3">
                <h2 className="font-bangers text-2xl pr-8">
                  ☁️ GITHUB PAGES DB ➔ VERCEL SYNC
                </h2>
                <p className="text-xs font-bold text-gray-700">
                  Database item &amp; preset di-host di GitHub Pages dan
                  di-fetch otomatis oleh web live di Vercel:
                </p>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase mb-1">
                    URL Database GitHub Pages (droid_db.json)
                  </label>
                  <input
                    type="text"
                    value={githubDbUrl}
                    onChange={(e) => {
                      setGithubDbUrl(e.target.value);
                      localStorage.setItem(
                        "gt_droid_github_db_url",
                        e.target.value
                      );
                    }}
                    className="comic-input w-full px-2.5 py-1.5 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => syncFromGithubPages()}
                    className="comic-btn bg-[#00f0ff] py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Sekarang
                  </button>
                  <button
                    onClick={handleDownloadDbJson}
                    className="comic-btn bg-[#ffde00] py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export droid_db.json
                  </button>
                </div>
              </div>
            )}

            {/* ITEMS MODAL */}
            {openModal === "items" && (
              <div className="space-y-4">
                <h2 className="font-bangers text-2xl pr-8">
                  🎯 PILIH ITEM GROWTOPIA
                </h2>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {allItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-2.5 rounded-xl border-2 border-[#111116] text-left font-extrabold text-xs flex items-center justify-between cursor-pointer ${
                        itemName === item.name
                          ? "bg-[#00f0ff]"
                          : "bg-[#fffcf0] hover:bg-[#ffde00]"
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="bg-[#111116] text-[#ffde00] px-1.5 py-0.5 rounded text-[10px] shrink-0 ml-1">
                        R{item.rarity}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-[#111116] space-y-2">
                  <div className="text-xs font-extrabold uppercase">
                    Tambah Item Baru:
                  </div>
                  <form onSubmit={handleAddCustomItem} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Nama Item..."
                        value={newCustomName}
                        onChange={(e) => setNewCustomName(e.target.value)}
                        className="comic-input col-span-2 px-2.5 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        min={1}
                        max={999}
                        placeholder="Rarity"
                        value={newCustomRarity}
                        onChange={(e) =>
                          setNewCustomRarity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="comic-input px-2.5 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="Seed /1 WL"
                        value={newCustomSeedRate}
                        onChange={(e) =>
                          setNewCustomSeedRate(
                            Math.max(0.1, parseFloat(e.target.value) || 100)
                          )
                        }
                        className="comic-input px-2.5 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Jual /1 WL"
                        value={newCustomBlockRate}
                        onChange={(e) =>
                          setNewCustomBlockRate(
                            Math.max(0.1, parseFloat(e.target.value) || 100)
                          )
                        }
                        className="comic-input px-2.5 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="comic-btn w-full bg-[#06d6a0] py-2 rounded-lg text-xs font-extrabold cursor-pointer"
                    >
                      + Simpan &amp; Pakai Item Ini
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* HARVEST MODAL */}
            {openModal === "harvest" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pr-10">
                  <h2 className="font-bangers text-2xl">
                    🚜 DROID HARVEST CARD
                  </h2>
                  <button
                    onClick={handleCopyHarvestDiscord}
                    className="comic-btn bg-[#ffde00] px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHarvest ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="droid-embed p-4">
                  <h3 className="text-white font-bold text-base mb-1">
                    Drops from harvesting {harvestResult.trees} {itemName} Tree
                  </h3>
                  <p className="text-[#dbdee1] text-xs mb-3">
                    ({isFarmable ? "Farmable" : "Non-Farmable"}, rarity{" "}
                    {harvestResult.rarity})
                  </p>
                  <div className="mb-2.5 text-xs">
                    <div className="font-bold text-white">👨‍🌾 Buffs</div>
                    <div className="text-[#dbdee1]">
                      🪄 {harvestResult.buffLabel}
                    </div>
                  </div>
                  <div className="mb-2.5 text-xs">
                    <div className="font-bold text-white mb-0.5">🚜 Drops</div>
                    <ul className="space-y-0.5">
                      <li>
                        <span className="text-[#ff1f4b]">•</span> Gem drops:{" "}
                        <strong className="text-white">
                          {harvestResult.gemDrops.toLocaleString("en-US")}
                        </strong>
                      </li>
                      <li>
                        <span className="text-[#ff1f4b]">•</span> Block drops:{" "}
                        <strong className="text-[#00f0ff]">
                          {harvestResult.blockDrops.toLocaleString("en-US")}
                        </strong>
                      </li>
                      <li>
                        <span className="text-[#ff1f4b]">•</span> Seed Drops:{" "}
                        <strong className="text-[#06d6a0]">
                          {harvestResult.seedDrops.toLocaleString("en-US")}
                        </strong>
                      </li>
                      <li>
                        <span className="text-[#ff1f4b]">•</span> XP Earned:{" "}
                        <strong className="text-white">
                          {harvestResult.xpEarned.toLocaleString("en-US")}
                        </strong>
                      </li>
                    </ul>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white mb-0.5">
                      🕒 Estimated Harvesting Time
                    </div>
                    <ul className="space-y-0.5">
                      <li>
                        • Using any tractor: {harvestResult.timeTractorSec} sec
                      </li>
                      <li>
                        • By hand:{" "}
                        {harvestResult.timeHandSec.toLocaleString("en-US")} sec
                      </li>
                      <li>
                        • By Hand and Speedy:{" "}
                        {harvestResult.timeHandSpeedySec.toLocaleString("en-US")}{" "}
                        sec
                      </li>
                      <li>
                        • With tractor and Speedy:{" "}
                        {harvestResult.timeTractorSpeedySec}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* BREAK MODAL */}
            {openModal === "break" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pr-10">
                  <h2 className="font-bangers text-2xl">👊 DROID BREAK CARD</h2>
                  <button
                    onClick={handleCopyBreakDiscord}
                    className="comic-btn bg-[#ffde00] px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBreak ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase mb-1">
                      Jumlah Block
                    </label>
                    <input
                      type="number"
                      value={breakBlocksInput}
                      onChange={(e) => {
                        setAutoSyncBreakBlocks(false);
                        setBreakBlocksInput(
                          Math.max(1, parseInt(e.target.value) || 1)
                        );
                      }}
                      className="comic-input w-full px-2.5 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase mb-1">
                      Bonus Break
                    </label>
                    <select
                      value={breakBonus}
                      onChange={(e) =>
                        setBreakBonus(e.target.value as BreakBonusType)
                      }
                      className="comic-input w-full px-2 py-1.5 rounded-lg text-xs"
                    >
                      <option value="ances_1">Blue Ances Lv.1 (+5%)</option>
                      <option value="ances_2">Blue Ances Lv.2 (+6.2%)</option>
                      <option value="ances_6">Blue Ances Lv.6 (+11%)</option>
                      <option value="tm">TM Auto-Break (0 Gems)</option>
                      <option value="none">Tanpa Bonus</option>
                    </select>
                  </div>
                </div>

                <div className="droid-embed p-4 text-xs">
                  <h3 className="text-white font-bold text-base mb-1">
                    👊 Breaking {breakResult.blocks.toLocaleString("en-US")}{" "}
                    {itemName}.
                  </h3>
                  <p className="text-[#dbdee1] mb-2.5">
                    ({isFarmable ? "Farmable" : "Non-farmable"}, rarity{" "}
                    {breakResult.rarity})
                  </p>
                  <div className="mb-2.5">
                    <div className="font-bold text-white">👊 Bonuses</div>
                    <div className="text-[#dbdee1]">
                      ☑️ {breakResult.bonusLabel}
                    </div>
                  </div>
                  <div className="mb-2.5">
                    <div className="font-bold text-white mb-0.5">📦 Drops</div>
                    <ul className="space-y-0.5">
                      <li>
                        • <strong className="text-white">Gem drops:</strong>{" "}
                        {breakResult.gemDrops.toLocaleString("en-US")}
                      </li>
                      <li>
                        • <strong className="text-white">Block drops:</strong>{" "}
                        {breakResult.blockDrops.toLocaleString("en-US")}
                      </li>
                      <li className="pl-3">
                        ↳ ±{" "}
                        {breakResult.extraSeedsIfBroken.toLocaleString("en-US")}{" "}
                        seeds if broken
                      </li>
                      <li>
                        • <strong className="text-white">Seed drops:</strong>{" "}
                        {breakResult.seedDrops.toLocaleString("en-US")}{" "}
                        <em>
                          (Total ≈{" "}
                          <strong className="text-[#06d6a0]">
                            {breakResult.totalSeedsWithExtra.toLocaleString(
                              "en-US"
                            )}
                          </strong>
                          )
                        </em>
                      </li>
                      <li>
                        • <strong className="text-white">XP Earned:</strong>{" "}
                        {breakResult.xpBase.toLocaleString("en-US")}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-white mb-0.5">
                      ⏱️ Estimated Breaking Time
                    </div>
                    <ul className="space-y-0.5">
                      <li>
                        • {formatDurationDroid(breakResult.timeHandSec)} (without
                        pickaxe)
                      </li>
                      <li className="text-[#06d6a0]">
                        • {formatDurationDroid(breakResult.timePickaxeSec)}{" "}
                        (with Pickaxe)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* VEND TABLE MODAL */}
            {openModal === "vend_table" && (
              <div className="space-y-3">
                <h2 className="font-bangers text-2xl pr-8">
                  📊 TABEL HARGA JUAL VEND ({itemName})
                </h2>
                <div className="max-h-72 overflow-y-auto border-2 border-[#111116] rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#111116] text-white font-extrabold">
                        <th className="p-2">Harga Vend</th>
                        <th className="p-2">Total Dapet</th>
                        <th className="p-2 text-right">Untung Bersih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111116]/20 font-bold">
                      {profitAnalysis.simulationRows.map((row) => (
                        <tr
                          key={row.rate}
                          onClick={() => {
                            setTargetSellRate(row.rate);
                            setOpenModal(null);
                          }}
                          className={`cursor-pointer ${
                            row.rate === targetSellRate
                              ? "bg-[#00f0ff]/40"
                              : "hover:bg-[#fff9db]"
                          }`}
                        >
                          <td className="p-2 font-extrabold">
                            {row.rate} / 1 WL
                          </td>
                          <td className="p-2">{row.revTotal.toFixed(1)} WL</td>
                          <td className="p-2 text-right">
                            <span
                              className={`px-2 py-0.5 rounded border border-[#111116] font-extrabold ${
                                row.isProfit
                                  ? "bg-[#06d6a0] text-[#111116]"
                                  : "bg-[#ff1f4b] text-white"
                              }`}
                            >
                              {row.net >= 0 ? "+" : ""}
                              {row.net.toFixed(1)} WL
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ADVANCED COST MODAL */}
            {openModal === "advanced_cost" && (
              <div className="space-y-3">
                <h2 className="font-bangers text-2xl pr-8">
                  🧬 PILIH MODE MODAL SEED
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      id: "single_seed",
                      label: "1. Beli 1 Seed Langsung (Tanam ➔ Jual Block)",
                    },
                    {
                      id: "splice_two",
                      label: "2. Splice 2 Seed Bahan (Splice ➔ Jual Block)",
                    },
                    {
                      id: "two_stage_mass",
                      label: "3. Massing 2 Tahap (Khusus Glowy Block)",
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setCostMode(m.id as typeof costMode)}
                      className={`w-full p-2.5 rounded-xl border-2 border-[#111116] text-left text-xs font-extrabold cursor-pointer ${
                        costMode === m.id ? "bg-[#ffde00]" : "bg-[#fffcf0]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setOpenModal(null)}
                  className="comic-btn w-full bg-[#06d6a0] py-2 rounded-xl text-xs font-extrabold cursor-pointer mt-2"
                >
                  Selesai &amp; Terapkan
                </button>
              </div>
            )}

            {/* SAVED SCENARIOS MODAL */}
            {openModal === "saved" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pr-10">
                  <h2 className="font-bangers text-2xl">
                    💾 PRESET &amp; PROYEK LU
                  </h2>
                  <button
                    onClick={handleSaveCurrentScenario}
                    className="comic-btn bg-[#06d6a0] px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
                  >
                    + Simpan Ini
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {savedScenarios.map((scen) => (
                    <div
                      key={scen.id}
                      onClick={() => handleLoadScenario(scen)}
                      className="p-3 rounded-xl bg-[#fff9db] hover:bg-[#ffde00] border-2 border-[#111116] flex items-center justify-between gap-2 cursor-pointer transition"
                    >
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm">
                          {scen.title}
                        </div>
                        <div className="text-[11px] font-bold text-gray-700">
                          {scen.trees} Pohon • Buff:{" "}
                          {scen.harvestBuff.toUpperCase()} • Jual{" "}
                          {scen.targetSellRate}/1 WL
                        </div>
                      </div>
                      <span className="bg-[#111116] text-[#00f0ff] px-2 py-1 rounded text-[10px] font-extrabold shrink-0">
                        Pakai
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
