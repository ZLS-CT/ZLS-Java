import { GetTextWithBackgroundData } from "../../ZCore"
import * as Data from "../data"

export const itemDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&7Name: &8[&4999&8] &eNvidia2080Ti &7- &7(&63 Items&7)",
        "",
        "&bPets &7- &aLime &6✯",
        "&aPet: BLACK_CAT &7- &aBLACK_CAT_ONYX &7- &a(&f0&7/&f10&a)",
        "&aPet: BLUE_WHALE &7- &aWHALE_ORCA &7- &a(&c10&7/&c10&a)",
        "&aPet: BLACK_CAT &7- &aBLACK_CAT_ONYX &7- &a(&c2&7/&c10&a)",
        "",
        "&7Name: &8[&4999&8] &eNvidia2080Ti &7- &7(&66 Items&7)",
        "",
        "&bPets &7- &6Pineapple &c✯",
        "&aPet: BLACK_CAT &7- &aBLACK_CAT_ONYX &7- &a(&f0&7/&f10&a)",
        "&aPet: BLUE_WHALE &7- &aWHALE_ORCA &7- &a(&c10&7/&c10&a)",
        "&aPet: ZOMBIE &7- &aZOMBIE_SENTINEL &7- &a(&c10&7/&c10&a)",
        "&aPet: SILVERFISH &7- &aSILVERFISH_FOLLILIZED &7- &a(&f0&7/&f10&a)",
        "&aPet: SHEEP &7- &aSHEEP_BLACK &7- &a(&f0&7/&f10&a)",
        "&aPet: ROCK &7- &aROCK_EMBARRASED &7- &a(&f0&7/&f10&a)",
        "",
        "&7Name: &8[&4999&8] &eNvidia2080Ti &7- &7(&68 Items&7)",
        "",
        "&bPets &7- &eLemon &6✯",
        "&aPet: BLACK_CAT &7- &aBLACK_CAT_ONYX &7- &a(&f0&7/&f10&a)",
        "&aPet: BLUE_WHALE &7- &aWHALE_ORCA &7- &a(&c10&7/&c10&a)",
        "&aPet: ZOMBIE &7- &aZOMBIE_SENTINEL &7- &a(&c10&7/&c10&a)",
        "&aPet: SILVERFISH &7- &aSILVERFISH_FOLLILIZED &7- &a(&f0&7/&f10&a)",
        "&aPet: SHEEP &7- &aSHEEP_BLACK &7- &a(&f0&7/&f10&a)",
        "&aPet: ROCK &7- &aROCK_EMBARRASED &7- &a(&f0&7/&f10&a)",
        "&aPet: MONKEY &7- &aMONKEY_GOLDEN &7- &a(&f0&7/&f10&a)",
        "&aPet: TIGER &7- &aTIGER_TWILIGHT &7- &a(&f0&7/&f10&a)",
    ]),
    resetPosition: () => {
        Data.data.itemDisplayGUIX = Data.defaultItemDisplayGUIX
        Data.data.itemDisplayGUIY = Data.defaultItemDisplayGUIY
    },
}

export const wornItemDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&7Name: &8[&4999&8] &eNvidia2080Ti &7- &7(&63 Items&7)",
        "&aUNSTABLE_CHESTPLATE &7- &a#993333",
        "&aSTRONG_LEGGINGS &7- &a#334CB2",
        "&aMUSHROOM_BOOTS &7- &a#7FCC19",
    ]),
    resetPosition: () => {
        Data.data.wornItemDisplayGUIX = Data.defaultWornItemDisplayGUIX
        Data.data.wornItemDisplayGUIY = Data.defaultWornItemDisplayGUIY
    },
}

export const islandItemDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&eIsland Items &7- &7(&63 Items&7)",
        "&aItem Frames &7- &7(&62 Items&7):",
        "&aUNSTABLE_CHESTPLATE &7- &a#993333 &7- (&b65&7, &b105&7, &b55&7)",
        "&aSTRONG_LEGGINGS &7- &a#334CB2 &7- (&b65&7, &b100&7, &b55&7)",
        "",
        "&aArmor Stands &7- &7(&62 Items&7):",
        "&aMUSHROOM_BOOTS &7- &a#7FCC19 &7- (&b65&7, &b110&7, &b55&7)",
    ]),
    resetPosition: () => {
        Data.data.islandItemDisplayGUIX = Data.defaultIslandItemDisplayGUIX
        Data.data.islandItemDisplayGUIY = Data.defaultIslandItemDisplayGUIY
    },
}

export const oldProfilesDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&7Old Profiles List - (&63 Remaining&7)",
        "&bNvidia2080Ti &7(&aZucchini&7, &eLemon&7, &6Pineapple&7)",
        "&aNvidia2080Ti &7(&cApple&7, &6Orange&7, &cTomato&7)",
        "&6Nvidia2080Ti &7(&aPear&7, &dGrape&7, &eBanana&7)",
    ]),
    resetPosition: () => {
        Data.data.oldProfilesDisplayGUIX = Data.defaultOldProfilesDisplayGUIX
        Data.data.oldProfilesDisplayGUIY = Data.defaultOldProfilesDisplayGUIY
    },
}

export const playerTrackerDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&7Name: &eNvidia2080Ti &7- &aOnline &7- &7(&eType: &6Skyblock&7, &eMode: &eHub)",
        "&7Name: &eNvidia2080Ti &7- &aOnline &7- &7(&eType: &6Skyblock&7, &eMode: &ePrivate Island)",
        "&7Name: &eNvidia2080Ti &7- &cOffline",
    ]),
    resetPosition: () => {
        Data.data.playerTrackerDisplayGUIX = Data.defaultPlayerTrackerDisplayGUIX
        Data.data.playerTrackerDisplayGUIY = Data.defaultPlayerTrackerDisplayGUIY
    },
}

export const auctionScannerDisplayGUIData = {
    gui: new Gui(),
    placeholderTextData: GetTextWithBackgroundData([
        "&7Auctions List - (&63 Remaining&7)",
        "&7[&6BID&7] &6100k &7- &aMUSHROOM_BOOTS &7- &a#334CB2",
        "&7[&6BIN&7] &6100M &7- &aUNSTABLE_CHESTPLATE &7- &a#993333",
        "&7[&6BIN&7] &61M &7- &aSTRONG_DRAGON_BOOTS &7- &a#7FCC19",
    ]),
    resetPosition: () => {
        Data.data.auctionScannerDisplayGUIX = Data.defaultAuctionScannerDisplayGUIX
        Data.data.auctionScannerDisplayGUIY = Data.defaultAuctionScannerDisplayGUIY
    },
}
