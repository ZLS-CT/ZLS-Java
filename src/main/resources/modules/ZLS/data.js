import { DataObject, moveFile, modulesFolder } from "../ZCore"

export const modulePrefix = "&aZLS"
export const fullModulesPrefix = `&6[${modulePrefix}&6]`
export const modulePrefixU = ChatLib.removeFormatting(modulePrefix)
export const modulePrefixULower = modulePrefixU.toLowerCase()
export const moduleChatPrefix = `${fullModulesPrefix} &r`
export const oldCommandPrefix = "ar"
export const newCommandPrefix = modulePrefixULower
export const moduleChat = (text) => {
    ChatLib.chat(`${moduleChatPrefix}${text}`)
}

export const defaultItemDisplayGUIX = 200
export const defaultItemDisplayGUIY = 35
export const defaultWornItemDisplayGUIX = 600
export const defaultWornItemDisplayGUIY = 35
export const defaultIslandItemDisplayGUIX = 500
export const defaultIslandItemDisplayGUIY = 200
export const defaultOldProfilesDisplayGUIX = 400
export const defaultOldProfilesDisplayGUIY = 70
export const defaultPlayerTrackerDisplayGUIX = 15
export const defaultPlayerTrackerDisplayGUIY = 50
export const defaultAuctionScannerDisplayGUIX = 15
export const defaultAuctionScannerDisplayGUIY = 50

function ConvertLegacyFiles() {
    let basePath = `${modulesFolder}/${modulePrefixU}`
    if (!FileLib.exists(`${basePath}/Output`)) {
        let file = new JavaFile(`${basePath}/Output`)
        file.mkdirs()
    }

    moveFile(`${basePath}/config.toml`, `${basePath}/Output/config.toml`)
    moveFile(`${basePath}/.data.json`, `${basePath}/Output/.ZLSData.json`)
    moveFile(`${basePath}/AllOldProfiles.json`, `${basePath}/Output/AllOldProfiles.json`)
    moveFile(`${basePath}/AllScannedPlayers.json`, `${basePath}/Output/AllScannedPlayers.json`)
    moveFile(`${basePath}/NonValuableItems.json`, `${basePath}/Output/NonValuableItems.json`)

    FileLib.delete(`${basePath}/ValuableItems.json`)
    FileLib.delete(`${basePath}/DefaultArmorColors.json`)
}
ConvertLegacyFiles()

export const data = new DataObject(modulePrefixU, {
    firstJoin: false,
    apiKeys: [],

    itemDisplayGUIX: defaultItemDisplayGUIX,
    itemDisplayGUIY: defaultItemDisplayGUIY,
    wornItemDisplayGUIX: defaultWornItemDisplayGUIX,
    wornItemDisplayGUIY: defaultWornItemDisplayGUIY,
    islandItemDisplayGUIX: defaultIslandItemDisplayGUIX,
    islandItemDisplayGUIY: defaultIslandItemDisplayGUIY,
    oldProfilesDisplayGUIX: defaultOldProfilesDisplayGUIX,
    oldProfilesDisplayGUIY: defaultOldProfilesDisplayGUIY,
    playerTrackerDisplayGUIX: defaultPlayerTrackerDisplayGUIX,
    playerTrackerDisplayGUIY: defaultPlayerTrackerDisplayGUIY,
    auctionScannerDisplayGUIX: defaultAuctionScannerDisplayGUIX,
    auctionScannerDisplayGUIY: defaultAuctionScannerDisplayGUIY,

    installedFileVersions: {},

    updateData: {},

    customSeymourWords: {},
    blacklistedSeymourWords: [],
    customSeymourHexes: {},
    customSeymourWildcardHexes: {},

    lastMiscCollectableCount: 0,
},
    "Output/.ZLSData.json"
)
data.autosave(2)
