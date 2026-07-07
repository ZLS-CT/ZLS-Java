import { ZConfigSettings } from "../ZConfig"
import * as ZCore from "../ZCore"
import * as Constants from "./Constants"
import * as Data from "./data"
import * as ZLSGUIs from "./Modules/ZLSGUIs"
import * as SeymourExtractor from "./Modules/SeymourExtractor"
import * as ZRenderLib from "../ZRenderLib"

let _keybindCallback = null
let _installStagedUpdateCallback = null

function HasMainModInstalled() {
    return ZCore.isModLoaded("zls")
}
function HasAPIModInstalled() {
    return true
    return ZCore.isModLoaded("zls-api")
}
function HasGlobalFeaturesInstalled() {
    return HasMainModInstalled() || ZCore.isModLoaded("zls-seymour")
}

const DarkHexColorReadabilityOptions = Java.type("com.zephy.zls.DarkHexColorReadabilityOptions")
const DarkHexColorReadabilityOptionsLoaded = Object.keys(DarkHexColorReadabilityOptions).length > 0

const maxLevel = 550
const legacySelectorTypeList = Object.values(Constants.legacySelectorTypeDict)
const legacySelectorWithDragonTypeList = Object.values(Constants.legacySelectorWithDragonTypeDict)
const groups = [
    "Update",
    "Scanner",
    "Render",
    "Misc",
]
const categories = [
    "Update",

    // Scanner
    "API Scanning",
    "World Scanning",
    "Scanned Items",
    "Seymour",
    "Legacy Reforges",
    "Chat Messages",

    // Render
    "Tooltips/Lore",
    "World Scanning ",
    "Highlights",
    "Colors",

    // Misc
    "§c§l1.21 Limitations",
    "Keybinds",
    "Warp Hotkeys",
    "AH Scanner",
    "Item Display",
    "Island Item Display",
    "Worn Item Display",
    "Old Profiles Display",
    "Player Tracker",
    "Other",
]
const subcategories = [
    // Scanner -> API Scanning
    "API Scanning",
    "Old Profiles",
    "Extra Features",
    // Scanner -> World Scanning
    "Global ",
    "Player Scanning",
    "Island Scanning",
    // Scanner -> Scanned Items
    "Filters",
    "Dyed Armor",
    "Skins",
    "Misc Collectables",
    "Cakes",
    "Hidden Dyes",
    "Old Colors",
    // Scanner -> Seymour
    "Toggles ",
    "Tolerances",
    "Custom Seymour",
    "Words",
    "Signatures",
    "Fade Dyes",
    // Scanner -> Legacy Reforges
    "Toggles",
    "Legacy Reforges",
    "Ghost Reforges",
    "Accessories",
    "Ghost Accessories",
    "Farming Tools",
    "Ghost Farming Tools",

    // Render -> Highlights
    "Global",
    "Items",
    "Legacy Reforges ",
    "Seymour  ",
    "Other ",
    // Render -> Tooltips/Lore
    "Database Counts",
    "Scanned Items",
    "Seymour ",
    "Lore",
    // Render -> World Scanning
    "Toggles  ",
    "Scales",
    // Render -> Colors
    "World Scanning",
    "Item Highlight Colors",
    "Seymour Highlight Colors",
    "Reset",

    // Misc -> Keybinds
    "Scanner",
    "Rendering",
    "Auction Scanner ",
    "Item Display",
    "Island Item Display",
    "Worn Item Display",
    "Old Profiles Display",
    "Player Tracker Display ",
    "Cycling Warp Hotkey ",
    "Warp Hotkeys ",
    "Other",

    // Misc -> Warp Hotkeys
    "Warp Hotkeys",
    "Cycling Warp Hotkey",

    // Misc -> Auction Scanner
    "Auction Scanner  ",
    "Auction Display",

    // Misc -> Player Tracker
    "Player Tracker",
    "Player Tracker Display",
]
const worldScannedItemColor = [0, 255, 0, 255] // #00FF00FF
const worldScannedPlayerColor = [0, 0, 255, 255] // #0000FFFF
const worldScannedSignColor = [255, 255, 0, 255] // #FFFF00FF

const valuableItemHighlightColor = [0, 255, 0, 255] // #00FF00FF
const legacyReforgeHighlightColor = [255, 127, 0, 255] // #FF7F00FF
const ghostReforgeHighlightColor = [255, 0, 0, 255] // #FF0000FF

const perfectMatchSeymourHighlightColor = [0, 255, 127, 255] // #00FF7FFF
const matchingStyleSeymourHighlightColor = [0, 0, 255, 255] // #0000FFFF
const duplicateHexSeymourHighlightColor = [255, 0, 255, 255] // #FF00FFFF
const customHexesTier0SeymourHighlightColor = [255, 0, 127, 255] // #FF007FFF
const customHexesTier1SeymourHighlightColor = [255, 0, 127, 255] // #FF007FFF
const customHexesTier2SeymourHighlightColor = [255, 0, 127, 255] // #FF007FFF
const customWildcardHexesSeymourHighlightColor = [255, 192, 192, 255] // #FFC0C0FF
const valuableRightPieceTier0SeymourHighlightColor = [0, 255, 255, 255] // #00FFFFFF
const valuableRightPieceTier1SeymourHighlightColor = [0, 255, 255, 255] // #00FFFFFF
const valuableRightPieceTier2SeymourHighlightColor = [0, 255, 255, 255] // #00FFFFFF
const customWordSeymourHighlightColor = [255, 255, 0, 255] // #FFFF00FF
const matchingWordSeymourHighlightColor = [255, 192, 203, 255] // #FFC0FFFF
const ownedSignatureSeymourHighlightColor = [102, 153, 216, 255] // #6699D8FF
const fadeDyeTier0SeymourHighlightColor = [127, 0, 255, 255] // #7F00FFFF
const fadeDyeTier1SeymourHighlightColor = [127, 0, 255, 255] // #7F00FFFF
const fadeDyeTier2SeymourHighlightColor = [127, 0, 255, 255] // #7F00FFFF
const valuableWrongPieceTier0SeymourHighlightColor = [127, 0, 0, 255] // #7F0000FF
const valuableWrongPieceTier1SeymourHighlightColor = [127, 0, 0, 255] // #7F0000FF
const valuableWrongPieceTier2SeymourHighlightColor = [127, 0, 0, 255] // #7F0000FF

const darkHexColorReadabilityBackgroundColor = [255, 255, 255, 127] // #FFFFFF7F

export const seymourHighlightPriorityList = [
    ["§aPerfect Match", "perfectMatch"],
    ["§aMatching Style", "matchingStyle"],
    ["§aDuplicate Hex", "duplicateHex"],
    ["§aCustom Hexes Tier 0", "customHexesTier0"],
    ["§aCustom Hexes Tier 1", "customHexesTier1"],
    ["§aCustom Hexes Tier 2", "customHexesTier2"],
    ["§aCustom Wildcard Hexes", "customWildcardHexes"],
    ["§aValuable Right Piece Tier 0", "valuableRightPieceTier0"],
    ["§aValuable Right Piece Tier 1", "valuableRightPieceTier1"],
    ["§aValuable Right Piece Tier 2", "valuableRightPieceTier2"],
    ["§aCustom Words", "customWord"],
    ["§aMatching Word", "matchingWord"],
    ["§aOwned Signature", "ownedSignature"],
    ["§aFade Dye Tier 0", "fadeDyeTier0"],
    ["§aFade Dye Tier 1", "fadeDyeTier1"],
    ["§aFade Dye Tier 2", "fadeDyeTier2"],
    ["§aValuable Wrong Piece Tier 0", "valuableWrongPieceTier0"],
    ["§aValuable Wrong Piece Tier 1", "valuableWrongPieceTier1"],
    ["§aValuable Wrong Piece Tier 2", "valuableWrongPieceTier2"],
]
export const seymourLorePriorityList = [
    ["§aPerfect Match", "perfectMatch"],
    ["§aMatching Style", "matchingStyle"],
    ["§aDuplicate Hex", "duplicateHex"],
    ["§aCustom Hexes", "customHexes"],
    ["§aCustom Wildcard Hexes", "customWildcardHexes"],
    ["§aValuable Right Piece", "valuableRightPiece"],
    ["§aCustom Words", "customWords"],
    ["§aMatching Word", "matchingWord"],
    ["§aOwned Signature", "ownedSignature"],
    ["§aFade Dye", "fadeDyes"],
    ["§aValuable Wrong Piece", "valuableWrongPiece"],
]

const itemDisplayDecayTypeList = [
    "§aLobby Join",
    "§bTimer"
]

const exoticDatabaseCountsDatabaseList = [
    "§fNo Dupes",
    "§bFull with Potential Dupes",
    "§aBoth",
]

const playerTrackerAlertTypeStringList = [
    "§bTitle & Chat Message",
    "§fTitle Only",
    "§eChat Message Only",
]

const seymourFoundSavedFilePiecesList = [
    "§eAll Pieces",
    "§bValuable Pieces Only",
    "§cNo Pieces",
]

function AddLegacySettings(
    settingsObject,
    varname,
    reforgeName,
    subcategory,
    placeholder,
    isLegacy = false,
    isGhost = false,
    isAccessory = false,
    isFarming = false,
    optionsList = legacySelectorTypeList,
    isSwitch = false,
) {
    const prettyReforgeName = ZCore.TitleCase(reforgeName.toLowerCase())
    const reforgeNameColor = "§b"

    const requiresList = []
    if (isLegacy) {
        requiresList.push({"toggleLegacyScanning": true})
    }
    if (isGhost && !isFarming) {
        requiresList.push({"toggleGhostScanning": true})
    }
    if (isAccessory) {
        requiresList.push({"toggleTalismanScanning": true})
        isSwitch = true
    }
    if (isFarming && !isGhost) {
        requiresList.push({"toggleLegacyFarmingToolsScanning": true})
        isSwitch = true
    }
    if (isFarming && isGhost) {
        requiresList.push({"toggleGhostExFarmingToolsScanning": true})
        isSwitch = true
    }

    const settingOptions = {
        varname: varname,
        group: "Scanner",
        category: "Legacy Reforges",
        subcategory: subcategory,
        name: prettyReforgeName,
        description: `§7Whether ${reforgeNameColor}${prettyReforgeName} §7reforged items are marked.`,
        placeholder: placeholder,
        requires: requiresList,
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    }

    let blacklistRequiresList = [...requiresList]
    let whitelistRequiresList = [...requiresList]
    if (isSwitch) {
        settingsObject.addSwitch(settingOptions)
        blacklistRequiresList.push({[`${varname}`]: true})
        whitelistRequiresList.push({[`${varname}`]: true})
    } else {
        settingOptions.options = optionsList
        settingsObject.addDropDown(settingOptions)
        blacklistRequiresList.push({[`${varname}`]: 8})
        whitelistRequiresList.push({[`${varname}`]: 9})
    }

    settingsObject
        .addUnorderedList({
            varname: `${varname}Blacklist`,
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: subcategory,
            name: `${prettyReforgeName} Blacklist`,
            description: `§7Blacklist for what ${reforgeNameColor}${prettyReforgeName} §7reforged items are marked.`,
            options: [],
            requires: blacklistRequiresList,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
            extra: {
                editable: true,
                minimumHeight: 1,
            },
        })
        .addUnorderedList({
            varname: `${varname}Whitelist`,
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: subcategory,
            name: `${prettyReforgeName} Whitelist`,
            description: `§7Whitelist for what ${reforgeNameColor}${prettyReforgeName} §7reforged items are marked.`,
            options: [],
            requires: whitelistRequiresList,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
            extra: {
                editable: true,
                minimumHeight: 1,
            },
        })
}

function StartDelayedUpdate() {
    ZCore.StartDelayedCallback("settingsUpdate", 250, () => {
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    })
}
function TryRunKeybind(keybindName) {
    if (_keybindCallback) {
        _keybindCallback(keybindName)
    }
}

export const ZSettings = new ZConfigSettings(`${Data.modulePrefixU} Settings`, `${Data.modulePrefixU}`, `Output/.${Data.modulePrefixU}Settings.json`)
    .addGroupSorter((a, b) => {
        return groups.indexOf(a[0]) - groups.indexOf(b[0])
    })
    .addCategorySorter((a, b) => {
        return categories.indexOf(a[0]) - categories.indexOf(b[0])
    })
    .addSubcategorySorter((a, b) => {
        return subcategories.indexOf(a[0]) - subcategories.indexOf(b[0])
    })

    // Update -> Update
    .addButton({
        varname: "installLatestUpdateButton",
        group: "Update",
        category: "Update",
        name: `Update ${Data.modulePrefix}`,
        description: (option) => {
            let finalString = ""
            const updateData = Data.data.updateData || {}
            if (updateData.versionString) {
                finalString += `§6${Data.modulePrefix} v${updateData.versionString}`
            }
            if (updateData.mods) {
                if (finalString) {
                    finalString += "\n\n"
                }
                const updateList = []
                Object.entries(updateData.mods).forEach(([modName, modData]) => {
                    updateList.push(`${modName} §7(§ev${modData.versionString}§7)`)
                })
                finalString += `Mods:\n§e${updateList.join("§7, §e")}`
            }
            if (updateData.dependencies) {
                if (finalString) {
                    finalString += "\n\n"
                }
                const updateList = []
                Object.entries(updateData.dependencies).forEach(([dependencyName, dependencyData]) => {
                    updateList.push(`${ZCore.TitleCase(dependencyName)} §7(§ev${dependencyData.versionString}§7)`)
                })
                finalString += `Dependencies:\n§a${updateList.join("§7, §a")}`
            }
            if (updateData.versionString) {
                if (finalString) {
                    finalString += "\n\n"
                }
                finalString += updateData.changelog || "No changelog available."
            }
            return finalString
        },
        placeholder: "Update",
        hideIf: (value) => {
            const optionData = Data.data.updateData || {}
            return Object.keys(optionData).length == 0
        },
        onPress: () => {
            try {
                if (_installStagedUpdateCallback) {
                    _installStagedUpdateCallback()
                }
            } catch (e) {
                Data.moduleChat(`§cError installing ${Data.modulePrefix} v${Data.data.updateData.versionString}§c: §c${e} | ${e.stack}`)
            }
        }
    })
    .setCategoryDescription("Update",
        `Update and install the latest version of ${Data.modulePrefix}.\n§c§lAutomatic updates are now disabled.`
    )

    // Scanner -> API Scanning -> Extra Features
    .addSwitch({
        varname: "toggleNetworthScanning",
        group: "Scanner",
        category: "API Scanning",
        subcategory: "Extra Features",
        name: "Toggle Networth Scanning",
        description: "Toggles whether player networth is calculated when scanning players.\n§cMay cause scanning delay when enabled.",
        placeholder: false,
    })
    .addSwitch({
        varname: "toggleIronmanProfileScanning",
        group: "Scanner",
        category: "API Scanning",
        subcategory: "Extra Features",
        name: "Toggle Showing Ironman Profiles",
        description: "Toggles showing ironman profiles.",
        placeholder: false,
    })










    // Scanner -> World Scanning -> Global
    .addSwitch({
        varname: "toggleAllWorldScanning",
        group: "Scanner",
        category: "World Scanning",
        subcategory: "Global ",
        name: "Toggle All World Scanning",
        description: "Toggles all world scanning options.",
        placeholder: true,
    })

    // Scanner -> World Scanning -> Player Scanning
    .addSwitch({
        varname: "scanPlayerEquippedItems",
        group: "Scanner",
        category: "World Scanning",
        subcategory: "Player Scanning",
        name: "Toggle Player Equipped Items Scanning",
        description: "Toggles scanning players equipped items.",
        placeholder: true,
        requires: [
            {"toggleAllWorldScanning": true},
        ],
    })

    // Scanner -> World Scanning -> Island Scanning
    .addSwitch({
        varname: "toggleIslandScanning",
        group: "Scanner",
        category: "World Scanning",
        subcategory: "Island Scanning",
        name: "Toggle Private Island Scanning",
        description: "Toggles scanning of Armor Stands and Item Frames.",
        placeholder: true,
        requires: [
            {"toggleAllWorldScanning": true},
        ],
    })
    .addSwitch({
        varname: "toggleSelfIslandScanning",
        group: "Scanner",
        category: "World Scanning",
        subcategory: "Island Scanning",
        name: "Toggle Scanning Own Island",
        description: "Toggles scanning on your own island.",
        placeholder: true,
        requires: [
            {"toggleAllWorldScanning": true},
            {"toggleIslandScanning": true},
        ],
    })
    .addSwitch({
        varname: "toggleShowingIslandScannedItemChatMessages",
        group: "Scanner",
        category: "World Scanning",
        subcategory: "Island Scanning",
        name: "Toggle Scanned Item Chat Messages",
        description: "Toggles showing chat messages for scanned island items.",
        placeholder: false,
        requires: [
            {"toggleAllWorldScanning": true},
            {"toggleIslandScanning": true},
        ],
    })










    // Scanner -> Scanned Items -> Filters
    .addSwitch({
        varname: "toggleSoulboundScanning",
        group: "Scanner",
        category: "Scanned Items",
        subcategory: "Filters",
        name: "Toggle Scanning Soulbound Items",
        description: "Toggles scanning soulbound items.",
        placeholder: false,
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Scanner -> Seymour -> Toggles
    .addSwitch({
        varname: "toggleSeymourScanning",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Toggle Seymour Armor Scanning",
        description: "Toggles Seymour Armor Scanning.",
        placeholder: true,
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addCheckbox({
        varname: "seymourScanningCielabSelector",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Color Difference Version",
        description: "Select the CIELAB version to use for Seymour scanning.\n§fCIE 76 §7is more commonly used§7, §bCIEDE 2000 §7gives more accurate results.",
        options: SeymourExtractor.cielabVersionOptions,
        placeholder: [
            "CIE_76",
        ],
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "onlyMarkPossibleSeymourPieces",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Only Mark Right Piece Seymour Pieces",
        description: "Only mark Seymour hexes on the right pieces as valuable.\n(E.g. a boots color on boots, but not boots color on helmet)",
        placeholder: true,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "seymourAlwaysMarkWrongPiecePerfectMatches",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Always Mark Wrong Piece Perfect Match Seymour Pieces",
        description: "Always mark wrong piece perfect match Seymour pieces.\n(E.g. a 1:1 leggings color on a chestplate)",
        placeholder: true,
        requires: [
            {"toggleSeymourScanning": true},
            {"onlyMarkPossibleSeymourPieces": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "seymourAlwaysMarkFadeDyePerfectMatches",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Always Mark Fade Dye Perfect Match Seymour Pieces",
        description: "Always mark fade dye perfect match Seymour pieces.",
        placeholder: true,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "seymourMarkMatchingStyles",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Mark Special Seymour Hexes",
        description: "Mark special seymour hexes as valuable.\n(AAABBB, ABCABC, AABBCC, etc.)",
        placeholder: true,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addDropDown({
        varname: "seymourFoundSavedFilePieces",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Toggles ",
        name: "Save Found Seymour Pieces to File",
        description: "Changes which pieces are saved.",
        options: seymourFoundSavedFilePiecesList,
        placeholder: 0,
        requires: [
            {"toggleSeymourScanning": true},
        ],
    })

    // Scanner -> Seymour -> Tolerances
    .addSlider({
        varname: "seymourScanningAbsoluteDifferenceTolerance",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Tolerances",
        name: "Seymour Absolute Difference Tolerance",
        description: "The absolute difference tolerance for Seymour Scanning.\n§cLower Value = More similar colors.\n§aDefault = 5",
        options: [
            0,
            50,
        ],
        increment: 1,
        placeholder: 5,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourScanningVisualDistanceToleranceCIE_76",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Tolerances",
        name: "Seymour Visual Distance Tolerance §7(§fCIE 76§7)",
        description: "The visual distance tolerance for Seymour scanning using CIE 76.\n§cLower Value = More similar colors.\n§aDefault = 2.00",
        options: [
            0.00,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 2.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIE_76")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourScanningVisualDistanceToleranceCIEDE_2000",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Tolerances",
        name: "Seymour Visual Distance Tolerance §7(§bCIEDE 2000§7)",
        description: "The visual distance tolerance for Seymour scanning using CIEDE 2000.\n§cLower Value = More similar colors.\n§aDefault = 1.00",
        options: [
            0.00,
            6.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 1.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIEDE_2000")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Scanner -> Seymour -> Custom Seymour
    .addSwitch({
        varname: "toggleCustomSeymourWordScanning",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Custom Seymour",
        name: "Toggle Custom Seymour Word Scanning",
        description: "Toggles custom seymour word scanning.",
        placeholder: false,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleCustomSeymourHexScanning",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Custom Seymour",
        name: "Toggle Custom Seymour Hex Scanning",
        description: "Toggles custom seymour hex scanning.",
        placeholder: false,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "customSeymourHexAbsoluteDifferenceTolerance",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Custom Seymour",
        name: "Custom Seymour Absolute Difference Tolerance",
        description: "The absolute difference tolerance for Custom Seymour Scanning.\n§cLower Value = More similar colors.\n§aDefault = 5",
        options: [
            0,
            50,
        ],
        increment: 1,
        placeholder: 5,
        requires: [
            {"toggleSeymourScanning": true},
            {"toggleCustomSeymourHexScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "customSeymourHexVisualDistanceToleranceCIE_76",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Custom Seymour",
        name: "Custom Seymour Visual Distance Tolerance §7(§fCIE 76§7)",
        description: "The visual distance tolerance for custom Seymour scanning using CIE 76.\n§cLower Value = More similar colors.\n§aDefault = 2.00",
        options: [
            0.00,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 2.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"toggleCustomSeymourHexScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIE_76")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "customSeymourHexVisualDistanceToleranceCIEDE_2000",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Custom Seymour",
        name: "Custom Seymour Visual Distance Tolerance §7(§bCIEDE 2000§7)",
        description: "The visual distance tolerance for custom Seymour scanning using CIEDE 2000.\n§cLower Value = More similar colors.\n§aDefault = 2.00",
        options: [
            0.00,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 2.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"toggleCustomSeymourHexScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIEDE_2000")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Scanner -> Seymour -> Words
    .addCheckbox({
        varname: "seymourWordTypeSelection",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Words",
        name: "Word Type Selection",
        description: "Select the word types to scan for.",
        options: SeymourExtractor.wordTypeOptions,
        placeholder: [
            "realWords",
            "otherWords",
        ],
        requires: [
            {"toggleSeymourScanning": true},
        ],
        extra: {
            selection: true
        },
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourMinimumMatchingWordLength",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Words",
        name: "Marked Words Minimum Length",
        description: "The minimum length of marked words to scan for.\n§aDefault = 4",
        options: [
            3,
            6,
        ],
        increment: 1,
        placeholder: 4,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourWordTypeSelection": (option) => {
                return option.length > 0
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "seymourMarkMatchingSignatures",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Signatures",
        name: "Mark Seymour With Owned Signatures",
        description: "Whether to mark seymour with owned signatures as valuable.\n(AxBxCx, FxFxFx, etc.)",
        placeholder: false,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourMinimumMatchingSignatureCount",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Signatures",
        name: "Seymour Required Matching Signature Count",
        description: "The amount of pieces with matching signatures required to mark as valuable.\n§aDefault = 2",
        options: [
            1,
            3,
        ],
        increment: 1,
        placeholder: 2,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourMarkMatchingSignatures": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Scanner -> Seymour -> Fade Dyes
    .addSwitch({
        varname: "seymourToggleFadeDyeScanning",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Fade Dyes",
        name: "Toggle Fade Dye Scanning",
        description: "Toggles scanning for fade dyes. (Rose, Lucky, Ocean, etc.)",
        placeholder: false,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourFadeDyeAbsoluteDifferenceTolerance",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Fade Dyes",
        name: "Fade Dye Absolute Difference Tolerance",
        description: "The absolute difference tolerance for Fade Dye Seymour Scanning.\n§cLower Value = More similar colors.\n§aDefault = 5",
        options: [
            0,
            50,
        ],
        increment: 1,
        placeholder: 3,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourToggleFadeDyeScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourFadeDyeVisualDistanceToleranceCIE_76",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Fade Dyes",
        name: "Fade Dye Visual Distance Tolerance §7(§fCIE 76§7)",
        description: "The visual distance tolerance for Fade Dye Seymour scanning using CIE 76.\n§cLower Value = More similar colors.\n§aDefault = 2.00",
        options: [
            0.00,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 1.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourToggleFadeDyeScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIE_76")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourFadeDyeVisualDistanceToleranceCIEDE_2000",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Fade Dyes",
        name: "Fade Dye Visual Distance Tolerance §7(§bCIEDE 2000§7)",
        description: "The visual distance tolerance for Fade Dye Seymour scanning using CIEDE 2000.\n§cLower Value = More similar colors.\n§aDefault = 2.00",
        options: [
            0.00,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 1.00,
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourToggleFadeDyeScanning": true},
            {"seymourScanningCielabSelector": (option) => {
                return option.includes("CIEDE_2000")
            }},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addCheckbox({
        varname: "seymourFadeDyeSelection",
        group: "Scanner",
        category: "Seymour",
        subcategory: "Fade Dyes",
        name: "Fade Dye Selection",
        description: "Select the fade dyes to scan for.",
        options: SeymourExtractor.fadeDyesList,
        placeholder: SeymourExtractor.fadeDyesList.map(([prettyName, varName]) => varName),
        requires: [
            {"toggleSeymourScanning": true},
            {"seymourToggleFadeDyeScanning": true},
        ],
        extra: {
            selection: true
        },
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Scanner -> Chat Messages
    .addSwitch({
        varname: "toggleShowProfileTimestampInScanMessage",
        group: "Scanner",
        category: "Chat Messages",
        name: "Toggle Profile Timestamp",
        description: "Toggles the display of profile timestamps in scan messages.",
        placeholder: false,
    })
    .addList({
        varname: "apiScanActionsChatMessageSelector",
        group: "Scanner",
        category: "Chat Messages",
        name: "API Scan Actions Chat Message Selector",
        description: "Change the actions message that gets shown for API scans.",
        options: [
            ["§aParty", "party"],
            ["§aFriend", "friend"],
            ["§aMessage", "message"],
            ["§aIsland Invite", "invite"],
            ["§aVisit", "visit"],
            ["§aPV", "pv"],
        ],
        placeholder: {
            "party": 0,
            "friend": 1,
            "message": 2,
            "invite": 3,
            "visit": 4,
            "pv": 5,
        },
    })
    .addList({
        varname: "apiScanWebsitesChatMessageSelector",
        group: "Scanner",
        category: "Chat Messages",
        name: "API Scan Websites Chat Message Selector",
        description: "Change the websites message that gets shown for API scans.",
        options: [
            ["§aSkyCrypt", "skycrypt"],
            ["§aPlancke", "plancke"],
            ["§aNameMC", "namemc"],
        ],
        placeholder: {
            "skycrypt": 0,
            "plancke": 1,
            "namemc": 2,
        },
    })
    .addList({
        varname: "apiScanExtrasChatMessageSelector",
        group: "Scanner",
        category: "Chat Messages",
        name: "API Scan Extras Chat Message Selector",
        description: "Change the extras message that gets shown for API scans.",
        options: [
            ["§aAll Requests", "allrequests"],
            ["§aDuel", "duel"],
            ["§aTracer", "tracer"],
        ],
        placeholder: {
            "allrequests": 0,
            "duel": 1,
            "tracer": 2,
        },
    })










    // Render -> Highlights -> Global
    .addSwitch({
        varname: "allItemHighlightsOverride",
        group: "Render",
        category: "Highlights",
        subcategory: "Global",
        name: "Toggle All Highlights",
        description: "Toggles all highlights.",
        placeholder: true,
    })

    // Render -> Highlights -> Seymour
    .addSwitch({
        varname: "valuablePossibleSeymourArmorHighlight",
        group: "Render",
        category: "Highlights",
        subcategory: "Seymour  ",
        name: "Toggle Valuable Right Piece Seymour Highlights",
        description: "Toggles valuable right piece seymour highlights.",
        placeholder: true,
        requires: [
            {"allItemHighlightsOverride": true},
            {"toggleSeymourScanning": true},
        ],
    })
    .addSwitch({
        varname: "valuableNotPossibleSeymourArmorHighlight",
        group: "Render",
        category: "Highlights",
        subcategory: "Seymour  ",
        name: "Toggle Valuable Wrong Piece Seymour Highlights",
        description: "Toggles valuable wrong piece seymour highlights.",
        placeholder: true,
        requires: [
            {"allItemHighlightsOverride": true},
            {"toggleSeymourScanning": true},
        ],
    })
    .addSwitch({
        varname: "markedWordSeymourArmorHighlight",
        group: "Render",
        category: "Highlights",
        subcategory: "Seymour  ",
        name: "Toggle Marked Word Seymour Highlights",
        description: "Toggles marked word seymour piece highlights.",
        placeholder: true,
        requires: [
            {"allItemHighlightsOverride": true},
            {"toggleSeymourScanning": true},
        ],
    })
    .addSwitch({
        varname: "ownedSignatureSeymourArmorHighlight",
        group: "Render",
        category: "Highlights",
        subcategory: "Seymour  ",
        name: "Toggle Owned Signature Seymour Highlights",
        description: "Toggles owned signature seymour piece highlights.",
        placeholder: true,
        requires: [
            {"allItemHighlightsOverride": true},
            {"toggleSeymourScanning": true},
        ],
    })
    .addList({
        varname: "seymourHighlightPriority",
        group: "Render",
        category: "Highlights",
        subcategory: "Seymour  ",
        name: "Seymour Highlight Priority",
        description: "The priority of seymour highlights.",
        options: seymourHighlightPriorityList,
        requires: [
            {"allItemHighlightsOverride": true},
            {"toggleSeymourScanning": true},
        ],
    })











    // Render -> Tooltips/Lore -> Global
    .addSwitch({
        varname: "allLoreModificationsOverride",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Global",
        name: "Toggle All Lore Modifications",
        description: "Toggles all lore modifications.",
        placeholder: true,
    })

    // Render -> Tooltips/Lore -> Database Counts
    .addSwitch({
        varname: "toggleExoticDatabaseCountsDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Exotic Database Counts Display",
        description: "Toggles showing exotic database counts for scanned items.",
        placeholder: true,
    })
    .addDropDown({
        varname: "toggleExoticDatabaseCountsDatabaseSelector",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Exotic Database Counts Database Selector",
        description: "Select the database to use for exotic item counts.",
        options: exoticDatabaseCountsDatabaseList,
        placeholder: 0,
        hideIf: (value) => {
            return !ZSettings.toggleExoticDatabaseCountsDisplay && !ZSettings.toggleExoticDatabaseCountsLoreDisplay
        }
    })
    .addSwitch({
        varname: "toggleCrystalDatabaseCountsDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Crystal/Fairy Database Counts Display",
        description: "Toggles showing crystal/fairy database counts for scanned items.",
        placeholder: true,
    })
    .addSlider({
        varname: "toggleCrystalDatabaseCountsThreshold",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Crystal/Fairy Database Counts Display",
        description: "The maximum database count required to show crystal/fairy database counts for scanned items.\n§a0 = No Limit",
        options: [
            0,
            1000,
        ],
        increment: 10,
        placeholder: 0,
        requires: [
            {"toggleCrystalDatabaseCountsDisplay": true},
        ],
    })
    .addSwitch({
        varname: "toggleBleachedDatabaseCountsDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Bleached Database Counts Display",
        description: "Toggles showing bleached database counts for scanned items.",
        placeholder: true,
    })
    .addSlider({
        varname: "toggleBleachedDatabaseCountsThreshold",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Bleached Database Counts Display",
        description: "The maximum database count required to show bleached database counts for scanned items.\n§a0 = No Limit§",
        options: [
            0,
            2500,
        ],
        increment: 25,
        placeholder: 0,
        requires: [
            {"toggleBleachedDatabaseCountsDisplay": true},
        ],
    })
    .addSwitch({
        varname: "toggleExoticDatabaseCountsLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Exotic Database Counts Lore Display",
        description: "Toggles showing exotic database counts in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleCrystalDatabaseCountsLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Crystal Database Counts Lore Display",
        description: "Toggles showing crystal database counts in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleBleachedDatabaseCountsLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Database Counts",
        name: "Toggle Bleached Database Counts Lore Display",
        description: "Toggles showing bleached database counts in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })

    // Render -> Tooltips/Lore -> Scanned Items
    .addSwitch({
        varname: "toggleItemScuffedDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Item Scuffed Display",
        description: "Toggles showing item scuffness for scanned items.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleItemReforgeDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Item Reforge Display",
        description: "Toggles showing item reforges for scanned items.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleItemColorHints",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Pure/True Color Hints",
        description: "Toggles showing pure/true color hints for scanned items.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleHexColorRecipeHints",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Hex Color Recipes Hints",
        description: "Toggles showing simple hex code recipes for scanned items.\n(e.g. #7F7FFF (+1 WHITE))",
        placeholder: false,
    })
    .addSwitch({
        varname: "toggleSkinPriceDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Skin Price Display",
        description: "Toggles showing skin prices for scanned items.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleCakeValueDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Scanned Items",
        name: "Toggle Scanned Cake Value Display",
        description: "Toggles showing cake values for scanned items.",
        placeholder: true,
    })

    // Render -> Tooltips/Lore -> Seymour
    .addSwitch({
        varname: "toggleSeymourCloseArmorLore",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Seymour ",
        name: "Toggle Close Seymour Armor Lore Display",
        description: "Toggles close seymour armors in item lore.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSlider({
        varname: "seymourMaxMatchingItems",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Seymour ",
        name: "Seymour Max Matching Items",
        description: "The maximum amount of matching items to show in item lore.\n§aDefault = 3",
        options: [
            1,
            10,
        ],
        increment: 1,
        placeholder: 3,
        requires: [
            {"allLoreModificationsOverride": true},
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addList({
        varname: "seymourLorePriority",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Seymour ",
        name: "Seymour Value Lore Priority",
        description: "Change the priority of seymour in item lore.",
        options: seymourLorePriorityList,
        requires: [
            {"toggleSeymourScanning": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    // .addList({
    //     varname: "seymourCielabPriority",
    //     group: "Render",
    //     category: "Tooltips/Lore",
    //     subcategory: "Seymour ",
    //     name: "Seymour CIELAB Priority",
    //     description: "Change the priority of CIELAB types in item lore.",
    //     options: seymourCielabPriorityList,
    //     placeholder: {},
    //     requires: [
    //         {"toggleSeymourScanning": true},
    //     ],
    //     onValueChanged: (option, oldValue, newValue) => {
    //         StartDelayedUpdate()
    //     },
    // })

    // Render -> Tooltips/Lore -> Lore
    .addSwitch({
        varname: "legacyReforgeNameDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Reforges Item Name Display",
        description: "Toggles legacy item reforges being shown in item names.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "legacyReforgeLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Reforges Item Lore Display",
        description: "Toggles legacy item reforges being shown in item lore.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleHexCodeLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Hex Code Lore Display",
        description: "Toggles showing hex codes in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleHexCodeTagsLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Dyed Armor Type Lore Display",
        description: "Toggles showing dyed armor type in the tooltip display.\n(e.g. GLITCHED, CRYSTAL, OG FAIRY, etc.)",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "togglePureColorLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Pure Color Lore Display",
        description: "Toggles showing pure colors in the tooltip display.\n(e.g. #993333 (PURE RED))",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleTrueColorLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle True Color Lore Display",
        description: "Toggles showing true colors in the tooltip display.\n(e.g. #86D28D (TRUE MINT))",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleHexColorRecipeLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Hex Color Recipe Lore Display",
        description: "Toggles showing simple hex code recipes in the tooltip display.\n(e.g. #7F7FFF (+1 WHITE))",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleSkinPriceLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Skin Price Lore Display",
        description: "Toggles showing skin prices in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleCakeValueLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Cake Value Lore Display",
        description: "Toggles showing cake values in the tooltip display.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "itemTimestampDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Item Timestamp Display",
        description: "Toggles item dates and timestamps in item lore.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "itemDetailedTimestampDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Unix Timestamp Display",
        description: "Toggles unix timestamps in item lore.",
        placeholder: false,
        requires: [
            {"allLoreModificationsOverride": true},
            {"itemTimestampDisplay": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })
    .addSwitch({
        varname: "toggleDarkHexColorReadability",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Toggle Dark Hex Color Highlights",
        description: "Toggles dark hex color highlights in item lore.",
        placeholder: true,
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            if (!DarkHexColorReadabilityOptionsLoaded) {
                Data.moduleChat(`&a${Data.modulePrefix} Mixins not installed, please install them to use this feature.`)
                return
            }
            UpdateDarkHexColorReadabilityIsEnabled(newValue)
        },
    })
    .addSlider({
        varname: "darkHexColorReadabilityTolerance",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Dark Hex Readability Tolerance",
        description: "Controls the tolerance for dark hex color highlights in item lore.\n§aDefault = 0.10",
        options: [
            0.00,
            1.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.05,
        placeholder: 0.10,
        requires: [
            {"allLoreModificationsOverride": true},
            {"toggleDarkHexColorReadability": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            if (!DarkHexColorReadabilityOptionsLoaded) {
                Data.moduleChat(`§a${Data.modulePrefix} Mixins not installed, please install them to use this feature.`)
                return
            }
            UpdateDarkHexColorReadabilityLuminance(newValue)
        },
    })
    .addColorPicker({
        varname: "darkHexColorReadabilityBackgroundColor",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Dark Hex Color Readability Background Color",
        description: "Background color for dark hex color readability in item lore.",
        allowAlpha: true,
        placeholder: darkHexColorReadabilityBackgroundColor,
        requires: [
            {"allLoreModificationsOverride": true},
            {"toggleDarkHexColorReadability": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            if (!DarkHexColorReadabilityOptionsLoaded) {
                Data.moduleChat(`§a${Data.modulePrefix} Mixins not installed, please install them to use this feature.`)
                return
            }
            UpdateDarkHexColorReadabilityBackgroundColor(newValue)
        },
    })
    .addCheckbox({
        varname: "miscCollectableValuableReasonsLoreDisplay",
        group: "Render",
        category: "Tooltips/Lore",
        subcategory: "Lore",
        name: "Misc Valuable Reasons Lore Display",
        description: "Toggles showing valuable reasons in item lore for misc collectables.",
        options: Constants.miscCollectableLoreTypeList,
        placeholder: Constants.miscCollectableLoreTypeList
            .filter(([_, varName, enabled]) => enabled ?? true)
            .map(([_, varName]) => varName),
        requires: [
            {"allLoreModificationsOverride": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            StartDelayedUpdate()
        },
    })










    // Render -> World Scanning -> Toggles
    .addSwitch({
        varname: "toggleAllRendering",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Global",
        name: "Toggle All Rendering",
        description: "Toggles all rendering options.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleScannedItemsTracers",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Toggles  ",
        name: "Toggle Rendering Scanned Items",
        description: "Toggles tracers, hitboxes, and display names for scanned items.",
        placeholder: true,
        requires: [
            {"toggleAllRendering": true},
        ],
    })
    .addSwitch({
        varname: "toggleScannedPlayersTracers",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Toggles  ",
        name: "Toggle Rendering Scanned Players",
        description: "Toggles tracers, hitboxes, and display names for scanned players.",
        placeholder: true,
        requires: [
            {"toggleAllRendering": true},
        ],
    })

    // Render -> World Scanning -> Scales
    .addSlider({
        varname: "hitboxScale",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Scales",
        name: "Hitbox Scale",
        description: "Controls the scale of hitboxes for scanned island items.\n§aDefault = 2.00",
        options: [
            0.10,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.25,
        placeholder: 2.00,
        requires: [
            {"toggleAllRendering": true},
        ],
    })
    .addSlider({
        varname: "nameScale",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Scales",
        name: "Name Scale",
        description: "Controls the scale of display names for scanned island items.\n§aDefault = 0.50",
        options: [
            0.10,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.25,
        placeholder: 1.00,
        requires: [
            {"toggleAllRendering": true},
        ],
    })
    .addSlider({
        varname: "tracerScale",
        group: "Render",
        category: "World Scanning ",
        subcategory: "Scales",
        name: "Tracer Scale",
        description: "Controls the scale of tracer lines for scanned island items.\n§aDefault = 2.00",
        options: [
            0.10,
            10.00,
        ],
        isDecimal: true,
        decimalPlaces: 2,
        increment: 0.25,
        placeholder: 2.00,
        requires: [
            {"toggleAllRendering": true},
        ],
    })










    // Render -> Colors -> World Scanning
    .addColorPicker({
        varname: "scannedItemColor",
        group: "Render",
        category: "Colors",
        subcategory: "World Scanning",
        name: "Scanned Item Display Color",
        description: "Color for tracers, hitboxes, and display names of scanned items.",
        allowAlpha: true,
        placeholder: worldScannedItemColor,
    })
    .addColorPicker({
        varname: "playerTracerColor",
        group: "Render",
        category: "Colors",
        subcategory: "World Scanning",
        name: "Scanned Player Tracer Display Color",
        description: "Color for tracers, hitboxes, and display names of scanned players.",
        allowAlpha: true,
        placeholder: worldScannedPlayerColor,
    })

    // Render -> Colors -> Seymour Highlight Colors
    .addColorPicker({
        varname: "perfectMatchSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Perfect Match Seymour Highlight Color",
        description: "Highlight color for perfect match Seymour pieces.",
        allowAlpha: false,
        placeholder: perfectMatchSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "matchingStyleSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Matching Style Seymour Highlight Color",
        description: "Highlight color for matching style Seymour pieces.",
        allowAlpha: false,
        placeholder: matchingStyleSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "duplicateHexSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Duplicate Hex Highlight Color",
        description: "Highlight color for Seymour pieces with duplicate hexes.",
        allowAlpha: false,
        placeholder: duplicateHexSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "customHexesTier0SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Custom Hex Tier 0 Highlight Color",
        description: "Highlight color for Tier 0 custom hex Seymour pieces.",
        allowAlpha: false,
        placeholder: customHexesTier0SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "customHexesTier1SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Custom Hex Tier 1 Highlight Color",
        description: "Highlight color for Tier 1 custom hex Seymour pieces.",
        allowAlpha: false,
        placeholder: customHexesTier1SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "customHexesTier2SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Custom Hex Tier 2 Highlight Color",
        description: "Highlight color for Tier 2 custom hex Seymour pieces.",
        allowAlpha: false,
        placeholder: customHexesTier2SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "customWildcardHexesSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Custom Wildcard Hex Highlight Color",
        description: "Highlight color for custom wildcard hex Seymour pieces.",
        allowAlpha: false,
        placeholder: customWildcardHexesSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableRightPieceTier0SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 0 Valuable Right Piece Seymour Highlight Color",
        description: "Highlight color for Tier 0 right piece valuable Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableRightPieceTier0SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableRightPieceTier1SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 1 Valuable Right Piece Seymour Highlight Color",
        description: "Highlight color for Tier 1 valuable right piece Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableRightPieceTier1SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableRightPieceTier2SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 2 Valuable Right Piece Seymour Highlight Color",
        description: "Highlight color for Tier 2 valuable right piece Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableRightPieceTier2SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "customWordSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Custom Word Highlight Color",
        description: "Highlight color for Seymour pieces with custom words.",
        allowAlpha: false,
        placeholder: customWordSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "matchingWordSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Matching Word Highlight Color",
        description: "Highlight color for Seymour pieces with valid words.",
        allowAlpha: false,
        placeholder: matchingWordSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "ownedSignatureSeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Seymour Owned Signature Highlight Color",
        description: "Highlight color for Seymour pieces with owned signatures.",
        allowAlpha: false,
        placeholder: ownedSignatureSeymourHighlightColor,
    })
    .addColorPicker({
        varname: "fadeDyeTier0SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 0 Fade Dye Seymour Highlight Color",
        description: "Highlight color for Tier 0 fade dye Seymour pieces.",
        allowAlpha: false,
        placeholder: fadeDyeTier0SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "fadeDyeTier1SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 1 Fade Dye Seymour Highlight Color",
        description: "Highlight color for Tier 1 fade dye Seymour pieces.",
        allowAlpha: false,
        placeholder: fadeDyeTier1SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "fadeDyeTier2SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 2 Fade Dye Seymour Highlight Color",
        description: "Highlight color for Tier 2 fade dye Seymour pieces.",
        allowAlpha: false,
        placeholder: fadeDyeTier2SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableWrongPieceTier0SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 0 Valuable Wrong Piece Seymour Highlight Color",
        description: "Highlight color for Tier 0 valuable wrong piece Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableWrongPieceTier0SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableWrongPieceTier1SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 1 Valuable Wrong Piece Seymour Highlight Color",
        description: "Highlight color for Tier 1 valuable wrong piece Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableWrongPieceTier1SeymourHighlightColor,
    })
    .addColorPicker({
        varname: "valuableWrongPieceTier2SeymourHighlightColor",
        group: "Render",
        category: "Colors",
        subcategory: "Seymour Highlight Colors",
        name: "Tier 2 Valuable Wrong Piece Seymour Highlight Color",
        description: "Highlight color for Tier 2 valuable wrong piece Seymour pieces.",
        allowAlpha: false,
        placeholder: valuableWrongPieceTier2SeymourHighlightColor,
    })

    // Render -> Colors -> Reset
    .addButton({
        varname: "resetAllHighlightColors",
        group: "Render",
        category: "Colors",
        subcategory: "Reset",
        name: "Reset All Highlight Colors",
        description: "Resets all highlight colors to default.",
        placeholder: "Reset Colors",
        onPress: () => {
            ZSettings.scannedItemColor = worldScannedItemColor
            ZSettings.playerTracerColor = worldScannedPlayerColor

            if (HasMainModInstalled()) {
                ZSettings.scannedSignColor = worldScannedSignColor
                ZSettings.valuableItemHighlightColor = valuableItemHighlightColor
                ZSettings.legacyReforgeHighlightColor = legacyReforgeHighlightColor
                ZSettings.ghostReforgeHighlightColor = ghostReforgeHighlightColor
            }

            ZSettings.perfectMatchSeymourHighlightColor = perfectMatchSeymourHighlightColor
            ZSettings.matchingStyleSeymourHighlightColor = matchingStyleSeymourHighlightColor
            ZSettings.duplicateHexSeymourHighlightColor = duplicateHexSeymourHighlightColor
            ZSettings.customHexesTier0SeymourHighlightColor = customHexesTier0SeymourHighlightColor
            ZSettings.customHexesTier1SeymourHighlightColor = customHexesTier1SeymourHighlightColor
            ZSettings.customHexesTier2SeymourHighlightColor = customHexesTier2SeymourHighlightColor
            ZSettings.customWildcardHexesSeymourHighlightColor = customWildcardHexesSeymourHighlightColor
            ZSettings.valuableRightPieceTier0SeymourHighlightColor = valuableRightPieceTier0SeymourHighlightColor
            ZSettings.valuableRightPieceTier1SeymourHighlightColor = valuableRightPieceTier1SeymourHighlightColor
            ZSettings.valuableRightPieceTier2SeymourHighlightColor = valuableRightPieceTier2SeymourHighlightColor
            ZSettings.customWordSeymourHighlightColor = customWordSeymourHighlightColor
            ZSettings.matchingWordSeymourHighlightColor = matchingWordSeymourHighlightColor
            ZSettings.ownedSignatureSeymourHighlightColor = ownedSignatureSeymourHighlightColor
            ZSettings.fadeDyeTier0SeymourHighlightColor = fadeDyeTier0SeymourHighlightColor
            ZSettings.fadeDyeTier1SeymourHighlightColor = fadeDyeTier1SeymourHighlightColor
            ZSettings.fadeDyeTier2SeymourHighlightColor = fadeDyeTier2SeymourHighlightColor
            ZSettings.valuableWrongPieceTier0SeymourHighlightColor = valuableWrongPieceTier0SeymourHighlightColor
            ZSettings.valuableWrongPieceTier1SeymourHighlightColor = valuableWrongPieceTier1SeymourHighlightColor
            ZSettings.valuableWrongPieceTier2SeymourHighlightColor = valuableWrongPieceTier2SeymourHighlightColor

            Client.currentGui.close()
            ZCore.ChatMessage("§aSuccessfully reset all highlight colors.")
        },
    })










    // Misc -> Keybinds -> Scanner
    .addKeybind({
        varname: "keybindToggleWorldScanning",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Scanner",
        name: "Toggle World Scanning",
        description: "Toggles world scanning.",
        onPress: () => {
            TryRunKeybind("keybindToggleWorldScanning")
        },
    })

    // Misc -> Keybinds -> Rendering
    .addKeybind({
        varname: "keybindToggleRendering",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Rendering",
        name: "Toggle Rendering",
        description: "Toggles rendering.",
        onPress: () => {
            TryRunKeybind("keybindToggleRendering")
        },
    })

    // Misc -> Keybinds -> Auction Scanner
    .addKeybind({
        varname: "keybindToggleAuctionScannerDisplayGUI",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Auction Scanner ",
        name: "Toggle Auction Scanner Display",
        description: "Toggles the auction scanner display.",
        onPress: () => {
            TryRunKeybind("keybindToggleAuctionScannerDisplayGUI")
        },
    })
    .addKeybind({
        varname: "keybindOpenLastAuction",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Auction Scanner ",
        name: "Open Last Auction",
        description: "Opens the last auction page.",
        placeholder: "KEY_INSERT",
        onPress: () => {
            TryRunKeybind("keybindOpenLastAuction")
        },
    })
    .addKeybind({
        varname: "keybindCycleToNextAuction",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Auction Scanner ",
        name: "Open Next Auction",
        description: "Opens the next auction page.",
        placeholder: "KEY_DELETE",
        onPress: () => {
            TryRunKeybind("keybindCycleToNextAuction")
        },
    })
    .addKeybind({
        varname: "keybindDeleteCurrentAuction",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Auction Scanner ",
        name: "Remove Current Auction",
        description: "Removes the current selected auction.",
        onPress: () => {
            TryRunKeybind("keybindDeleteCurrentAuction")
        },
    })

    // Misc -> Keybinds -> Item Display
    .addKeybind({
        varname: "keybindToggleItemDisplayGUI",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Item Display",
        name: "Toggle Item Display",
        description: "Toggles the item display.",
        placeholder: "KEY_NUMPAD0",
        onPress: () => {
            TryRunKeybind("keybindToggleItemDisplayGUI")
        },
    })
    .addKeybind({
        varname: "keybindItemDisplayGUIScrollUp",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Item Display",
        name: "Item Display Scroll Up",
        description: "Scrolls up in the item display.",
        placeholder: "KEY_UP",
        onPress: () => {
            TryRunKeybind("keybindItemDisplayGUIScrollUp")
        },
    })
    .addKeybind({
        varname: "keybindItemDisplayGUIScrollDown",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Item Display",
        name: "Item Display Scroll Down",
        description: "Scrolls down in the item display.",
        placeholder: "KEY_DOWN",
        onPress: () => {
            TryRunKeybind("keybindItemDisplayGUIScrollDown")
        },
    })
    .addKeybind({
        varname: "keybindItemDisplayGUIScrollLeft",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Item Display",
        name: "Item Display Scroll Left",
        description: "Scrolls left in the item display.",
        placeholder: "KEY_LEFT",
        onPress: () => {
            TryRunKeybind("keybindItemDisplayGUIScrollLeft")
        },
    })
    .addKeybind({
        varname: "keybindItemDisplayGUIScrollRight",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Item Display",
        name: "Item Display Scroll Right",
        description: "Scrolls right in the item display.",
        placeholder: "KEY_RIGHT",
        onPress: () => {
            TryRunKeybind("keybindItemDisplayGUIScrollRight")
        },
    })

    // Misc -> Keybinds -> Island Item Display
    .addKeybind({
        varname: "keybindToggleIslandItemDisplayGUI",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Island Item Display",
        name: "Toggle Island Item Display",
        description: "Toggles the island item display.",
        placeholder: "KEY_NUMPAD2",
        onPress: () => {
            TryRunKeybind("keybindToggleIslandItemDisplayGUI")
        },
    })

    // Misc -> Keybinds -> Worn Item Display
    .addKeybind({
        varname: "keybindToggleWornItemDisplayGUI",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Worn Item Display",
        name: "Toggle Worn Item Display",
        description: "Toggles the worn item display.",
        placeholder: "KEY_NUMPAD1",
        onPress: () => {
            TryRunKeybind("keybindToggleWornItemDisplayGUI")
        },
    })

    // Misc -> Keybinds -> Player Tracker Display
    .addKeybind({
        varname: "keybindTogglePlayerTrackerDisplayGUI",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Player Tracker Display ",
        name: "Toggle Player Tracker Display",
        description: "Toggles the player tracker display.",
        onPress: () => {
            TryRunKeybind("keybindTogglePlayerTrackerDisplayGUI")
        },
    })

    // Misc -> Keybinds -> Cycling Warp Hotkey
    .addKeybind({
        varname: "keybindCyclingWarpHotkey",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Cycling Warp Hotkey ",
        name: "Cycling Warp Hotkey",
        description: "Cycles between the selected warps.\nEvery time you press the keybind it will warp to the next selected location.",
        onPress: () => {
            TryRunKeybind("keybindCyclingWarpHotkey")
        },
    })

    // Misc -> Keybinds -> Warp Hotkeys
    .addKeybind({
        varname: "keybindWarpHotkey1",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 1",
        description: "Warps to location #1.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey1")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey2",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 2",
        description: "Warps to location #2.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey2")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey3",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 3",
        description: "Warps to location #3.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey3")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey4",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 4",
        description: "Warps to location #4.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey4")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey5",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 5",
        description: "Warps to location #5.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey5")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey6",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 6",
        description: "Warps to location #6.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey6")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey7",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 7",
        description: "Warps to location #7.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey7")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey8",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 8",
        description: "Warps to location #8.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey8")
        },
    })
    .addKeybind({
        varname: "keybindWarpHotkey9",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Warp Hotkeys ",
        name: "Warp Hotkey 9",
        description: "Warps to location #9.",
        onPress: () => {
            TryRunKeybind("keybindWarpHotkey9")
        },
    })

    // Misc -> Keybinds -> Other
    .addKeybind({
        varname: "keybindAuctionSeymourHelmet",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Other",
        name: "/ahs Velvet Top Hat",
        description: "Searchs for 'Velvet Top Hat'.",
        onPress: () => {
            TryRunKeybind("keybindAuctionSeymourHelmet")
        },
    })
    .addKeybind({
        varname: "keybindAuctionSeymourChestplate",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Other",
        name: "/ahs Cashmere Jacket",
        description: "Searchs for 'Cashmere Jacket'.",
        onPress: () => {
            TryRunKeybind("keybindAuctionSeymourChestplate")
        },
    })
    .addKeybind({
        varname: "keybindAuctionSeymourLeggings",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Other",
        name: "/ahs Satin Trousers",
        description: "Searchs for 'Satin Trousers'.",
        onPress: () => {
            TryRunKeybind("keybindAuctionSeymourLeggings")
        },
    })
    .addKeybind({
        varname: "keybindAuctionSeymourBoots",
        group: "Misc",
        category: "Keybinds",
        subcategory: "Other",
        name: "/ahs Oxford Shoes",
        description: "Searchs for 'Oxford Shoes'.",
        onPress: () => {
            TryRunKeybind("keybindAuctionSeymourBoots")
        },
    })










    // Misc -> Warp Hotkeys -> Warp Hotkeys
    .addList({
        varname: "warpHotkeyList",
        group: "Misc",
        category: "Warp Hotkeys",
        subcategory: "Warp Hotkeys",
        name: "Warp Hotkey List",
        description: "List of warp hotkeys.\nAdd new commands such as \`§b§o/warp end§r\`",
        options: [
            ["/warp hub",   "warp1"],
            ["/warp park",  "warp2"],
            ["/warp end",   "warp3"],
            ["/warp forge", "warp4"],
        ],
        extra: {
            lineIndices: true,
            editable: true,
        },
    })

    // Misc -> Warp Hotkeys -> Cycling Warp Hotkey
    .addCheckbox({
        varname: "cyclingWarpHotkeySelection",
        group: "Misc",
        category: "Warp Hotkeys",
        subcategory: "Cycling Warp Hotkey",
        name: "Cycling Warp Hotkey Selection",
        description: "Select which warps to cycle through when using the cycling warp hotkey.",
        options: [],
        requires: [
            {"warpHotkeyList": (value) => {
                return Object.values(value).some(v => v != null)
            }},
        ]
    })
    .runInOrder((config) => {
        const syncCheckboxOptions = () => {
            const listOption = config.data.allOptions.warpHotkeyList
            const checkboxOption = config.data.allOptions.cyclingWarpHotkeySelection
            if (!listOption || !checkboxOption) return

            const activeEntries = listOption.options
                .filter(opt => listOption.value[opt[1]] != null)
                .sort((a, b) => listOption.value[a[1]] - listOption.value[b[1]])

            checkboxOption.options = activeEntries.map(opt => [opt[0], opt[1]])

            if (!checkboxOption.extraPersistent) checkboxOption.extraPersistent = {}
            if (!checkboxOption.extraPersistent.knownKeys) {
                checkboxOption.extraPersistent.knownKeys = activeEntries.map(opt => opt[1])
            }
            const knownKeys = new Set(checkboxOption.extraPersistent.knownKeys)
            const activeKeys = new Set(activeEntries.map(opt => opt[1]))

            checkboxOption.value = checkboxOption.value.filter(key => activeKeys.has(key))

            activeEntries.forEach(opt => {
                if (!knownKeys.has(opt[1]) && !checkboxOption.value.includes(opt[1])) {
                    checkboxOption.value.push(opt[1])
                }
            })

            checkboxOption.placeholder = activeEntries.map(opt => opt[1])
            checkboxOption.extraPersistent.knownKeys = activeEntries.map(opt => opt[1])
            checkboxOption.changed = true
        }

        syncCheckboxOptions()
        config.registerListener("warpHotkeyList", syncCheckboxOptions)
    })










    // Misc -> AH Scanner -> Auction Scanner
    .addSwitch({
        varname: "toggleAuctionScanner",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Toggle Auction House Scanner",
        description: "Toggles the auction house scanner.",
        placeholder: false,
    })
    .addSlider({
        varname: "auctionScannerMaxItemPrice",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Auction Max Item Price",
        description: "The maximum price of items to display in millions.\n§a0 = Disabled",
        options: [
            0,
            1000,
        ],
        increment: 5,
        placeholder: 200,
        requires: [
            {"toggleAuctionScanner": true},
        ],
    })
    .addUnorderedList({
        varname: "auctionScannerItemWhitelist",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Auction Item Whitelist",
        description: `§7Whitelist for what auction items are scanned.`,
        options: [],
        requires: [
            {"toggleAuctionScanner": true},
        ],
        extra: {
            editable: true,
            minimumHeight: 1,
        },
    })
    .addUnorderedList({
        varname: "auctionScannerItemBlacklist",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Auction Item Blacklist",
        description: `§7Blacklist for what auction items are scanned.`,
        options: [],
        requires: [
            {"toggleAuctionScanner": true},
        ],
        extra: {
            editable: true,
            minimumHeight: 1,
        },
    })
    .addCheckbox({
        varname: "auctionScannerBidTypeSelector",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Auction Bid Type",
        description: "Select the bid type to use for auction scanning.",
        options: [
            ["§6BID", "BID"],
            ["§6BIN", "BIN"],
        ],
        placeholder: [
            "BID",
            "BIN",
        ],
        requires: [
            {"toggleAuctionScanner": true},
        ],
    })
    .addSlider({
        varname: "auctionScannerItemDecayTimerSeconds",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Scanner  ",
        name: "Auction Item Decay Time",
        description: "The decay time for auction items in seconds.\n§a0 = Disabled",
        options: [
            0,
            240,
        ],
        increment: 1,
        placeholder: 60,
        requires: [
            {"toggleAuctionScanner": true},
        ],
    })

    // Misc -> AH Scanner -> Auction Display
    .addSwitch({
        varname: "toggleAuctionScannerDisplayGUI",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Display",
        name: "Toggle Auction House Scanner Display",
        description: "Toggles the auction house scanner display.",
        placeholder: true,
        requires: [
            {"toggleAuctionScanner": true},
        ],
    })
    .addSwitch({
        varname: "toggleScanningEnablesAuctionScannerDisplayGUI",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Display",
        name: "Toggle Auction Scans Enabling Display",
        description: "Enables the auction display HUD when a new auction is scanned.",
        placeholder: true,
        requires: [
            {"toggleAuctionScanner": true},
            {"toggleAuctionScannerDisplayGUI": true},
        ],
    })
        .addSlider({
        varname: "auctionScannerDisplayGUIScale",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Display",
        name: "Auction Scanner Display Scale",
        description: "The scale of the auction scanner display HUD.",
        options: [
            0.1,
            5.0,
        ],
        isDecimal: true,
        decimalPlaces: 1,
        increment: 0.1,
        placeholder: 1.0,
        requires: [
            {"toggleAuctionScanner": true},
            {"toggleAuctionScannerDisplayGUI": true},
        ],
    })
    .addButton({
        varname: "moveAuctionScannerDisplayGUI",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Display",
        name: "Move Auction Scanner Display",
        description: "Moves the auction scanner display HUD.",
        placeholder: "Move GUI",
        requires: [
            {"toggleAuctionScanner": true},
            {"toggleAuctionScannerDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.auctionScannerDisplayGUIData.gui.open()
        },
    })
    .addButton({
        varname: "resetAuctionScannerDisplayPosition",
        group: "Misc",
        category: "AH Scanner",
        subcategory: "Auction Display",
        name: "Reset Auction Scanner Display Position",
        description: "Resets the auction scanner display HUD position.",
        placeholder: "Reset GUI",
        requires: [
            {"toggleAuctionScanner": true},
            {"toggleAuctionScannerDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.auctionScannerDisplayGUIData.resetPosition()
        },
    })










    // Misc -> Item Display
    .addSwitch({
        varname: "toggleItemDisplayGUI",
        group: "Misc",
        category: "Item Display",
        name: "Toggle Item Display",
        description: "Toggles the item display HUD.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleScanningEnablesItemDisplayGUI",
        group: "Misc",
        category: "Item Display",
        name: "Toggle Player Scans Enabling Display",
        description: "Enables the item display HUD when scanning players.",
        placeholder: true,
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "maxItemDisplayGUILength",
        group: "Misc",
        category: "Item Display",
        name: "Toggle Item Display Max Item Count",
        description: "The maximum amount of items to show per player on the item display HUD.",
        options: [
            5,
            15,
        ],
        increment: 1,
        placeholder: 10,
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "itemDisplayGUIScale",
        group: "Misc",
        category: "Item Display",
        name: "Item Display Scale",
        description: "The scale of the item display HUD.",
        options: [
            0.1,
            5.0,
        ],
        isDecimal: true,
        decimalPlaces: 1,
        increment: 0.1,
        placeholder: 1.0,
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
    })
    .addDropDown({
        varname: "itemDisplayDecayType",
        group: "Misc",
        category: "Item Display",
        name: "Item Display Decay Type",
        description: "Change the decay type for the item display.",
        options: itemDisplayDecayTypeList,
        placeholder: 0,
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "itemDisplayDecayTimerSeconds",
        group: "Misc",
        category: "Item Display",
        name: "Item Display Decay Timer",
        description: "The decay timer in seconds for the item display HUD.\n§a0 = Disabled",
        options: [
            0,
            600,
        ],
        increment: 1,
        placeholder: 300,
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
        hideIf: (value) => {
            return ZSettings.itemDisplayDecayType != 1
        }
    })
    .addButton({
        varname: "moveItemDisplayGUI",
        group: "Misc",
        category: "Item Display",
        name: "Move Item Display",
        description: "Moves the item display HUD.",
        placeholder: "Move GUI",
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.itemDisplayGUIData.gui.open()
        },
    })
    .addButton({
        varname: "resetItemDisplayGUIPosition",
        group: "Misc",
        category: "Item Display",
        name: "Reset Item Display Position",
        description: "Resets the item display HUD position.",
        placeholder: "Reset GUI",
        requires: [
            {"toggleItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.itemDisplayGUIData.resetPosition()
        },
    })

    // Misc -> Island Item Display
    .addSwitch({
        varname: "toggleIslandItemDisplayGUI",
        group: "Misc",
        category: "Island Item Display",
        name: "Toggle Island Item Display",
        description: "Toggles the island item display HUD.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleScanningEnablesIslandItemDisplayGUI",
        group: "Misc",
        category: "Island Item Display",
        name: "Toggle Player Scans Enabling Display",
        description: "Enables the island item display HUD when scanning players.",
        placeholder: true,
        requires: [
            {"toggleIslandItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "maxIslandItemDisplayGUILength",
        group: "Misc",
        category: "Island Item Display",
        name: "Toggle Island Item Display Max Item Count",
        description: "The maximum amount of items to show on the island item display HUD.",
        options: [
            5,
            20,
        ],
        increment: 1,
        placeholder: 10,
        requires: [
            {"toggleIslandItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "islandItemDisplayGUIScale",
        group: "Misc",
        category: "Island Item Display",
        name: "Island Item Display Scale",
        description: "The scale of the island item display HUD.",
        options: [
            0.1,
            5.0,
        ],
        isDecimal: true,
        decimalPlaces: 1,
        increment: 0.1,
        placeholder: 1.0,
        requires: [
            {"toggleIslandItemDisplayGUI": true},
        ],
    })
    .addButton({
        varname: "moveIslandItemDisplayGUI",
        group: "Misc",
        category: "Island Item Display",
        name: "Move Island Item Display",
        description: "Moves the island item display HUD.",
        placeholder: "Move GUI",
        requires: [
            {"toggleIslandItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.islandItemDisplayGUIData.gui.open()
        },
    })
    .addButton({
        varname: "resetIslandItemDisplayGUIPosition",
        group: "Misc",
        category: "Island Item Display",
        name: "Reset Island Item Display Position",
        description: "Resets the island item display HUD position.",
        placeholder: "Reset GUI",
        requires: [
            {"toggleIslandItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.islandItemDisplayGUIData.resetPosition()
        },
    })

    // Misc -> Worn Item Display
    .addSwitch({
        varname: "toggleWornItemDisplayGUI",
        group: "Misc",
        category: "Worn Item Display",
        name: "Toggle Worn Item Display",
        description: "Toggles the worn item display HUD.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleScanningEnablesWornItemDisplayGUI",
        group: "Misc",
        category: "Worn Item Display",
        name: "Toggle Player Scans Enabling Display",
        description: "Enables the worn item display HUD when scanning players.",
        placeholder: true,
        requires: [
            {"toggleWornItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "maxWornItemDisplayGUILength",
        group: "Misc",
        category: "Worn Item Display",
        name: "Toggle Worn Item Display Max Item Count",
        description: "The maximum amount of items to show per player on the worn item display HUD.",
        options: [
            5,
            15,
        ],
        increment: 1,
        placeholder: 10,
        requires: [
            {"toggleWornItemDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "wornItemDisplayGUIScale",
        group: "Misc",
        category: "Worn Item Display",
        name: "Worn Item Display Scale",
        description: "The scale of the worn item display HUD.",
        options: [
            0.1,
            5.0,
        ],
        isDecimal: true,
        decimalPlaces: 1,
        increment: 0.1,
        placeholder: 1.0,
        requires: [
            {"toggleWornItemDisplayGUI": true},
        ],
    })
    .addButton({
        varname: "moveWornItemDisplayGUI",
        group: "Misc",
        category: "Worn Item Display",
        name: "Move Worn Item Display",
        description: "Moves the worn item display HUD.",
        placeholder: "Move GUI",
        requires: [
            {"toggleWornItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.wornItemDisplayGUIData.gui.open()
        },
    })
    .addButton({
        varname: "resetWornItemDisplayGUIPosition",
        group: "Misc",
        category: "Worn Item Display",
        name: "Reset Worn Item Display Position",
        description: "Resets the worn item display HUD position.",
        placeholder: "Reset GUI",
        requires: [
            {"toggleWornItemDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.wornItemDisplayGUIData.resetPosition()
        },
    })

    // Misc -> Player Tracker -> Player Tracker
    .addSwitch({
        varname: "togglePlayerTracker",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Toggle Player Tracker",
        description: "Toggles the player tracker.",
        placeholder: false,
    })
    .addUnorderedList({
        varname: "playerTrackerList",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Player Tracker List",
        description: "Track the online status of a list of players.",
        options: [],
        requires: [
            {"togglePlayerTracker": true},
        ],
        onValueChanged: (option, oldValue, newValue) => {
            if (newValue.length <= 0) {
                Data.data.playerTrackerUsernamesToUUIDs = {}
                Data.data.save()
                return
            }
            Data.data.playerTrackerUsernamesToUUIDs = Data.data.playerTrackerUsernamesToUUIDs || {}
            newValue.forEach(playerUsername => {
                if (!Data.data.playerTrackerUsernamesToUUIDs.hasOwnProperty(playerUsername)) {
                    if (ZCore.hasOwnProperty("GetPlayerAccountData")) {
                        ZCore.GetPlayerAccountData("PlayerTrackerSetting1", playerUsername, (playerData) => {
                            Data.data.playerTrackerUsernamesToUUIDs[playerData.playerUsername] = playerData.playerUUID || null
                            Data.data.save()
                        })
                    }
                }
            })
            Object.keys(Data.data.playerTrackerUsernamesToUUIDs).forEach(trackedUsername => {
                if (!newValue.includes(trackedUsername.toLowerCase())) {
                    delete Data.data.playerTrackerUsernamesToUUIDs[trackedUsername]
                }
            })
            Data.data.save()
        },
        extra: {
            editable: true,
            minimumHeight: 1,
        },
    })
    .addSlider({
        varname: "playerTrackerUpdateInterval",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Player Tracker Update Interval",
        description: "The interval in seconds to update the player tracker.\n§aDefault = 120 seconds",
        description: (option) => {
            let currentValue = option.value || 120
            let currentList = ZSettings.playerTrackerList || []
            let overlimit = currentList.length * 6 > currentValue
            let overlimitString = overlimit ? "\n§c§lOver allowed scan limit!§r §cIncrease the interval or decrease player count!" : ""
            return `The interval in seconds to check for player status'.${overlimitString}`
        },
        options: [
            10,
            900,
        ],
        increment: 1,
        placeholder: 120,
        requires: [
            {"togglePlayerTracker": true},
        ],
    })
    .addSwitch({
        varname: "togglePlayerTrackerUpdateOnAreaChange",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Toggle Player Tracker Update On Area Change",
        description: "Toggles whether the player tracker updates when the player changes areas.",
        placeholder: true,
        requires: [
            {"togglePlayerTracker": true},
        ],
    })
    .addDropDown({
        varname: "playerTrackerOnlineAlertType",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Online Player Alert Type",
        description: "The type of alert to show when a tracked player is online.",
        options: playerTrackerAlertTypeStringList,
        placeholder: 0,
        requires: [
            {"togglePlayerTracker": true},
        ],
    })
    .addDropDown({
        varname: "playerTrackerOfflineAlertType",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Offline Player Alert Type",
        description: "The type of alert to show when a tracked player is offline.",
        options: playerTrackerAlertTypeStringList,
        placeholder: 2,
        requires: [
            {"togglePlayerTracker": true},
        ],
    })
    .addSwitch({
        varname: "togglePlayerTrackerPingOnPlayerInLobby",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Toggle Player Tracker Show Player In Lobby",
        description: "Toggles whether the player tracker shows when tracked players are in the lobby.",
        placeholder: true,
        requires: [
            {"togglePlayerTracker": true},
        ],
    })
    .addDropDown({
        varname: "playerTrackerPlayerInLobbyAlertType",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Player In Lobby Alert Type",
        description: "The type of alert to show when a tracked player is in the lobby.",
        options: playerTrackerAlertTypeStringList,
        placeholder: 0,
        requires: [
            {"togglePlayerTracker": true},
            {"togglePlayerTrackerPingOnPlayerInLobby": true},
        ],
    })
    .addList({
        varname: "playerTrackerActionsChatMessageSelector",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker",
        name: "Player Tracker Actions Chat Message Selector",
        description: "Change the actions message that gets shown for player tracker scans.",
        options: [
            ["§aParty", "party"],
            ["§aFriend", "friend"],
            ["§aMessage", "message"],
            ["§aIsland Invite", "invite"],
            ["§aVisit", "visit"],
            ["§aPV", "pv"],
        ],
        placeholder: {
            "party": 0,
            "friend": 1,
            "message": 2,
            "invite": 3,
            "visit": 4,
            "pv": 5,
        },
        requires: [
            {"togglePlayerTracker": true},
            {"togglePlayerTrackerPingOnPlayerInLobby": true},
        ],
    })

    // Misc -> Player Tracker -> Player Tracker Display
    .addSwitch({
        varname: "togglePlayerTrackerDisplayGUI",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Toggle Player Tracker Display",
        description: "Toggles the Player Tracker display HUD.",
        placeholder: true,
    })
    .addSwitch({
        varname: "toggleScanningEnablesPlayerTrackerDisplayGUI",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Toggle Updates Enable Display",
        description: "Enables the Player Tracker display HUD when a player's status updates.",
        placeholder: true,
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
    })
    .addSwitch({
        varname: "togglePlayerTrackerOnlyShowOnlinePlayers",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Toggle Only Show Online Players",
        description: "Toggles the Player Tracker display HUD to only show online players.",
        placeholder: true,
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "playerTrackerDisplayGUIScale",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Player Tracker Display Scale",
        description: "The scale of the Player Tracker display HUD.",
        options: [
            0.1,
            5.0,
        ],
        isDecimal: true,
        decimalPlaces: 1,
        increment: 0.1,
        placeholder: 1.0,
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
    })
    .addSlider({
        varname: "playerTrackerDisplayDecayTimerSeconds",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Player Tracker Display Decay Timer",
        description: "The decay timer in seconds for the Player Tracker display HUD.\n§a0 = Disabled",
        options: [
            0,
            600,
        ],
        increment: 1,
        placeholder: 300,
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
    })
    .addButton({
        varname: "movePlayerTrackerDisplayGUI",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Move Player Tracker Display",
        description: "Moves the Player Tracker display HUD.",
        placeholder: "Move GUI",
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.playerTrackerDisplayGUIData.gui.open()
        },
    })
    .addButton({
        varname: "resetPlayerTrackerDisplayGUIPosition",
        group: "Misc",
        category: "Player Tracker",
        subcategory: "Player Tracker Display",
        name: "Reset Player Tracker Display Position",
        description: "Resets the Player Tracker display HUD position.",
        placeholder: "Reset GUI",
        requires: [
            {"togglePlayerTrackerDisplayGUI": true},
        ],
        onPress: () => {
            ZLSGUIs.playerTrackerDisplayGUIData.resetPosition()
        },
    })

    // Misc -> Other
    .addSwitch({
        varname: "showInsufficientRamWarning",
        group: "Misc",
        category: "Other",
        name: "Toggle Insufficient RAM Warning",
        description: "Toggles the startup warning for insufficient RAM.\n§cNot recommended to ignore, too little ram can cause freezing.",
        placeholder: true,
        onValueChanged: (option, oldValue, newValue) => {
            ZCore.DeleteNotification("insufficientRamWarning")
        },
    })
    .addSwitch({
        varname: "toggleLobbySwapDelayDisplay",
        group: "Misc",
        category: "Other",
        name: "Toggle Lobby Swap Delay Display",
        description: "Toggles the lobby swap delay display.",
        placeholder: true,
        onValueChanged: (option, oldValue, newValue) => {
            ZCore.DeleteNotification("lobbySwapDelayDisplay")
        },
    })

if (HasAPIModInstalled()) {
    ZSettings
        // Scanner -> API Scanning
        .addSwitch({
            varname: "toggleLobbyScanning",
            group: "Scanner",
            category: "API Scanning",
            name: "Toggle Lobby Scanning",
            description: "Toggles player scanning when joining new lobbies.\n§cRequires 1 or more API keys to be loaded.\n§bUse /addkey <API_KEY>",
            placeholder: true,
        })
        .addSwitch({
            varname: "toggleDisableLobbyScanningOnGameLoad",
            group: "Scanner",
            category: "API Scanning",
            name: "Disable Lobby Scanning on Game Load",
            description: "Whether lobby scanning is disabled when starting the game.",
            placeholder: false,
            requires: [
                {"toggleLobbyScanning": true},
            ],
        })
        .addSlider({
            varname: "scanningPlayerLevelCap",
            group: "Scanner",
            category: "API Scanning",
            name: "Scanned Player Level Cap",
            description: "The maximum scanned player level.\n§a0 = No Limit§7, §aDefault = 175",
            options: [
                0,
                maxLevel,
            ],
            increment: 1,
            placeholder: 175,
            requires: [
                {"toggleLobbyScanning": true},
            ],
        })

        // Misc -> Keybinds -> Scanner
        .addKeybind({
            varname: "keybindRescanLobby",
            group: "Misc",
            category: "Keybinds",
            subcategory: "Scanner",
            name: "Rescan Lobby",
            description: "Rescans the current lobby.",
            placeholder: "KEY_DECIMAL",
            onPress: () => {
                TryRunKeybind("keybindRescanLobby")
            },
        })
        .addKeybind({
            varname: "keybindToggleLobbyScanning",
            group: "Misc",
            category: "Keybinds",
            subcategory: "Scanner",
            name: "Toggle Lobby Scanning",
            description: "Toggles lobby scanning.",
            onPress: () => {
                TryRunKeybind("keybindToggleLobbyScanning")
            },
        })
}

if (HasMainModInstalled()) {
    ZSettings
        // Scanner -> API Scanning -> Old Profiles
        .addSwitch({
            varname: "toggleOldProfileScanning",
            group: "Scanner",
            category: "API Scanning",
            subcategory: "Old Profiles",
            name: "Toggle Old Profile Scanning",
            description: "Toggles scanning old profiles.",
            placeholder: false,
        })
        .addSlider({
            varname: "oldProfileScanningPlayerLevelCap",
            group: "Scanner",
            category: "API Scanning",
            subcategory: "Old Profiles",
            name: "Old Profile Scanning Level Cap",
            description: "The maximum scanned player level for old profiles.\n§a0 = No Limit§7, §aDefault = 0",
            options: [
                0,
                maxLevel,
            ],
            increment: 1,
            placeholder: 0,
            requires: [
                {"toggleOldProfileScanning": true},
            ],
        })
        .addDropDown({
            varname: "oldProfileCutoffDate",
            group: "Scanner",
            category: "API Scanning",
            subcategory: "Old Profiles",
            name: "Old Profile Scanning Date Cutoff",
            description: "Change the date cutoff for old profile scanning.",
            options: Constants.oldProfileCutoffStringList,
            placeholder: 0,
            requires: [
                {"toggleOldProfileScanning": true},
            ],
        })

        .addDropDown({
            varname: "museumScanningProfileSelector",
            group: "Scanner",
            category: "API Scanning",
            subcategory: "Extra Features",
            name: "Profile Museum Scanning",
            description: "Change the type of museum scanning used.\n§c§lDoubles API key usage.",
            options: Constants.museumScanningTypeList,
            placeholder: 0,
        })
        .addSwitch({
            varname: "toggleDatabaseScanning",
            group: "Scanner",
            category: "API Scanning",
            subcategory: "Extra Features",
            name: "Toggle Database Items Scanning",
            description: "Toggles whether historical player database items are shown when scanning players.",
            placeholder: false,
        })

        // Scanner -> World Scanning -> Island Scanning
        .addSwitch({
            varname: "toggleIslandSignScanning",
            group: "Scanner",
            category: "World Scanning",
            subcategory: "Island Scanning",
            name: "Toggle Scanning Island Signs",
            description: "Toggles scanning island signs for valid phrase.\nIncludes phrases such as `exotic`, `fairy`, `dyed`, etc.",
            placeholder: true,
            requires: [
                {"toggleAllWorldScanning": true},
                {"toggleIslandScanning": true},
            ],
        })

        // Scanner -> Scanned Items -> Filters
        .addUnorderedList({
            varname: "itemWhitelist",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Filters",
            name: "Item ID Whitelist",
            description: "Whitelist for what item ids are marked.",
            options: [],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
            extra: {
                editable: true,
                minimumHeight: 1,
            },
        })
        .addUnorderedList({
            varname: "itemBlacklist",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Filters",
            name: "Item ID Blacklist",
            description: "Blacklist for what item ids are marked.",
            options: [],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
            extra: {
                editable: true,
                minimumHeight: 1,
            },
        })

        // Scanner -> Scanned Items -> Dyed Armor
        .addSwitch({
            varname: "toggleExoticScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §6Exotic §fScanning",
            description: "Toggles scanning Exotic armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleGlitchedScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §9Glitched §fScanning",
            description: "Toggles scanning Glitched armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleOGFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §bOG Fairy §fScanning",
            description: "Toggles scanning OG Fairy armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleOGFairyFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §bOG Fairy Fairy §fScanning",
            description: "Toggles scanning OG Fairy Fairy armor.",
            placeholder: false,
            requires: [
                {"toggleOGFairyScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §dFairy §fScanning",
            description: "Toggles scanning Fairy armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleCrystalScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §fCrystal §fScanning",
            description: "Toggles scanning Crystal armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleSpookScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §5Spook §fScanning",
            description: "Toggles scanning Spook Dyed Fairy armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleBleachedScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Dyed Armor",
            name: "§fToggle §6Bleached §fScanning",
            description: "Toggles scanning Bleached armor.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Scanned Items -> Skins
        .addSwitch({
            varname: "toggleUnappliedSkinScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Skins",
            name: "Toggle Unapplied Skin Scanning",
            description: "Toggles Unapplied Skin Scanning.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleAppliedSkinScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Skins",
            name: "Toggle Applied Skin Scanning",
            description: "Toggles Applied Skin Scanning.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSlider({
            varname: "minimumSkinPrice",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Skins",
            name: "Minimum Skin Price (M)",
            description: "The minimum price of skins to scan for in Millions.\n§a0 = No Limit§7, §aDefault = 150.0",
            options: [
                0.0,
                500.0,
            ],
            isDecimal: true,
            decimalPlaces: 1,
            increment: 0.5,
            placeholder: 150.0,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Scanned Items -> Misc Collectables
        .addCheckbox({
            varname: "toggleMiscCollectableScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Toggle Misc Collectable Scanning",
            description: "Toggles Misc Collectable Scanning.",
            options: Constants.miscCollectableTypeList,
            placeholder: Constants.miscCollectableTypeList
                .filter(([_, varName, enabled]) => enabled ?? true)
                .map(([_, varName]) => varName),
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleCatchAllMiscCollectableScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Toggle Other Misc Collectable Scanning",
            description: "Toggles Other Misc Collectable Scanning.\nMarks other collectable items not in the above setting.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleSpecialEditionGreatSpook",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Toggle Special Edition Great Spook",
            description: "Toggles Special Edition Great Spook Scanning.\n(e.g. 1000, 90009, 12345, etc)",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSlider({
            varname: "lowEditionGreatSpookCap",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Low Edition Great Spook Cap",
            description: "The maximum low edition to scan for, other special editions are still scanned.\n§aDefault = 1000",
            options: [
                1,
                5000,
            ],
            increment: 25,
            placeholder: 1000,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleSpecialEditionMementos",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Toggle Special Edition Mementos",
            description: "Toggles Special Edition Mementos Scanning.\n(e.g. 1000, 90009, 12345, etc)",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSlider({
            varname: "lowEditionMementosCap",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Misc Collectables",
            name: "Low Edition Mementos Cap",
            description: "The maximum low edition to scan for, other special editions are still scanned.\n§aDefault = 1000",
            options: [
                1,
                5000,
            ],
            increment: 25,
            placeholder: 1000,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Scanned Items -> Cakes
        .addSwitch({
            varname: "toggleCakeScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Cakes",
            name: "Toggle Cake Scanning",
            description: "Toggles new year cake scanning.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSlider({
            varname: "cakeYearCap",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Cakes",
            name: "Cake Year Cap",
            description: "The maximum year to scan for cakes.\n§a0 = No Limit§7, §aDefault = 25",
            options: [
                0,
                500,
            ],
            increment: 1,
            placeholder: 25,
            requires: [
                {"toggleCakeScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addUnorderedList({
            varname: "customCakeYears",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Cakes",
            name: "Custom Cake Years",
            description: "Whitelist for what extra cake years are marked.",
            options: [],
            requires: [
                {"toggleCakeScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
            extra: {
                editable: true,
                minimumHeight: 1,
            },
        })

        // Scanner -> Scanned Items -> Hidden Dyes
        .addSwitch({
            varname: "toggleHiddenExoticScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Hidden Dyes",
            name: "Toggle Hidden Exotic Scanning",
            description: "Toggles scanning Hidden Exotic armor.\n(Items were were once Exotic, but was replaced with another dye/skin)",
            placeholder: false,
            requires: [
                {"toggleExoticScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleHiddenGlitchedScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Hidden Dyes",
            name: "Toggle Hidden Glitched Scanning",
            description: "Toggles scanning Hidden Glitched armor.\n(Items were were once Glitch dyed, but was replaced with another dye/skin)",
            placeholder: false,
            requires: [
                {"toggleGlitchedScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleHiddenOGFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Hidden Dyes",
            name: "Toggle Hidden OG Fairy Scanning",
            description: "Toggles scanning Hidden OG Fairy armor.\n(Items were were once OG Fairy dyed, but was replaced with another dye/skin)",
            placeholder: false,
            requires: [
                {"toggleOGFairyScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleHiddenFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Hidden Dyes",
            name: "Toggle Hidden Fairy Scanning",
            description: "Toggles scanning Hidden Fairy armor.\n(Items were were once Fairy dyed, but was replaced with another dye/skin)",
            placeholder: false,
            requires: [
                {"toggleFairyScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleHiddenCrystalScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Hidden Dyes",
            name: "Toggle Hidden Crystal Scanning",
            description: "Toggles scanning Hidden Crystal armor.\n(Items were were once Crystal dyed, but was replaced with another dye/skin)",
            placeholder: false,
            requires: [
                {"toggleCrystalScanning": true},
            ],
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Scanned Items -> Old Colors
        .addSwitch({
            varname: "toggleColorChangedCrystalScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Crystal Scanning",
            description: "Toggles scanning Old Color Crystal armor.\n(Crystal armor that is not the default hex, e.x. #1F0030, #63237D, but not #FCF3FF)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedFairyScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Fairy Scanning",
            description: "Toggles scanning Old Color Fairy armor.\n(Fairy armor that is not the default hex)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedGreatSpookScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Great Spook Scanning",
            description: "Toggles scanning Old Color Great Spook armor.\n(Great Spook armor that is not the default hex)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedAdaptiveScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Adaptive Scanning",
            description: "Toggles scanning Old Color Adaptive armor.\n(Adaptive armor that is not the default hex)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedGhostlyBootsScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Ghostly Boots Scanning",
            description: "Toggles scanning Old Color Ghostly Boots armor.\n(Ghostly Boots that are not the default hex)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedRanchersScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Rancher Boots Scanning",
            description: "Toggles scanning Old Color Rancher Boots.\n(Rancher Boots that are not the default hex, e.x. #CC5500)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleColorChangedMastiffScanning",
            group: "Scanner",
            category: "Scanned Items",
            subcategory: "Old Colors",
            name: "Toggle Old Color Mastiff Scanning",
            description: "Toggles scanning Old Color Mastiff armor.\n(Mastiff armor with a saved color, e.x. Growth)",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Legacy Reforges -> Toggles
        .addSwitch({
            varname: "toggleLegacyScanning",
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: "Toggles",
            name: "Toggle Legacy Reforge Scanning",
            description: "Toggles legacy reforge scanning.",
            placeholder: true,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleGhostScanning",
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: "Toggles",
            name: "Toggle Ghost Reforge Scanning",
            description: "Toggles ghost reforge scanning.",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleTalismanScanning",
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: "Toggles",
            name: "Toggle Accessory Reforge Scanning",
            description: "Toggles accessory reforge scanning.",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleLegacyFarmingToolsScanning",
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: "Toggles",
            name: "Toggle Legacy Farming Tools Scanning",
            description: "Toggles legacy farming tools scanning.",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })
        .addSwitch({
            varname: "toggleGhostExFarmingToolsScanning",
            group: "Scanner",
            category: "Legacy Reforges",
            subcategory: "Toggles",
            name: "Toggle Ghost Ex-Farming Tools Scanning",
            description: "Toggles ghost Ex-farming tools scanning.",
            placeholder: false,
            onValueChanged: (option, oldValue, newValue) => {
                StartDelayedUpdate()
            },
        })

        // Scanner -> Legacy Reforges -> Legacy Reforges
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "demonicLegacySelector",
            "Demonic",
            "Legacy Reforges",
            7, // placeholder
            true, // isLegacy
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "strongLegacySelector",
            "Strong",
            "Legacy Reforges",
            7, // placeholder
            true, // isLegacy
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "hurtfulLegacySelector",
            "Hurtful",
            "Legacy Reforges",
            7, // placeholder
            true, // isLegacy
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "forcefulLegacySelector",
            "Forceful",
            "Legacy Reforges",
            7, // placeholder
            true, // isLegacy
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "rich_swordLegacySelector",
            "Rich Swords",
            "Legacy Reforges",
            true, // placeholder
            true, // isLegacy
            false, // isGhost
            false, // isAccessory
            false, // isFarming
            null, // optionList
            true, // isSwitch
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "odd_bowLegacySelector",
            "Odd Bows",
            "Legacy Reforges",
            true, // placeholder
            true, // isLegacy
            false, // isGhost
            false, // isAccessory
            false, // isFarming
            null, // optionList
            true, // isSwitch
        ))

        // Scanner -> Legacy Reforges -> Ghost Reforges
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "godlyLegacySelector",
            "Godly",
            "Ghost Reforges",
            0, // placeholder
            false, // isLegacy
            true, // isGhost
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "unpleasantLegacySelector",
            "Unpleasant",
            "Ghost Reforges",
            0, // placeholder
            false, // isLegacy
            true, // isGhost
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "superiorLegacySelector",
            "Superior",
            "Ghost Reforges",
            0, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            false, // isFarming
            legacySelectorWithDragonTypeList, // optionList
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "zealousLegacySelector",
            "Zealous",
            "Ghost Reforges",
            0, // placeholder
            false, // isLegacy
            true, // isGhost
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "keenLegacySelector",
            "Keen",
            "Ghost Reforges",
            0, // placeholder
            false, // isLegacy
            true, // isGhost
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "bloodshotLegacySelector",
            "Bloodshot",
            "Ghost Reforges",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            false, // isFarming
            null, // optionList
            true, // isSwitch
        ))

        // Scanner -> Legacy Reforges -> Accessories
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "itchyLegacySelector",
            "Itchy",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "shadedLegacySelector",
            "Shaded",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "prettyLegacySelector",
            "Pretty",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "ominousLegacySelector",
            "Ominous",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "pleasantLegacySelector",
            "Pleasant",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "simpleLegacySelector",
            "Simple",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "bloodyLegacySelector",
            "Bloody",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "silkyLegacySelector",
            "Silky",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "bizarreLegacySelector",
            "Bizarre",
            "Accessories",
            false, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "sweetLegacySelector",
            "Sweet",
            "Accessories",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            true, // isAccessory
        ))

        // Scanner -> Legacy Reforges -> Ghost Accessories
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "strangeLegacySelector",
            "Strange",
            "Ghost Accessories",
            false, // placeholder
            false, // isLegacy
            true, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "shinyLegacySelector",
            "Shiny",
            "Ghost Accessories",
            false, // placeholder
            false, // isLegacy
            true, // isGhost
            true, // isAccessory
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "vividLegacySelector",
            "Vivid",
            "Ghost Accessories",
            false, // placeholder
            false, // isLegacy
            true, // isGhost
            true, // isAccessory
        ))

        // Scanner -> Legacy Reforges -> Farming Tools
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "double_bitLegacySelector",
            "Double Bit",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "greatLegacySelector",
            "Great",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "lumberjackLegacySelector",
            "Lumberjack's",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "lushLegacySelector",
            "Lush",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "ruggedLegacySelector",
            "Rugged",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "toilLegacySelector",
            "Toil",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "moilLegacySelector",
            "Moil",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "moongladeLegacySelector",
            "Moonglade",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "earthyLegacySelector",
            "Earthy",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "blessedLegacySelector",
            "Blessed",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "bountifulLegacySelector",
            "Bountiful",
            "Farming Tools",
            true, // placeholder
            false, // isLegacy
            false, // isGhost
            false, // isAccessory
            true, // isFarming
        ))

        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "robustGhostLegacySelector",
            "Robust",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "blessedGhostLegacySelector",
            "Blessed",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "peasantGhostLegacySelector",
            "Peasant",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "green_thumbGhostLegacySelector",
            "Green Thumb",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "ZoomingGhostLegacySelector",
            "Zooming",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))
        .runInOrder((settingsObject) => AddLegacySettings(
            settingsObject,
            "bountifulGhostLegacySelector",
            "Bountiful",
            "Ghost Farming Tools",
            true, // placeholder
            false, // isLegacy
            true, // isGhost
            false, // isAccessory
            true, // isFarming
        ))

        // Render -> Highlights -> Items
        .addSwitch({
            varname: "valuableItemHighlight",
            group: "Render",
            category: "Highlights",
            subcategory: "Items",
            name: "Toggle Valuable Item Highlights",
            description: "Toggles valuable item highlights.",
            placeholder: true,
            requires: [
                {"allItemHighlightsOverride": true},
            ],
        })

        // Render -> Highlights -> Legacy Reforges
        .addSwitch({
            varname: "legacyReforgeItemHighlight",
            group: "Render",
            category: "Highlights",
            subcategory: "Legacy Reforges ",
            name: "Toggle Legacy Reforge Highlights",
            description: "Toggles legacy reforge item highlights.",
            placeholder: true,
            requires: [
                {"allItemHighlightsOverride": true},
                {"toggleLegacyScanning": true},
            ],
        })
        .addSwitch({
            varname: "ghostReforgeItemHighlight",
            group: "Render",
            category: "Highlights",
            subcategory: "Legacy Reforges ",
            name: "Toggle Ghost Reforge Highlights",
            description: "Toggles ghost reforge item highlights.",
            placeholder: true,
            requires: [
                {"allItemHighlightsOverride": true},
                {"toggleLegacyScanning": true},
            ],
        })

        // Render -> Highlights -> Other
        .addSwitch({
            varname: "markedProfileHighlight",
            group: "Render",
            category: "Highlights",
            subcategory: "Other ",
            name: "Toggle Marked Profile Highlights",
            description: "Toggles marked profile highlights.",
            placeholder: true,
            requires: [
                {"allItemHighlightsOverride": true},
            ],
        })

        // Render -> World Scanning -> Toggles
        .addSwitch({
            varname: "toggleSignPhraseTracers",
            group: "Render",
            category: "World Scanning ",
            subcategory: "Toggles  ",
            name: "Toggle Rendering Scanned Signs",
            description: "Toggles tracers, hitboxes, and display names for scanned signs.",
            placeholder: true,
            requires: [
                {"toggleAllRendering": true},
            ],
        })

        // Render -> Colors -> World Scanning
        .addColorPicker({
            varname: "scannedSignColor",
            group: "Render",
            category: "Colors",
            subcategory: "World Scanning",
            name: "Scanned Sign Tracer Display Color",
            description: "Color for tracers, hitboxes, and display names of scanned signs.",
            allowAlpha: true,
            placeholder: worldScannedSignColor,
        })

        // Render -> Colors -> Item Highlight Colors
        .addColorPicker({
            varname: "valuableItemHighlightColor",
            group: "Render",
            category: "Colors",
            subcategory: "Item Highlight Colors",
            name: "Valuable Item Highlight Color",
            description: "Highlight color for valuable items.",
            allowAlpha: false,
            placeholder: valuableItemHighlightColor,
        })
        .addColorPicker({
            varname: "legacyReforgeHighlightColor",
            group: "Render",
            category: "Colors",
            subcategory: "Item Highlight Colors",
            name: "Legacy Reforge Highlight Color",
            description: "Highlight color for legacy reforge items.",
            allowAlpha: false,
            placeholder: legacyReforgeHighlightColor,
        })
        .addColorPicker({
            varname: "ghostReforgeHighlightColor",
            group: "Render",
            category: "Colors",
            subcategory: "Item Highlight Colors",
            name: "Ghost Reforge Highlight Color",
            description: "Highlight color for ghost reforge items.",
            allowAlpha: false,
            placeholder: ghostReforgeHighlightColor,
        })

        // Misc -> Keybinds -> Old Profiles Display
        .addKeybind({
            varname: "keybindToggleOldProfilesDisplayGUI",
            group: "Misc",
            category: "Keybinds",
            subcategory: "Old Profiles Display",
            name: "Toggle Old Profiles Display",
            description: "Toggles the old profiles display.",
            onPress: () => {
                TryRunKeybind("keybindToggleOldProfilesDisplayGUI")
            },
        })
        .addKeybind({
            varname: "keybindOldProfilesDisplayGUIOpenCurrentProfile",
            group: "Misc",
            category: "Keybinds",
            subcategory: "Old Profiles Display",
            name: "Visit Selected Old Profile",
            description: "Visits the selected old profile.",
            placeholder: "KEY_NUMPADENTER",
            onPress: () => {
                TryRunKeybind("keybindOldProfilesDisplayGUIOpenCurrentProfile")
            },
        })
        .addKeybind({
            varname: "keybindOldProfilesDisplayGUINextProfile",
            group: "Misc",
            category: "Keybinds",
            subcategory: "Old Profiles Display",
            name: "Visit Next Old Profile",
            description: "Visits the next old profile and deletes the current one.",
            placeholder: "KEY_ADD",
            onPress: () => {
                TryRunKeybind("keybindOldProfilesDisplayGUINextProfile")
            },
        })

        // Misc -> Old Profiles Display
        .addSwitch({
            varname: "toggleOldProfilesDisplayGUI",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Toggle Old Profiles Display",
            description: "Toggles the old profiles display HUD.",
            placeholder: true,
        })
        .addSwitch({
            varname: "toggleScanningEnablesOldProfilesDisplayGUI",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Toggle Player Scans Enabling Display",
            description: "Enables the old profiles display HUD when scanning players.",
            placeholder: true,
            requires: [
                {"toggleOldProfilesDisplayGUI": true},
            ],
        })
        .addSlider({
            varname: "oldProfilesDisplayGUIScale",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Old Profiles Display Scale",
            description: "The scale of the old profiles display HUD.",
            options: [
                0.1,
                5.0,
            ],
            isDecimal: true,
            decimalPlaces: 1,
            increment: 0.1,
            placeholder: 1.0,
            requires: [
                {"toggleOldProfilesDisplayGUI": true},
            ],
        })
        .addSlider({
            varname: "oldProfilesDisplayDecayTimerSeconds",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Old Profiles Display Decay Timer",
            description: "The decay timer in seconds for the old profiles display HUD.\n§a0 = Disabled",
            options: [
                0,
                600,
            ],
            increment: 1,
            placeholder: 300,
            requires: [
                {"toggleOldProfilesDisplayGUI": true},
            ],
        })
        .addButton({
            varname: "moveOldProfilesDisplayGUI",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Move Old Profiles Display",
            description: "Moves the old profiles display HUD.",
            placeholder: "Move GUI",
            requires: [
                {"toggleOldProfilesDisplayGUI": true},
            ],
            onPress: () => {
                ZLSGUIs.oldProfilesDisplayGUIData.gui.open()
            },
        })
        .addButton({
            varname: "resetOldProfilesDisplayGUIPosition",
            group: "Misc",
            category: "Old Profiles Display",
            name: "Reset Old Profiles Display Position",
            description: "Resets the old profiles display HUD position.",
            placeholder: "Reset GUI",
            requires: [
                {"toggleOldProfilesDisplayGUI": true},
            ],
            onPress: () => {
                ZLSGUIs.oldProfilesDisplayGUIData.resetPosition()
            },
        })

        // Misc -> 1.21 Limitations
        .addMarkdown({
            varname: "1.21_Limitations",
            group: "Misc",
            category: "§c§l1.21 Limitations",
            name: "1.21 Limitations",
            value: FileLib.read(`${Data.modulePrefixU}`, "1.21_Limitations.md"),
        })
}

function UpdateAllDarkHexColorReadabilityOptions() {
    UpdateDarkHexColorReadabilityIsEnabled(ZSettings.toggleDarkHexColorReadability)
    UpdateDarkHexColorReadabilityLuminance(ZSettings.darkHexColorReadabilityTolerance)
    UpdateDarkHexColorReadabilityBackgroundColor(ZSettings.darkHexColorReadabilityBackgroundColor)
}
function UpdateDarkHexColorReadabilityIsEnabled(newValue) {
    if (!DarkHexColorReadabilityOptionsLoaded) return
    DarkHexColorReadabilityOptions.SetIsEnabled(newValue)
}
function UpdateDarkHexColorReadabilityLuminance(newValue) {
    if (!DarkHexColorReadabilityOptionsLoaded) return
    DarkHexColorReadabilityOptions.SetLuminanceThreshold(newValue)
}
function UpdateDarkHexColorReadabilityBackgroundColor(newValue) {
    if (!DarkHexColorReadabilityOptionsLoaded) return
    DarkHexColorReadabilityOptions.SetBackgroundColorInt(ZRenderLib.getRGBAColor(...newValue).getIntARGB())
}
UpdateAllDarkHexColorReadabilityOptions()

export const SetKeybindCallback = (callback) => {
    _keybindCallback = callback
}
export const SetInstallStagedUpdateCallback = (callback) => {
    _installStagedUpdateCallback = callback
}

export const UpdateSettingCheckboxOptions = (settingVarName, totalOptionList, lastCount) => {
    if ((lastCount || 0) < totalOptionList.length) {
        const currentSet = new Set(ZSettings[settingVarName])
        const newOptions = totalOptionList.slice(lastCount || 0)
        newOptions.forEach(opt => {
            if (Array.isArray(opt)) {
                const [prettyName, varName, enabledByDefault = true] = opt
                if (enabledByDefault) currentSet.add(varName)
            } else {
                currentSet.add(opt)
            }
        })
        ZSettings[settingVarName] = [...currentSet]
    }
    return totalOptionList.length
}
export const UpdateSettingListOptions = (settingVarName, totalOptionList) => {
    const missingOptionsList = []
    let maxIndex = -1
    Object.entries(totalOptionList).forEach(([_, optionData]) => {
        const key = optionData[1]
        maxIndex = Math.max(maxIndex, ZSettings[settingVarName][key] || -1)
        if (!ZSettings[settingVarName].hasOwnProperty(key)) {
            missingOptionsList.push(key)
        }
    })

    missingOptionsList.forEach(key => {
        maxIndex++
        ZSettings[settingVarName][key] = maxIndex
    })
}

export const ChangeSetting = (varname, value, callback = null) => {
    if (ZSettings.hasOwnProperty(varname)) {
        ZSettings[varname] = value
        return value
    }
    return null
}
export const ToggleBooleanSetting = (varname) => {
    if (ZSettings.hasOwnProperty(varname)) {
        ZSettings[varname] = !ZSettings[varname]
        return ZSettings[varname]
    }
    return null
}

register("GameLoad", () => {
    Data.data.lastMiscCollectableCount = UpdateSettingCheckboxOptions("toggleMiscCollectableScanning", Constants.miscCollectableTypeList, Data.data.lastMiscCollectableCount)
    Data.data.lastMiscCollectableLoreCount = UpdateSettingCheckboxOptions("miscCollectableValuableReasonsLoreDisplay", Constants.miscCollectableLoreTypeList, Data.data.lastMiscCollectableLoreCount)
    Data.data.lastFadeDyeCount = UpdateSettingCheckboxOptions("seymourFadeDyeSelection", SeymourExtractor.fadeDyesList, Data.data.lastFadeDyeCount)

    if (Object.keys(ZSettings.seymourLorePriority).length < seymourLorePriorityList.length) {
        UpdateSettingListOptions("seymourLorePriority", seymourLorePriorityList)
    }
    if (Object.keys(ZSettings.seymourHighlightPriority).length < seymourHighlightPriorityList.length) {
        UpdateSettingListOptions("seymourHighlightPriority", seymourHighlightPriorityList)
    }
    Data.data.save()
})
