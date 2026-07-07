export const debug = true

export const dependencyList = [
    "MQTT",
    "ZConfig",
    "ZCore",
    "ZKeys",
    "ZLore",
    "ZRenderLib",
    "ZRequest",
    "ZUrsaProxy",
]

export const rarePetList = [
    "COMMON_SKELETON_HORSE",
    "COMMON_SNOWMAN",
]

export const miscCollectableTypeList = [
    ["Midas Weapons", "midas", false],
    ["OG Salmon", "ogSalmon", true],
    ["Null Boots", "nullBoots", false],
    ["Dyed Null Boots", "dyedNullBoots", false],
    ["Ember Rod", "emberRod", false],
    ["Horse Armor", "horseArmor", false],
    ["Hyperclean Dungeon Items", "hypercleanDungeonItems", true],
    ["Ghost Recombed Items", "ghostRecombedItems", false],
    ["Frostwalker Enchant", "frostWalker", false],
    ["French Bread", "frenchBread", true],
    ["Bag Of Cash", "bagOfCash", true],
    ["Enrager", "enrager", true],
    ["Legacy God Potion", "legacyGodPotion", false],
    ["Repelling Candles", "repellingCandle", true],
    ["Gemstone", "gemstone", false],
    ["2020 Crab Hats", "2020CrabHats", true],
    ["2019 Salmon Hats", "2019SalmonHats", true],
    ["Splash Dungeon Potions", "splashDungeonPotions", true],
    ["Monster Spawn Eggs", "spawnEggs", false],
    ["Rare Nulls", "rareNulls", false],
    ["Mob Skulls", "mobSkulls", false],
    ["Loreless Blindness Potions", "lorelessBlindnessPotions", true],
    ["Mystery & Unknown Pets", "mysteryPets", true],
    ["Ember Ash Armor & Silex", "emberAshArmor", false],
    ["Garden Space Helmets", "gardenSpaceHelmets", true],
    ["Rift Ancient Elevators", "riftAncientElevators", true],
    ["Spawned For Dragon Fragments", "spawnedForDragonFragments", true],
    ["Empty Map", "emptyMap", true],
    ["Blaze Hat", "blazeHat", false],
    ["Stat Boosted Items", "statBoostedItems", true],
    ["Extra Large Gemstone Sack", "extraLargeGemstoneSack", false],
    ["Power Scrolled Items", "scrolledItems", true],
    ["Admin Spawned Tag", "adminSpawnedTag", true],
    ["Item Stash Tag", "itemStashTag", false],
    ["Damaged Pickonimbus'", "damagedPickonimbus", false],
    ["Smite 7 Books", "smite7Books", true],
    ["Potatoes & Carrots", "potatoesAndCarrots", false],
    ["Invalid Runes", "invalidRunes", true],
    ["Mathematical Hoes", "mathematicalHoes", false],
    ["Legacy Farming For Dummies", "legacyFarmingForDummies", false],
    ["Wrong Year Anniversary Hats", "wrongYearAnniversaryHats", true],
    ["Raffle Items", "raffleItems", true],
    ["Other Soulbound Null Items", "soulboundNullItems", false],
    ["Shen Items", "shenItems", false],
]
const miscCollectableTypeToNameMap = {}
;(function() {
    miscCollectableTypeList.forEach((collectableData, index) => {
        let name = collectableData[0]
        let varName = collectableData[1]
        let varNameU = varName.toLowerCase()
        miscCollectableTypeToNameMap[varName] = name
        miscCollectableTypeToNameMap[varNameU] = name
    })
})()
export const GetMiscCollectableName = (varName) => {
    return miscCollectableTypeToNameMap[varName] ?? "ERROR"
}

export const miscCollectableLoreTypeList = [
    ["Hyperclean Dungeon Items", "hypercleanDungeonItems", true],
    ["Ghost Recombed Items", "ghostRecombedItems", true],
    ["Frostwalker Enchant", "frostWalker", true],
    ["Spawned For Dragon Fragments", "spawnedForDragonFragments", true],
    ["Stat Boosted Items", "statBoostedItems", true],
    ["Admin Spawned Tag", "adminSpawnedTag", true],
    ["Item Stash Tag", "itemStashTag", true],
    ["Invalid Runes", "invalidRunes", true],
    ["Legacy Farming For Dummies", "legacyFarmingForDummies", true],
]

export const frostWalkerEnchantID = "frost_walker"

export const bleachedHex = "A06540"

export const oldProfileCutoffStringList = [
    "§6Exotics §7- §7(§bNov. 18th 2019§7)",
    "§bOG Fairy §7- §7(§bSep. 30th 2020§7)",
    "§9Legacy §7- §7(§bDec. 31st 2020§7)",
    "§dFairy§7/§fCrystal §7- §7(§bMay. 31st 2021§7)",
]
export const oldProfileCutoffTimestampList = [
    1574121600000, // Exotics
    1601510400000, // OG Fairy
    1609459200000, // Legacy
    1622505600000, // Fairy/Crystal
]
export const museumScanningTypeList = [
    "§cDisabled",
    "§6Old Profiles",
    "§aAll Profiles",
]

// these are items that are always soulbound
export const ignoreditemIDs = [
    "END_HELMET",
    "END_CHESTPLATE",
    "END_LEGGINGS",
    "END_BOOTS",
    "ROGUE_SWORD",
    "HUNTER_KNIFE",
]

export const allAnniversaryHats = {
    "PARTY_HAT_CRAB": 2020,
    "PARTY_HAT_CRAB_ANIMATED": 2022,
    "PARTY_HAT_SLOTH": 2023,
    "BALLOON_HAT_2024": 2024,
    "BALLOON_HAT_2025": 2025,
}

export const invalidYearTimestamps = {
    2020: 1609477200000,
    2021: 1641013200000,
    2022: 1672549200000,
    2023: 1704085200000,
    2024: 1735707600000,
    2025: 1767243600000,
    2026: 1798779600000,
    2027: 1830315600000,
}

export const raffleTierNames = {
    "small": "Speed",
    "speed": "Speed",
    "medium": "Daily",
    "daily": "Daily",
    "large": "Big One",
    "big one": "Big One",
    "the big one": "Big One",
}

export const raffleItemIDBlacklist = [
    // Minor
    "SLICE_OF_STRAWBERRY_SHORTCAKE",
    "SLICE_OF_GREEN_VELVET_CAKE",
    "SLICE_OF_CHEESECAKE",
    "SLICE_OF_BLUEBERRY_CAKE",
    "SLICE_OF_RED_VELVET_CAKE",
    "EPOCH_CAKE_MAGENTA",
    "WITCH_TALISMAN",
    "WITCH_RING",
    "WITCH_ARTIFACT",
    "WHITE_GIFT_TALISMAN",
    "EPOCH_CAKE_DARK_GREEN",
    "UNCOMMON_PARTY_HAT",
    "UMBER_KEY",
    "TUNGSTEN_KEY",
    "TREASURE_TALISMAN",
    "TREASURE_RING",
    "TREASURE_ARTIFACT",
    "TITANIC_EXP_BOTTLE",
    "SUMMONING_EYE",
    "EPOCH_CAKE_PURPLE",
    "EPOCH_CAKE_STARBORN",
    "EPOCH_CAKE_BLUE",
    "SALMON_HAT_CELEBRATION",
    "RUNEBOOK",
    "RNG_JUICE",
    "PUFFERFISH_HAT_CELEBRATION",
    "EPOCH_CAKE_YELLOW",
    "EPOCH_CAKE_GREEN",
    "PAINT_CARTRIDGE",
    "EPOCH_CAKE_GRAY",
    "MYSTERIOUS_PACKAGE",
    "LOUDMOUTH_BASS",
    "EPOCH_CAKE_EXPIRED",
    "EPOCH_CAKE_ORANGE",
    "EPOCH_CAKE_HEPHAESTUS",
    "JERRY_BOX_GOLDEN",
    "GIFT_OF_LEARNING",
    "EPOCH_CAKE_RED",
    "FRUIT_BOWL",
    "ENCHANTED_BOOK_BUNDLE_SMALL_BRAIN",
    "ENCHANTED_BOOK_BUNDLE_RAINBOW",
    "DUNGEON_CHEST_KEY",
    "EPOCH_CAKE_PINK",
    "EPOCH_CAKE_SILVER",
    "EPOCH_CAKE_WHITE",
    "CHYME",
    "EPOCH_CAKE_BROWN",
    "CENTURY_PARTY_INVITATION",
    "EPOCH_CAKE_SEVEN_SEAS",
    "EPOCH_CAKE_BLACK",
    "EPOCH_CAKE_CYAN",
    "CAKE_SOUL",
    "CAKE_COUNTER",
    "BOX_OF_JUNK",
    "EPOCH_CAKE_AQUA",
    "ASPECT_OF_THE_JERRY_SIGNATURE",

    // Medium
    "WITHER_ARTIFACT",
    "WITHER_RELIC",
    "WARDEN_HEART",
    "TITANOBOA_SHED",
    "TIKI_MASK",
    "PET_ITEM_TIER_BOOST",
    "SHRIVELED_CORNEA",
    "SHIMMERING_WOOL",
    "RANDOM_CENTURY_CAKE_PACK",
    "RADIOACTIVE_VIAL",
    "DYE_PURE_YELLOW",
    "DYE_PURE_BLUE",
    "PRIMORDIAL_EYE",
    "PLASMA_NUCLEUS",
    "PET_SIZED_CUPCAKE",
    "OVERFLUX_CAPACITOR",
    "NECRONS_LADDER",
    "MANTI_CORE",
    "MAGMA_URCHIN_BUNDLE",
    "MAGIC_8_BALL",
    "LITTLEFOOT_FLUFF",
    "KUUDRAS_LUNG",
    "JUDGEMENT_CORE",
    "INFINITE_SPIRIT_LEAP",
    "HOCUS_POCUS_CIPHER",
    "HEPHAESTUS_LUCKY_DIP",
    "HEPHAESTUS_ANVIL",
    "HELLFIRE_ROD",
    "GOLDEN_BOUNTY",
    "GLEAMING_CRYSTAL",
    "GIANTS_SWORD",
    "ENDER_ARTIFACT",
    "ENDER_RELIC",
    "ENCHANTED_BOOK_BUNDLE_POWER",
    "ECCENTRIC_PAINTING_BUNDLE",
    "DIVAN_POWDER_COATING",
    "DIANAS_BOOKSHELF",
    "DARK_CLAYMORE",
    "COPPER_ARTIFACT",
    "CAGED_WISP",
]

export const shenItems = [
    "PRICELESS_THE_FISH",
    "CLOVER_HELMET",
    "GIANT_FISHING_ROD",
    "RACING_HELMET",
    "DIRT_ROD",
    "WIZARD_WAND",
    "HOE_OF_NO_TILLING",
    "KNUCKLE_SANDWICH",
    "SHIMMERSPARKLE_CHESTPLATE",
    "PUZZLE_CUBE",
    "SPELLING_STICK",
]

export const soulboundNullItems = [
    "AMETHYST_CRYSTAL",
    "BANNER",
    "BANNER:0",
    "BANNER:1",
    "BANNER:2",
    "BANNER:3",
    "BANNER:4",
    "BANNER:5",
    "BANNER:6",
    "BANNER:7",
    "BANNER:8",
    "BANNER:9",
    "BANNER:10",
    "BANNER:11",
    "BANNER:12",
    "BANNER:13",
    "BANNER:14",
    "BANNER:15",
    "BANNER:16",
    "HAUNT_ABILITY",
    "HEALER_DUNGEON_ABILITY_1",
    "HEALER_DUNGEON_ABILITY_3",
    "JADE_CRYSTAL",
    "JASPER_CRYSTAL",
    "MAGE_DUNGEON_ABILITY_2",
    "GEMSTONE_POWDER_TIER_1",
    "GEMSTONE_POWDER_TIER_2",
    "GEMSTONE_POWDER_TIER_3",
    "MITHRIL_POWDER_TIER_1",
    "MITHRIL_POWDER_TIER_2",
    "MITHRIL_POWDER_TIER_3",
    "SECRET_DUNGEON_REDSTONE_KEY",
    "NETHER_STAR",
    "DUNGEON_WIZARD_CRYSTAL",
]

export const skyblockAreaNamesMap = {
    "dynamic": "Private Island",
    "hub": "Hub",
    "mining_1": "Gold Mine",
    "mining_2": "Deep Caverns",
    "mining_3": "Dwarven Mines",
    "combat_1": "Spider's Den",
    "crimson_isle": "Crimson Isle",
    "combat_3": "The End",
    "farming_1": "The Farming Islands",
    "foraging_1": "The Park",
    "winter": "Jerry's Workshop",
    "dungeon": "Dungeon",
    "dungeon_hub": "Dungeon Hub",
    "crystal_hollows": "Crystal Hollows",
    "garden": "The Garden",
    "rift": "Rift",
    "kuudra": "Kuudra's Hollow",
    "mineshaft": "Glacite Mineshafts",
    "fishing_1": "Backwater Bayou",
    "foraging_2": "Galatea",
    "lotus_atoll": "Lotus Atoll",
}

export const allValuableRunesList = [
    "GRAND_SEARING",
    "SMITTEN",
    "MEOW_MUSIC",
    "BARK_TUNES",
]

export const allWeaponRunesList = [
    "BLOOD",
    "BLOOD_2",
    "SNOW",
    "HEARTS",
    "MUSIC",
    "LIGHTNING",
    "ZOMBIE_SLAYER",
    "SPIRIT",
    "SOULTWIST",
    "JERRY",
    "MEOW_MUSIC",
    "BARK_TUNES",
    "HEARTSPLOSION",
]

export const allNonFarmingHoesList = [
    "SPORE_HARVESTER",
    "THORNLEAF_SCYTHE",
    "THEORETICAL_HOE",
    "HOE_OF_GREAT_TILLING",
    "HOE_OF_GREATER_TILLING",
    "HOE_OF_GREATEST_TILLING",
    "HOE_OF_NO_TILLING",
    "GARDEN_SCYTHE",
]

export const allAxeFarmingTools = [
    "MELON_DICER",
    "MELON_DICER_2",
    "MELON_DICER_3",
    "PUMPKIN_DICER",
    "PUMPKIN_DICER_2",
    "PUMPKIN_DICER_3",
    "COCO_CHOPPER",
    "COCO_CHOPPER_2",
    "COCO_CHOPPER_3",
    "BASIC_GARDENING_AXE",
    "ADVANCED_GARDENING_AXE",
    "BINGHOE",
    "SPORE_HARVESTER",
]

export const appliedSkinNameMap = {
    "GUARDIAN": "WATCHER_GUARDIAN",
    "ENDERMAN": "SPOOKY_ENDERMAN",
    "RABBIT": "PRETTY_RABBIT",
    "PERFECT_FORGE": "REINFORCED",
    "WITHER": "DARK_WITHER",
    "SILVERFISH": "FORTIFIED_SILVERFISH",
    "WOLF": "DARK_WOLF",
    "PET_SKIN_DOLPHIN_SNUBFIN": "PET_SKIN_DOLPHIN_SNUBFIN_BLUE",
    "WITHER_GOGGLES_CYBERPUNK": "CYPERPUNK",
    "WITHER_GOGGLES_CELESTIAL": "CELESTIAL",
}

export const armorItems = [
    "minecraft:sea_lantern",
    "sea_lantern",
    "minecraft:melon",
    "melon",
    "minecraft:oak_leaves",
    "oak_leaves",
    "minecraft:packed_ice",
    "packed_ice",
    "minecraft:sponge",
    "sponge",

    "leather cap",
    "leather helmet",
    "leather tunic",
    "leather chestplate",
    "leather pants",
    "leather trousers",
    "leather boots",
    "leather shoes",
    "minecraft:leather_helmet",
    "minecraft:leather_chestplate",
    "minecraft:leather_leggings",
    "minecraft:leather_boots",

    "chain helmet",
    "chain chestplate",
    "chain leggings",
    "chain boots",
    "chainmail helmet",
    "chainmail chestplate",
    "chainmail leggings",
    "chainmail boots",
    "minecraft:chainmail_helmet",
    "minecraft:chainmail_chestplate",
    "minecraft:chainmail_leggings",
    "minecraft:chainmail_boots",

    "golden helmet",
    "golden chestplate",
    "golden leggings",
    "golden boots",
    "gold helmet",
    "gold chestplate",
    "gold leggings",
    "gold boots",
    "minecraft:golden_helmet",
    "minecraft:golden_chestplate",
    "minecraft:golden_leggings",
    "minecraft:golden_boots",

    "iron helmet",
    "iron chestplate",
    "iron leggings",
    "iron boots",
    "minecraft:iron_helmet",
    "minecraft:iron_chestplate",
    "minecraft:iron_leggings",
    "minecraft:iron_boots",

    "diamond helmet",
    "diamond chestplate",
    "diamond leggings",
    "diamond boots",
    "minecraft:diamond_helmet",
    "minecraft:diamond_chestplate",
    "minecraft:diamond_leggings",
    "minecraft:diamond_boots",

    "netherite helmet",
    "netherite chestplate",
    "netherite leggings",
    "netherite boots",
    "minecraft:netherite_helmet",
    "minecraft:netherite_chestplate",
    "minecraft:netherite_leggings",
    "minecraft:netherite_boots",

    "turtle helmet",
    "turtle shell",
    "minecraft:turtle_helmet",
]
export const weaponItems = [
    "wooden sword",
    "wood sword",
    "stone sword",
    "golden sword",
    "gold sword",
    "iron sword",
    "diamond sword",
    "netherite sword",
    "bow",
    "iron axe",
    "gold horse armour",
    "gold horse armor",
    "iron hoe",
    "ghast tear",
    "stick",
    "emerald",
    "fishing rod",
    "blaze rod",

    "minecraft:wooden_sword",
    "minecraft:wood_sword",
    "minecraft:stone_sword",
    "minecraft:golden_sword",
    "minecraft:gold_sword",
    "minecraft:iron_sword",
    "minecraft:diamond_sword",
    "minecraft:netherite_sword",
    "minecraft:bow",
    "minecraft:iron_axe",
    "minecraft:golden_horse_armor",
    "minecraft:iron_hoe",
    "minecraft:ghast_tear",
    "minecraft:stick",
    "minecraft:emerald",
    "minecraft:fishing_rod",
    "minecraft:blaze_rod",
]
export const skullItems = [
    "skull",
    "skeleton skull",
    "head",
    "minecraft:skull",
]

export const allDungeonItemIDs = {
    // Swords - Rare
    "CONJURING_SWORD": "Conjuring",
    "CRYPT_DREADLORD_SWORD": "Dreadlord Sword",
    "ICE_SPRAY_WAND": "Ice Spray Wand",
    "SILENT_DEATH": "Silent Death",
    "ZOMBIE_SOLDIER_CUTLASS": "Zombie Soldier Cutlass",

    // Swords - Epic
    "EARTH_SHARD": "Earth Shard",
    "ZOMBIE_COMMANDER_WHIP": "Zombie Commander Whip",
    "ZOMBIE_KNIGHT_SWORD": "Zombie Knight Sword",


    // Bows - Rare
    "MACHINE_GUN_BOW": "Machine Gun Shortbow",
    "CRYPT_BOW": "Soulstealer Bow",
    "SNIPER_BOW": "Sniper Bow",

    // Armor
    "BOUNCY_HELMET": "Bouncy Helmet",
    "BOUNCY_CHESTPLATE": "Bouncy Chestplate",
    "BOUNCY_LEGGINGS": "Bouncy Leggings",
    "BOUNCY_BOOTS": "Bouncy Boots",

    "HEAVY_HELMET": "Heavy Helmet",
    "HEAVY_CHESTPLATE": "Heavy Chestplate",
    "HEAVY_LEGGINGS": "Heavy Leggings",
    "HEAVY_BOOTS": "Heavy Boots",

    "ROTTEN_HELMET": "Rotten Helmet",
    "ROTTEN_CHESTPLATE": "Rotten Chestplate",
    "ROTTEN_LEGGINGS": "Rotten Leggings",
    "ROTTEN_BOOTS": "Rotten Boots",

    "SKELETON_GRUNT_HELMET": "Skeleton Grunt Helmet",
    "SKELETON_GRUNT_CHESTPLATE": "Skeleton Grunt Chestplate",
    "SKELETON_GRUNT_LEGGINGS": "Skeleton Grunt Leggings",
    "SKELETON_GRUNT_BOOTS": "Skeleton Grunt Boots",

    "SKELETON_LORD_HELMET": "Skeleton Lord Helmet",
    "SKELETON_LORD_CHESTPLATE": "Skeleton Lord Chestplate",
    "SKELETON_LORD_LEGGINGS": "Skeleton Lord Leggings",
    "SKELETON_LORD_BOOTS": "Skeleton Lord Boots",

    "SKELETON_MASTER_HELMET": "Skeleton Master Helmet",
    "SKELETON_MASTER_CHESTPLATE": "Skeleton Master Chestplate",
    "SKELETON_MASTER_LEGGINGS": "Skeleton Master Leggings",
    "SKELETON_MASTER_BOOTS": "Skeleton Master Boots",

    "SKELETON_SOLDIER_HELMET": "Skeleton Soldier Helmet",
    "SKELETON_SOLDIER_CHESTPLATE": "Skeleton Soldier Chestplate",
    "SKELETON_SOLDIER_LEGGINGS": "Skeleton Soldier Leggings",
    "SKELETON_SOLDIER_BOOTS": "Skeleton Soldier Boots",

    "SKELETOR_HELMET": "Skeletor Helmet",
    "SKELETOR_CHESTPLATE": "Skeletor Chestplate",
    "SKELETOR_LEGGINGS": "Skeletor Leggings",
    "SKELETOR_BOOTS": "Skeletor Boots",

    "SUPER_HEAVY_HELMET": "Super Heavy Helmet",
    "SUPER_HEAVY_CHESTPLATE": "Super Heavy Chestplate",
    "SUPER_HEAVY_LEGGINGS": "Super Heavy Leggings",
    "SUPER_HEAVY_BOOTS": "Super Heavy Boots",

    "ZOMBIE_COMMANDER_HELMET": "Zombie Commander Helmet",
    "ZOMBIE_COMMANDER_CHESTPLATE": "Zombie Commander Chestplate",
    "ZOMBIE_COMMANDER_LEGGINGS": "Zombie Commander Leggings",
    "ZOMBIE_COMMANDER_BOOTS": "Zombie Commander Boots",

    "ZOMBIE_KNIGHT_HELMET": "Zombie Knight Helmet",
    "ZOMBIE_KNIGHT_CHESTPLATE": "Zombie Knight Chestplate",
    "ZOMBIE_KNIGHT_LEGGINGS": "Zombie Knight Leggings",
    "ZOMBIE_KNIGHT_BOOTS": "Zombie Knight Boots",

    "ZOMBIE_LORD_HELMET": "Zombie Lord Helmet",
    "ZOMBIE_LORD_CHESTPLATE": "Zombie Lord Chestplate",
    "ZOMBIE_LORD_LEGGINGS": "Zombie Lord Leggings",
    "ZOMBIE_LORD_BOOTS": "Zombie Lord Boots",

    "ZOMBIE_SOLDIER_HELMET": "Zombie Soldier Helmet",
    "ZOMBIE_SOLDIER_CHESTPLATE": "Zombie Soldier Chestplate",
    "ZOMBIE_SOLDIER_LEGGINGS": "Zombie Soldier Leggings",
    "ZOMBIE_SOLDIER_BOOTS": "Zombie Soldier Boots",

    "SNIPER_HELMET": "Sniper Helmet",
}

export const defaultFairyHexes = [
    "#FF3399",
    "#FF66B2",
    "#FF99CC",
    "#FFCCE5",
]
export const fairyHexes = [
    // Normal Fairy + Og Fairy
    "#FFCCE5",
    "#FF3399",
    "#99004C",
    "#FF99CC",
    "#FF007F",
    "#660033",
    "#FF66B2",
    "#CC0066",

    // Og Fairy
    "#FF99FF",
    "#FFCCFF",
    "#E5CCFF",
    "#CC99FF",
    "#CC00CC",
    "#FF00FF",
    "#FF33FF",
    "#FF66FF",
    "#B266FF",
    "#9933FF",
    "#7F00FF",
    "#660066",
    "#6600CC",
    "#4C0099",
    "#330066",
    "#990099",
]

export const defaultCrystalHex = "#FCF3FF"
export const crystalHexes = [
    "#1F0030",
    "#46085E",
    "#54146E",
    "#5D1C78",
    "#63237D",
    "#6A2C82",
    "#7E4196",
    "#8E51A6",
    "#9C64B3",
    "#A875BD",
    "#B88BC9",
    "#C6A3D4",
    "#D9C1E3",
    "#E5D1ED",
    "#EFE1F5",
    "#FCF3FF",
]

export const pureExoticHexes = {
    "993333": "red",
    "D87F33": "orange",
    "E5E533": "yellow",
    "7FCC19": "lime",
    "667F33": "dark green",
    "4C7F99": "cyan",
    "6699D8": "light blue",
    "334CB2": "dark blue",
    "7F3FB2": "purple",
    "B24CD8": "magenta",
    "F27FA5": "pink",
    "664C33": "brown",
    "FFFFFF": "white",
    "999999": "light gray",
    "4C4C4C": "dark gray",
    "191919": "black",
}
export const trueExoticHexes = {
    "86D28D": "mint",
    "592626": "maroon",
    "263265": "navy",
    "B2CCEB": "ice",
    "DEB223": "gold",
    "B2D826": "nint",
    "B2BF99": "pistachio",
    "B85933": "brick",
    "324C59": "dark cyan",
    "4C2C65": "grape",
    "6DB260": "jade",
    "727272": "stone",
}
export const shortenedDyeCraftingRecipeMap = {
    "0": "993333",
    "1": "D87F33",
    "2": "E5E533",
    "3": "7FCC19",
    "4": "667F33",
    "5": "4C7F99",
    "6": "6699D8",
    "7": "334CB2",
    "8": "7F3FB2",
    "9": "B24CD8",
    "a": "F27FA5",
    "b": "664C33",
    "c": "FFFFFF",
    "d": "999999",
    "e": "4C4C4C",
    "f": "191919",
}

export const defaultGreatSpookHex = "#993399"
export const greatSpookHexes = [
    "#993399",
    "#9E00B2",
    "#9700AA",
    "#9000A3",
    "#89009B",
    "#830093",
    "#7C008B",
    "#750084",
    "#6E007C",
    "#670074",
    "#60006C",
    "#590065",
    "#52005D",
    "#4C0055",
    "#45004D",
    "#3E0046",
    "#37003E",
    "#300036",
    "#29002E",
    "#220027",
    "#1B001F",
    "#150017",
    "#0E000F",
    "#070008",
    "#000000",
]

export const defaultGhostlyBootsHex = "#808080"
export const ghostlyBootsHexes = [
    "#FFFFFF",
    "#FCFCFC",
    "#F5F5F5",
    "#E9E9E9",
    "#D9D9D9",
    "#C6C6C6",
    "#B0B0B0",
    "#989898",
    "#808080",
    "#686868",
    "#505050",
    "#3A3A3A",
    "#272727",
    "#171717",
    "#0B0B0B",
    "#040404",
    "#010101",
]

export const defaultRancherHex = "#000000"
export const rancherBootsHexes = [
    "#000000",
    "#CC5500",
]

export const defaultMastiffHex = "#00BE00"

export const defaultReaperHex = "#1B1B1B"
export const reaperArmorHexes = [
    "#1B1B1B",
    "#FF0000",
]

export const craftableLeatherHexes = [
    "#7E4196",
    "#8E51A6",
    "#9C64B3",
    "#A875BD",
    "#B88BC9",
    "#C6A3D4",
    "#D9C1E3",
    "#E5D1ED",
    "#EFE1F5",
]

export const defaultAdaptiveHex = "#BFBCB2"
export const adaptiveHexes = [
    "#BFBCB2",
    "#3ABE78",
    "#169F57",
    "#82E3D8",
    "#2AB5A5",
    "#D579FF",
    "#6E00A0",
    "#BB0000",
    "#FF4242",
    "#FFC234",
    "#FFF7E6",
]

export const glitchedReaperHex = "#FF0000"
export const glitchedSharkHex = "#FFDC51"
export const glitchedBackwaterHex = "#0B004F"
export const glitchedFrozenBlazeHex = "#F7DA33"
export const glitchedBatPersonHex = "#606060"

let normalGhostReforgeList = [
    "godly",
    "unpleasant",
    "superior",
    "zealous",
    "keen",
    "bloodshot",
]
let ghostAccessoryReforgeList = [
    "strange",
    "shiny",
    "vivid",
]
export const ghostExFarmingToolsReforgeList = [
    "robust",
    "blessed",
    "peasant",
    "green_thumb",
    "zooming",
    "bountiful",
]
export const legacyReforgeMap = {
    "normal": [
        "demonic",
        "strong",
        "hurtful",
        "forceful",
        "rich_sword",
        "odd_bow",
    ],
    "normalGhost": normalGhostReforgeList,
    "accessory": [
        "itchy",
        "shaded",
        "pretty",
        "ominous",
        "pleasant",
        "simple",
        "bloody",
        "silky",
        "bizarre",
        "sweet",
    ],
    "accessoryGhost": ghostAccessoryReforgeList,
    "farmingTool": [
        "double_bit",
        "great",
        "lumberjack",
        "lush",
        "rugged",
        "toil",
        "moil",
        "moonglade",
    ],
    "axe": [
        "earthy",
        "blessed",
        "bountiful",
    ],
    "exFarmingToolGhost": ghostExFarmingToolsReforgeList,
}
export const allGhostReforgeList = [
    ...normalGhostReforgeList,
    ...ghostAccessoryReforgeList,
    ...ghostExFarmingToolsReforgeList,
]
export const allLegacyReforgeList = []
Object.values(legacyReforgeMap).forEach((list) => {
    allLegacyReforgeList.push(...list)
})

export const legacySelectorTypeDict = {
    NONE: "None",
    ALL: "All",
    ARMOR_ONLY: "Armor only",
    WEAPON_ONLY: "Weapon only",
    ACCESSORY_ONLY: "Accessory only",
    ARMOR_ACCESSORY: "Armor + Accessory only",
    WEAPON_ACCESSORY: "Weapon + Accessory only",
    WEAPON_ARMOR: "Weapon + Armor only",
    BLACKLIST: "Blacklist",
    WHITELIST: "Whitelist",
}
export const legacySelectorWithDragonTypeDict = {
    ...legacySelectorTypeDict,
    DRAGON_ONLY: "Dragon Armor only",
}

export const ogFairyHexes = {
    // Only certain pieces are og fairy
    "#660033": ["chestplate", "leggings", "boots"],
    "#99004C": ["leggings", "boots"],
    "#CC0066": ["boots"],
    "#FFCCE5": ["helmet", "chestplate", "leggings"],
    "#FF99CC": ["helmet", "chestplate"],
    "#FF66B2": ["helmet"],

    // All pieces are og fairy
    "#FF99FF": ["helmet", "chestplate", "leggings", "boots"],
    "#FFCCFF": ["helmet", "chestplate", "leggings", "boots"],
    "#E5CCFF": ["helmet", "chestplate", "leggings", "boots"],
    "#CC99FF": ["helmet", "chestplate", "leggings", "boots"],
    "#CC00CC": ["helmet", "chestplate", "leggings", "boots"],
    "#FF00FF": ["helmet", "chestplate", "leggings", "boots"],
    "#FF33FF": ["helmet", "chestplate", "leggings", "boots"],
    "#FF66FF": ["helmet", "chestplate", "leggings", "boots"],
    "#B266FF": ["helmet", "chestplate", "leggings", "boots"],
    "#9933FF": ["helmet", "chestplate", "leggings", "boots"],
    "#7F00FF": ["helmet", "chestplate", "leggings", "boots"],
    "#660066": ["helmet", "chestplate", "leggings", "boots"],
    "#6600CC": ["helmet", "chestplate", "leggings", "boots"],
    "#4C0099": ["helmet", "chestplate", "leggings", "boots"],
    "#330066": ["helmet", "chestplate", "leggings", "boots"],
    "#990099": ["helmet", "chestplate", "leggings", "boots"],
}

export const witherDyes = {
    "#E7413C": ["chestplate", "§6Necron"],
    "#E75C3C": ["leggings", "§6Necron"],
    "#E76E3C": ["boots", "§6Necron"],

    "#1793C4": ["chestplate", "§bStorm"],
    "#17A8C4": ["leggings", "§bStorm"],
    "#1CD4E4": ["boots", "§bStorm"],

    "#45413C": ["chestplate", "§8Goldor"],
    "#65605A": ["leggings", "§8Goldor"],
    "#88837E": ["boots", "§8Goldor"],

    "#4A14B7": ["chestplate", "§5Maxor"],
    "#5D2FB9": ["leggings", "§5Maxor"],
    "#8969C8": ["boots", "§5Maxor"],

    "#000000": ["", "§8Black"],
}

export const armorPriority = {
    "HELMET": 1,
    "CHESTPLATE": 2,
    "LEGGINGS": 3,
    "BOOTS": 4,
}

export const itemIDReplacementMap = {
    "BARDING": ["HORSE_ARMOR", false],
    "GOD_POTION": ["LEGACY_GOD_POTION", true],
    "LEATHER_BOOTS:": ["NULL_BOOTS:", false],
    "THORNS_BOOTS": ["SPIRIT_BOOTS", false],
    "PERFECT_FORGE": ["REINFORCED_SKIN", false],
    "SMITTEN": ["SMITTEN_RUNE", true],
    "GEMSTONE_COLLECTION": ["GEMSTONE_ITEM", true],
    "SKULL_ITEM:3": ["STEVE_SKULL", true],
    "SKULL_ITEM:5": ["DRAGON_HEAD", true],
    "BLOOD_2": ["BLOOD", true],

    "BALLOON_HAT_2025": ["2025_BALLOON_HAT", false],
    "BALLOON_HAT_2024": ["2024_BALLOON_HAT", false],
    "PARTY_HAT_SLOTH": ["2023_SLOTH_HAT", false],
    "PARTY_HAT_CRAB_ANIMATED": ["2022_CRAB_HAT", false],
    "PARTY_HAT_CRAB": ["2020_CRAB_HAT", false],

    "WISE_WITHER": ["STORM", false],
    "POWER_WITHER": ["NECRON", false],
    "TANK_WITHER": ["GOLDOR", false],
    "SPEED_WITHER": ["MAXOR", false],

    "ANGLER_CHEST": ["ANGLER_CHESTPLATE", true],
    "ANGLER_LEGS": ["ANGLER_LEGGINGS", false],

    "BAT_CHEST": ["BAT_PERSON_CHESTPLATE", false],
    "BAT_LEGS": ["BAT_PERSON_LEGGINGS", false],
    "BAT_BOOTS": ["BAT_PERSON_BOOTS", false],

    "BLAZE_CHEST": ["BLAZE_CHESTPLATE", true],
    "BLAZE_LEGS": ["BLAZE_LEGGINGS", false],

    "CACTUS_HELM": ["CACTUS_HELMET", true],
    "CACTUS_CHEST": ["CACTUS_CHESTPLATE", true],
    "CACTUS_LEGS": ["CACTUS_LEGGINGS", false],

    "CHEAP_TUXEDO_CHEST": ["CHEAP_TUXEDO_CHESTPLATE", true],
    "CHEAP_TUXEDO_LEGS": ["CHEAP_TUXEDO_LEGGINGS", false],
    "FANCY_TUXEDO_CHEST": ["FANCY_TUXEDO_CHESTPLATE", true],
    "FANCY_TUXEDO_LEGS": ["FANCY_TUXEDO_LEGGINGS", false],

    "CREEPER_LEGS": ["CREEPER_PANTS", false],
    "CREEPER_LEGGINGS": ["CREEPER_PANTS", false],

    "CRYSTAL_HELM": ["CRYSTAL_HELMET", true],
    "CRYSTAL_CHEST": ["CRYSTAL_CHESTPLATE", true],
    "CRYSTAL_LEGS": ["CRYSTAL_LEGGINGS", false],

    "EMERALD_HELM": ["EMERALD_ARMOR_HELMET", true],
    "EMERALD_CHEST": ["EMERALD_ARMOR_CHESTPLATE", true],
    "EMERALD_LEGS": ["EMERALD_ARMOR_LEGGINGS", false],

    "FAIRY_HELM": ["FAIRY_HELMET", true],
    "FAIRY_CHEST": ["FAIRY_CHESTPLATE", true],
    "FAIRY_LEGS": ["FAIRY_LEGGINGS", false],

    "FARM_ARMOR_HELM": ["FARM_ARMOR_HELMET", true],
    "FARM_ARMOR_CHEST": ["FARM_ARMOR_CHESTPLATE", true],
    "FARM_ARMOR_LEGS": ["FARM_ARMOR_LEGGINGS", false],
    "FARM_SUIT_HELM": ["FARM_SUIT_HELMET", true],
    "FARM_SUIT_CHEST": ["FARM_SUIT_CHESTPLATE", true],
    "FARM_SUIT_LEGS": ["FARM_SUIT_LEGGINGS", false],

    "GROWTH_HELM": ["GROWTH_HELMET", true],
    "GROWTH_CHEST": ["GROWTH_CHESTPLATE", true],
    "GROWTH_LEGS": ["GROWTH_LEGGINGS", false],

    "GOLDOR_CHEST": ["GOLDOR_CHESTPLATE", true],
    "GOLDOR_LEGS": ["GOLDOR_LEGGINGS", false],

    "GUARDIAN_CHEST": ["GUARDIAN_CHESTPLATE", true],

    "LAPIS_CHEST": ["LAPIS_ARMOR_CHESTPLATE", true],
    "LAPIS_LEGS": ["LAPIS_ARMOR_LEGGINGS", false],
    "LAPIS_BOOTS": ["LAPIS_ARMOR_BOOTS", false],

    "LEAFLET_CHEST": ["LEAFLET_CHESTPLATE", true],
    "LEAFLET_LEGS": ["LEAFLET_LEGGINGS", false],

    "MAGMA_HELM": ["ARMOR_OF_MAGMA_HELMET", true],
    "MAGMA_CHEST": ["ARMOR_OF_MAGMA_CHESTPLATE", true],
    "MAGMA_LEGS": ["ARMOR_OF_MAGMA_LEGGINGS", true],
    "MAGMA_BOOTS": ["ARMOR_OF_MAGMA_BOOTS", true],

    "MAXOR_CHEST": ["MAXOR_CHESTPLATE", true],
    "MAXOR_LEGS": ["MAXOR_LEGGINGS", false],

    "MINER_HELM": ["MINER_OUTFIT_HELMET", true],
    "MINER_CHEST": ["MINER_OUTFIT_CHESTPLATE", true],
    "MINER_LEGS": ["MINER_OUTFIT_LEGGINGS", false],
    "MINER_BOOTS": ["MINER_OUTFIT_BOOTS", false],

    "MUSHROOM_HELM": ["MUSHROOM_HELMET", true],
    "MUSHROOM_CHEST": ["MUSHROOM_CHESTPLATE", true],
    "MUSHROOM_LEGS": ["MUSHROOM_LEGGINGS", false],

    "NECRON_CHEST": ["NECRON_CHESTPLATE", true],
    "NECRON_LEGS": ["NECRON_LEGGINGS", false],

    "OBSIDIAN_CHEST": ["OBSIDIAN_CHESTPLATE", true],

    "TARA_HELM": ["TARANTULA_HELMET", true],
    "TARANTULA_HELM": ["TARANTULA_HELMET", true],
    "TARA_LEGS": ["TARANTULA_LEGGINGS", false],
    "TARANTULA_LEGS": ["TARANTULA_LEGGINGS", false],

    "OLD_CHEST": ["OLD_DRAGON_CHESTPLATE", false],
    "OLD_LEGS": ["OLD_DRAGON_LEGGINGS", false],
    "OLD_BOOTS": ["OLD_DRAGON_BOOTS", false],

    "PROTECTOR_CHEST": ["PROTECTOR_DRAGON_CHESTPLATE", false],
    "PROTECTOR_LEGS": ["PROTECTOR_DRAGON_LEGGINGS", false],
    "PROTECTOR_BOOTS": ["PROTECTOR_DRAGON_BOOTS", false],

    "STRONG_CHEST": ["STRONG_DRAGON_CHESTPLATE", false],
    "STRONG_LEGS": ["STRONG_DRAGON_LEGGINGS", false],
    "STRONG_BOOTS": ["STRONG_DRAGON_BOOTS", false],

    "SUPERIOR_CHEST": ["SUPERIOR_DRAGON_CHESTPLATE", false],
    "SUPERIOR_LEGS": ["SUPERIOR_DRAGON_LEGGINGS", false],
    "SUPERIOR_BOOTS": ["SUPERIOR_DRAGON_BOOTS", false],

    "UNSTABLE_CHEST": ["UNSTABLE_DRAGON_CHESTPLATE", false],
    "UNSTABLE_LEGS": ["UNSTABLE_DRAGON_LEGGINGS", false],
    "UNSTABLE_BOOTS": ["UNSTABLE_DRAGON_BOOTS", false],

    "WISE_CHEST": ["WISE_DRAGON_CHESTPLATE", false],
    "WISE_LEGS": ["WISE_DRAGON_LEGGINGS", false],
    "WISE_BOOTS": ["WISE_DRAGON_BOOTS", false],

    "YOUNG_CHEST": ["YOUNG_DRAGON_CHESTPLATE", false],
    "YOUNG_LEGS": ["YOUNG_DRAGON_LEGGINGS", false],
    "YOUNG_BOOTS": ["YOUNG_DRAGON_BOOTS", false],

    "PUMPKIN_HELM": ["PUMPKIN_HELMET", true],
    "PUMPKIN_CHEST": ["PUMPKIN_CHESTPLATE", true],
    "PUMPKIN_LEGS": ["PUMPKIN_LEGGINGS", false],

    "PACK": ["CHESTPLATE_OF_THE_PACK", true],

    "SHARK_CHEST": ["SHARK_SCALE_CHESTPLATE", true],
    "SHARK_LEGS": ["SHARK_SCALE_LEGGINGS", false],
    "SHARK_BOOTS": ["SHARK_SCALE_BOOTS", false],

    "SPEEDSTER_HELM": ["SPEEDSTER_HELMET", true],
    "SPEEDSTER_CHEST": ["SPEEDSTER_CHESTPLATE", true],
    "SPEEDSTER_LEGS": ["SPEEDSTER_LEGGINGS", false],

    "SPONGE_CHEST": ["SPONGE_CHESTPLATE", true],
    "SPONGE_LEGS": ["SPONGE_LEGGINGS", false],

    "SPOOKY_CHEST": ["SPOOKY_CHESTPLATE", true],
    "SPOOKY_LEGS": ["SPOOKY_LEGGINGS", false],

    "STEREO_LEGS": ["MUSIC_PANTS", false],
    "STEREO_LEGGINGS": ["MUSIC_PANTS", false],
    "STEREO_PANTS": ["MUSIC_PANTS", false],

    "STORM_CHEST": ["STORM_CHESTPLATE", true],
    "STORM_LEGS": ["STORM_LEGGINGS", false],
}

export const profileCuteNameMap = {
    "apple": "§cApple",
    "banana": "§eBanana",
    "blueberry": "§9Blueberry",
    "coconut": "§6Coconut",
    "cucumber": "§aCucumber",
    "grapes": "§5Grapes",
    "kiwi": "§2Kiwi",
    "lemon": "§eLemon",
    "lime": "§aLime",
    "mango": "§6Mango",
    "orange": "§6Orange",
    "papaya": "§6Papaya",
    "peach": "§dPeach",
    "pear": "§aPear",
    "pineapple": "§6Pineapple",
    "pomegranate": "§5Pomegranate",
    "raspberry": "§5Raspberry",
    "strawberry": "§cStrawberry",
    "tomato": "§cTomato",
    "watermelon": "§aWatermelon",
    "zucchini": "§aZucchini",
}

export const inventoryNameData = {
    "inv_armor": ["Armor", 0],
    "inv_contents": ["Inventory", 1],
    "wardrobe_contents": ["Wardrobe", 2],
    "equipment_contents": ["Equipment", 3],
    "personal_vault_contents": ["Personal Vault", 4],
    "ender_chest_contents": ["Ender Chest", 5],
    "backpack_contents": ["Backpack", 6],
    "bag_contents": ["Bag Contents", 7],
    "potion_bag": ["Potion Bag", 8],
    "talisman_bag": ["Talisman Bag", 9],
    "fishing_bag": ["Fishing Bag", 10],
    "sacks_bag": ["Sacks", 11],
    "quiver": ["Quiver", 12],
}

export const allSignPhrases = [
    "exotic",
    "fairy",
    "crystal",
    "bleach",
    "dye",
    "skin",
    "unobtainable",
    "rare",
    "colored",
    "coloured",
    "investment",
    "legacy",
    "museum",
    "cosmetic",
    "collect",
    "discord",
]

export const seymourItemIDs = [
    "VELVET_TOP_HAT",
    "CASHMERE_JACKET",
    "SATIN_TROUSERS",
    "OXFORD_SHOES",
]

export const matchingSignatureProgressColorList = [
    "§7",
    "§f",
    "§6",
    "§b§l",
]

export const salmonArmorIds = [
    "SALMON_HELMET",
    "SALMON_CHESTPLATE",
    "SALMON_LEGGINGS",
    "SALMON_BOOTS",
]
export const midasWeaponIds = [
    "MIDAS_SWORD",
    "MIDAS_STAFF",
]
export const horseArmorIds = [
    "IRON_BARDING",
    "GOLD_BARDING",
    "DIAMOND_BARDING",
]
export const editionValuablePatterns = {
    1: [],
    2: [
        "aa",
        "a0",
        "69",
        "67",
    ],
    3: [
        "aaa",
        "abb",
        "a00",
        "a0a",
        "420",
        "911",
    ],
    4: [
        "aaaa",
        "aabb",
        "abba",
        "abbb",
        "abab",
        "a000",
        "a00a",
        "1337",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026",
        "2027",
        "1024",
        "2048",
        "4096",
        "8192",
    ],
    5: [
        "aaaaa",
        "abbbb",
        "a0000",
        "aabaa",
        "a000a",
        "ab0ba",
    ],
    6: [
        "aaaaaa",
        "aabbcc",
        "aaabbb",
        "ababab",
        "aabbaa",
        "a00000",
        "a0000a",
        "abccba",
    ],
}
export const editionedGreatSpookIds = [
    "GREAT_SPOOK_HELMET",
    "GREAT_SPOOK_CHESTPLATE",
    "GREAT_SPOOK_LEGGINGS",
    "GREAT_SPOOK_BOOTS",
    "GREAT_SPOOK_STAFF",
    "GREAT_SPOOK_NECKLACE",
    "GREAT_SPOOK_CLOAK",
    "GREAT_SPOOK_GLOVES",
    "GREAT_SPOOK_BELT",
    "GREAT_SPOOK_SWORD",
    "GREAT_SPOOK_ARTIFACT",
]
export const mementoItemIds = [
    "WIZARD_PORTAL_MEMENTO",
    "EXPENSIVE_TOY",
    "GOLDEN_COLLAR",
    "LOCKED_BALLOT_BOX",
    "PAINTERS_PALETTE",
]
export const rareNullItemIds = [
    "HUGE_MUSHROOM_1:14",
    "HUGE_MUSHROOM_2:15",
    "NETHER_BRICK_STAIRS:7",
    // others?
]
export const emberAshArmorItemIds = [
    "FLAMEBREAKER_HELMET",
    "FLAMEBREAKER_CHESTPLATE",
    "FLAMEBREAKER_LEGGINGS",
    "FLAMEBREAKER_BOOTS",
]
export const dragonFragmentIds = [
    "SUPERIOR_FRAGMENT",
    "WISE_FRAGMENT",
    "YOUNG_FRAGMENT",
    "PROTECTOR_FRAGMENT",
    "OLD_FRAGMENT",
    "STRONG_FRAGMENT",
    "UNSTABLE_FRAGMENT",
]
export const statBoostedItemIds = [
    "SQUID_BOOTS",
    "FAIRY_HELMET",
    "FAIRY_CHESTPLATE",
    "FAIRY_LEGGINGS",
    "FAIRY_BOOTS",
    "RABBIT_HAT",
    "WATER_HYDRA_HEAD",

    "WISE_WITHER_HELMET",
    "WISE_WITHER_CHESTPLATE",
    "WISE_WITHER_LEGGINGS",
    "WISE_WITHER_BOOTS",
    "STORM_HELMET",
    "STORM_CHESTPLATE",
    "STORM_LEGGINGS",
    "STORM_BOOTS",
    "POWER_WITHER_HELMET",
    "POWER_WITHER_CHESTPLATE",
    "POWER_WITHER_LEGGINGS",
    "POWER_WITHER_BOOTS",
    "NECRON_HELMET",
    "NECRON_CHESTPLATE",
    "NECRON_LEGGINGS",
    "NECRON_BOOTS",
    "SPEED_WITHER_HELMET",
    "SPEED_WITHER_CHESTPLATE",
    "SPEED_WITHER_LEGGINGS",
    "SPEED_WITHER_BOOTS",
    "MAXOR_HELMET",
    "MAXOR_CHESTPLATE",
    "MAXOR_LEGGINGS",
    "MAXOR_BOOTS",
    "TANK_WITHER_HELMET",
    "TANK_WITHER_CHESTPLATE",
    "TANK_WITHER_LEGGINGS",
    "TANK_WITHER_BOOTS",
    "GOLDOR_HELMET",
    "GOLDOR_CHESTPLATE",
    "GOLDOR_LEGGINGS",
    "GOLDOR_BOOTS",
    "WITHER_HELMET",
    "WITHER_CHESTPLATE",
    "WITHER_LEGGINGS",
    "WITHER_BOOTS",

    "SHADOW_ASSASSIN_HELMET",
    "SHADOW_ASSASSIN_CHESTPLATE",
    "SHADOW_ASSASSIN_LEGGINGS",
    "SHADOW_ASSASSIN_BOOTS",
    "STARRED_SHADOW_ASSASSIN_HELMET",
    "STARRED_SHADOW_ASSASSIN_CHESTPLATE",
    "STARRED_SHADOW_ASSASSIN_LEGGINGS",
    "STARRED_SHADOW_ASSASSIN_BOOTS",
]
export const scrolledItemIds = [
    "EGGLOCATOR",
    "HOTSPOT_RADAR",
]
