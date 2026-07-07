import * as ZCore from "../../ZCore"
import * as Data from "../data"
import * as Constants from "../Constants"
import * as SeymourExtractor from "./SeymourExtractor"
import { ZSettings as Settings } from "../settings"

const cLiteral = Commands.literal
const cArgument = Commands.argument
const cString = Commands.string
const cExec = Commands.exec
const cBool = Commands.bool
const cInteger = Commands.integer
const cGreedyString = Commands.greedyString

let lastOwnedSeymourArmorCount = 0
let allFoundSeymourArmor = {}
let allOwnedSeymourArmor = {}
let allSeymourSignatures = {}
let defaultSeymourArmorColors = {}
let seymourWordMap = {}

export const GetLastOwnedSeymourArmorCount = () => { return lastOwnedSeymourArmorCount }
export const GetAllFoundSeymourArmor = () => { return allFoundSeymourArmor }
export const SetAllFoundSeymourArmor = (value) => { allFoundSeymourArmor = value }
export const GetAllOwnedSeymourArmor = () => { return allOwnedSeymourArmor }
export const GetAllSeymourSignatures = () => { return allSeymourSignatures }
export const GetSeymourWordMap = () => { return seymourWordMap }

export const SetDefaultSeymourArmorColors = (armorColors) => {
    defaultSeymourArmorColors = armorColors
}
export const SetSeymourWordMap = (wordList) => {
    seymourWordMap = wordList
}

export const RegisterFoundSeymourPiece = (playerUUID, itemUUID, itemID, hexCode, isValuable, worldScan) => {
    if (!allFoundSeymourArmor.hasOwnProperty(playerUUID)) {
        allFoundSeymourArmor[playerUUID] = {}
    }

    const saveLocation = isValuable ? "valuable" : "nonValuable"
    if (worldScan) {
        if (!allFoundSeymourArmor[playerUUID].hasOwnProperty("wornItems")) {
            allFoundSeymourArmor[playerUUID]["wornItems"] = {}
        }
        for (const bucket of ["valuable", "nonValuable"]) {
            const list = allFoundSeymourArmor[playerUUID]["wornItems"][bucket] || []
            for (const itemData of list) {
                if (itemData.hexCode == hexCode && itemData.itemID == itemID) {
                    return
                }
            }
        }
        if (!allFoundSeymourArmor[playerUUID]["wornItems"].hasOwnProperty(saveLocation)) {
            allFoundSeymourArmor[playerUUID]["wornItems"][saveLocation] = []
        }
        allFoundSeymourArmor[playerUUID]["wornItems"][saveLocation].push({
            "itemID": itemID,
            "hexCode": hexCode,
        })
        return
    }
    if (!allFoundSeymourArmor[playerUUID].hasOwnProperty(saveLocation)) {
        allFoundSeymourArmor[playerUUID][saveLocation] = {}
    }
    if (allFoundSeymourArmor[playerUUID][saveLocation].hasOwnProperty(itemUUID)) return
    if (allFoundSeymourArmor[playerUUID].hasOwnProperty("nonValuable") && isValuable && allFoundSeymourArmor[playerUUID].nonValuable[itemUUID]) {
        delete allFoundSeymourArmor[playerUUID].nonValuable[itemUUID]
    }
    allFoundSeymourArmor[playerUUID][saveLocation][itemUUID] = {
        "itemID": itemID,
        "hexCode": hexCode,
    }
}

export const AddSeymourArmor = (armorType, hex, itemUUID, printText) => {
    if (allOwnedSeymourArmor.hasOwnProperty(armorType)) {
        hex = hex.replace("#", "").toUpperCase()
        const colorData = SeymourExtractor.GetColorDataFromHex(hex)
        if (!ZCore.isNullOrUndefined(itemUUID) && itemUUID?.trim() == "") {
            itemUUID = null
        }
        colorData["itemUUID"] = itemUUID
        allOwnedSeymourArmor[armorType].push(colorData)
        allSeymourSignatures[armorType].add(colorData.s)

        if (printText) {
            ZCore.ChatMessage(`&aSuccessfully added seymour &e'&a${armorType}&e' &awith color &e'&a${hex}&e'&a.`)
        }
    } else {
        ZCore.ChatMessage(`&cInvalid seymour armor type: ${armorType}`)
    }
}
export const RemoveSeymourArmor = (armorType, hex) => {
    hex = hex.replace("#", "").toUpperCase()
    if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) {
        ZCore.ChatMessage("&cNo seymour armor to remove.")
        return
    }

    if (allOwnedSeymourArmor.hasOwnProperty(armorType)) {
        const index = allOwnedSeymourArmor[armorType].findIndex(itemData => itemData["hex"] == hex)
        if (index > -1) {
            allOwnedSeymourArmor[armorType].splice(index, 1)
            ZCore.ChatMessage(`&aSuccessfully removed seymour &e'&a${armorType}&e' &awith color &e'&a${hex}&e'&a.`)
        } else {
            ZCore.ChatMessage(`&cCouldn't find seymour &e'&a${armorType}&e' &cwith color &e'&a${hex}&e'&c.`)
        }
    } else {
        ZCore.ChatMessage(`&cInvalid seymour armor type: ${armorType}`)
    }
}
export const ClearSeymourArmor = () => {
    if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) {
        ZCore.ChatMessage("&cNo seymour armor to clear.")
        return
    }

    allOwnedSeymourArmor = {
        "helmet": [],
        "chestplate": [],
        "leggings": [],
        "boots": [],
    }
    lastOwnedSeymourArmorCount = 0
    LoadSeymourSignatures()
}

export const GetTotalOwnedSeymourArmorCount = () => {
    if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) return 0
    return allOwnedSeymourArmor.helmet.length + allOwnedSeymourArmor.chestplate.length + allOwnedSeymourArmor.leggings.length + allOwnedSeymourArmor.boots.length
}

export const LoadSeymourSignatures = () => {
    allSeymourSignatures = {
        "helmet": new Set(),
        "chestplate": new Set(),
        "leggings": new Set(),
        "boots": new Set(),
    }
    if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) return

    for (let armorType in allOwnedSeymourArmor) {
        allOwnedSeymourArmor[armorType].forEach(itemData => {
            let signature = SeymourExtractor.GetSignature(itemData["hex"])
            allSeymourSignatures[armorType].add(signature)
        })
    }
}

export const LoadOwnedSeymourArmor = () => {
    const filePath = `${ZCore.modulesFolder}/${Data.modulePrefixU}/Output/AllOwnedSeymourArmor.json`
    if (FileLib.exists(filePath)) {
        try {
            allOwnedSeymourArmor = JSON.parse(`${FileLib.read(filePath)}`)
            lastOwnedSeymourArmorCount = GetTotalOwnedSeymourArmorCount()
            LoadSeymourSignatures()

            if (lastOwnedSeymourArmorCount > 0) return
        } catch (e) {
            if (Constants.debug) ZCore.ChatDebug("&cError in LoadOwnedSeymourArmor", e, e.stack)
        }
    }

    allOwnedSeymourArmor = {
        "helmet": [],
        "chestplate": [],
        "leggings": [],
        "boots": [],
    }
    lastOwnedSeymourArmorCount = 0
    LoadSeymourSignatures()
    FileLib.write(filePath, JSON.stringify(allOwnedSeymourArmor))
}
function TryMigrateFoundSeymour() {
    if (ZCore.isNullOrUndefined(allFoundSeymourArmor)) return
    const armorTypes = ["helmet", "chestplate", "leggings", "boots"]
    let newValue = {}
    Object.keys(allFoundSeymourArmor).forEach(playerUUID => {
        let playerItems = allFoundSeymourArmor[playerUUID] || {}
        if (armorTypes.some(type => playerItems.hasOwnProperty(type))) {
            newValue[playerUUID] = {
                ...playerItems,
                wornItems: playerItems.wornItems || {},
            }
            if (!newValue[playerUUID]["wornItems"].hasOwnProperty("nonValuable")) {
                newValue[playerUUID]["wornItems"]["nonValuable"] = []
            }
            Object.keys(playerItems).forEach(itemType => {
                if (armorTypes.includes(itemType)) {
                    let items = playerItems[itemType] || []
                    items.forEach(hexCode => {
                        let itemID = "unknown"
                        let itemIndex = (Constants.armorPriority[itemType.toUpperCase()] - 1) ?? -1
                        if (itemIndex != -1) {
                            itemID = Constants.seymourItemIDs[itemIndex]
                        }
                        newValue[playerUUID]["wornItems"]["nonValuable"].push({
                            itemID: itemID,
                            hexCode: hexCode,
                        })
                    })
                    delete newValue[playerUUID][itemType]
                } else {
                    newValue[playerUUID][itemType] = playerItems[itemType]
                }
            })
        } else {
            newValue[playerUUID] = playerItems
        }
    })
    allFoundSeymourArmor = newValue
}
export const LoadFoundSeymourArmor = () => {
    const filePath = `${ZCore.modulesFolder}/${Data.modulePrefixU}/Output/AllFoundSeymourArmor.json`
    if (FileLib.exists(filePath)) {
        try {
            allFoundSeymourArmor = JSON.parse(`${FileLib.read(filePath)}`)
            TryMigrateFoundSeymour()
            return
        } catch (e) {
            if (Constants.debug) ZCore.ChatDebug("&cError in LoadFoundSeymourArmor", e, e.stack)
        }
    }
    allFoundSeymourArmor = {}
    FileLib.write(filePath, JSON.stringify(allFoundSeymourArmor))
}

export const SaveOwnedSeymourArmor = (forceSave = false) => {
    if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) return
    if (forceSave || GetTotalOwnedSeymourArmorCount() > 0) {
        const json = JSON.stringify(allOwnedSeymourArmor)
        if (ZCore.isNullOrUndefined(json)) return
        if (json == "{}" || json == "[]" || json == "" || !json) return
        FileLib.write(`${ZCore.modulesFolder}/${Data.modulePrefixU}/Output/AllOwnedSeymourArmor.json`, json)
    }
}
export const SaveFoundSeymourArmor = () => {
    if (ZCore.isNullOrUndefined(allFoundSeymourArmor)) return
    if (Object.keys(allFoundSeymourArmor).length > 0) {
        const json = JSON.stringify(allFoundSeymourArmor)
        if (ZCore.isNullOrUndefined(json)) return
        if (json == "{}" || json == "[]" || json == "" || !json) return
        FileLib.write(`${ZCore.modulesFolder}/${Data.modulePrefixU}/Output/AllFoundSeymourArmor.json`, json)
    }
}

export const GetValuableSeymourFromList = (armorList, callback) => {
    SeymourExtractor.GetValuableSeymourFromList(armorList, callback, {
        ...Settings,
        defaultSeymourArmorColors: defaultSeymourArmorColors,
        allSeymourSignatures: allSeymourSignatures,
        customSeymourWildcardHexes: Data.data.customSeymourWildcardHexes,
        blacklistedSeymourWords: Data.data.blacklistedSeymourWords,
        seymourWordMap: seymourWordMap,
        customSeymourWords: Data.data.customSeymourWords,
        customSeymourHexes: Data.data.customSeymourHexes,
        allOwnedSeymourArmor: allOwnedSeymourArmor,
        cielabVersionList: Settings.seymourScanningCielabSelector,
    })
}

export const GetVisualDistanceTier = (visualDifference, cielabVersion) => {
    return SeymourExtractor.GetVisualDistanceTier(visualDifference, cielabVersion)
}

function HasGlobalFeaturesInstalled() {
    return ZCore.isModLoaded("zls") || ZCore.isModLoaded("zls-seymour")
}

function registerCommands() {
    if (!HasGlobalFeaturesInstalled()) return

    ;(function() {
        const commandName = `${Data.newCommandPrefix}printcolordata`
        const commands = {
            _defaultWithInput: {
                handler: Command_HandlePrintColorData,
                args: [
                    {
                        name: "hex",
                        type: cString,
                    },
                ],
            },
        }

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                cArgument("hex", cString(), () => {
                    cExec(({ hex }) => {
                        ZCore.createCommandHandler(commands, "_defaultWithInput", hex)
                    })
                })
            }, [
                `${Data.oldCommandPrefix}printcolordata`,
                "printcolordata",
            ],
        )
    })()
    function Command_HandlePrintColorData(hex) {
        if (!hex) {
            ZCore.ChatMessage(`&cInvalid command. Usage: /${Data.newCommandPrefix}printcolordata <hex>`)
            return
        }

        hex = hex.replace("#", "")
        if (hex.length != 6) {
            ZCore.ChatMessage(`&cInvalid hex color: ${hex}`)
            return
        }

        ZCore.ChatMessage(JSON.stringify(SeymourExtractor.GetColorDataFromHex(hex), null, 4))
    }

    ;(function() {
        const commandName = `${Data.newCommandPrefix}addseymour`
        const commands = {
            _defaultWithInput: {
                handler: Command_HandleSeymourAdd,
                args: [
                    {
                        name: "armorType",
                        type: cString,
                    },
                    {
                        name: "hex",
                        type: cString,
                    },
                ],
            },
        }

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                cArgument("armorType", cString(), () => {
                    cArgument("hex", cString(), () => {
                        cExec(({ armorType, hex }) => {
                            ZCore.createCommandHandler(commands, "_defaultWithInput", armorType, hex)
                        })
                    })
                })
            }, [
                `${Data.oldCommandPrefix}addseymour`,
                "addseymour",
                `${Data.newCommandPrefix}seymouradd`,
                `${Data.oldCommandPrefix}seymouradd`,
                "seymouradd",
            ],
        )
    })()
    function Command_HandleSeymourAdd(armorType, hex) {
        if (!armorType || !hex) {
            ZCore.ChatMessage("&cInvalid command. Usage: /addseymour <armorType> <hex>")
            return
        }

        hex = hex.replace("#", "")
        if (hex.length != 6) {
            ZCore.ChatMessage(`&cInvalid hex color: ${hex}`)
            return
        }
        AddSeymourArmor(ZCore.GetArmorType(armorType), hex, null, true)
    }

    ;(function() {
        const commandName = `${Data.newCommandPrefix}removeseymour`
        const commands = {
            _defaultWithInput: {
                handler: Command_HandleSeymourRemove,
                args: [
                    {
                        name: "armorType",
                        type: cString,
                    },
                    {
                        name: "hex",
                        type: cString,
                    },
                ],
            },
        }

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                cArgument("armorType", cString(), () => {
                    cArgument("hex", cString(), () => {
                        cExec(({ armorType, hex }) => {
                            ZCore.createCommandHandler(commands, "_defaultWithInput", armorType, hex)
                        })
                    })
                })
            }, [
                `${Data.oldCommandPrefix}removeseymour`,
                "removeseymour",
                `${Data.newCommandPrefix}seymourremove`,
                `${Data.oldCommandPrefix}seymourremove`,
                "seymourremove",
                `${Data.newCommandPrefix}deleteseymour`,
                `${Data.oldCommandPrefix}deleteseymour`,
                "deleteseymour",
                `${Data.newCommandPrefix}seymourdelete`,
                `${Data.oldCommandPrefix}seymourdelete`,
                "seymourdelete",
            ],
        )
    })()
    function Command_HandleSeymourRemove(armorType, hex) {
        if (!armorType || !hex) {
            ZCore.ChatMessage("&cInvalid command. Usage: /removeseymour <armorType> <hex>")
            return
        }

        const hex = hex.replace("#", "")
        if (hex.length != 6) {
            ZCore.ChatMessage(`&cInvalid hex color: ${hex}`)
            return
        }

        RemoveSeymourArmor(ZCore.GetArmorType(armorType), hex)
    }

    ;(function() {
        const commandName = `${Data.newCommandPrefix}addoldtemseymourlist`
        const commands = {
            _defaultWithInput: {
                handler: Command_HandleAddTemSeymourList,
                args: [
                    {
                        name: "filePath",
                        type: cGreedyString,
                    },
                ],
            },
        }

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                cArgument("filePath", cString(), () => {
                    cExec(({ filePath }) => {
                        ZCore.createCommandHandler(commands, "_defaultWithInput", filePath)
                    })
                })
            }, [
                `${Data.newCommandPrefix}addseymourlist`,
                `${Data.newCommandPrefix}addoldtemseymour`,
                `${Data.oldCommandPrefix}addoldtemseymour`,
                "addoldtemseymour",
                `${Data.oldCommandPrefix}addoldtemseymourlist`,
                "addoldtemseymourlist",
                `${Data.newCommandPrefix}addtemexport`,
                `${Data.oldCommandPrefix}addtemexport`,
                "addtemexport",
                `${Data.newCommandPrefix}additemexport`,
                `${Data.oldCommandPrefix}additemexport`,
                "additemexport",
            ],
        )
    })()
    function Command_HandleAddTemSeymourList(filePath) {
        if (!filePath) {
            ZCore.ChatMessage(`&cInvalid command. Usage: /addtemseymourlist <filePath>.\n&cEnsure the file is in the folder 'modules/${Data.modulePrefixU}'.`)
            return
        }

        filePath = `${ZCore.modulesFolder}/${Data.modulePrefixU}/${filePath}`
        if (!FileLib.exists(filePath)) {
            ZCore.ChatMessage(`&cFile not found: '${filePath}'\n&cEnsure the file is in the folder 'modules/${Data.modulePrefixU}'.`)
            return
        }

        const fileContent = FileLib.read(filePath)
        const lines = fileContent.split("\n")
        const oldCount = GetTotalOwnedSeymourArmorCount()

        let i = -1
        lines.forEach(line => {
            i++
            try {
                let itemName = line.split(",")[0].replaceAll("\`", "")
                let hex = line.split("hex: ")[1].split(" ")[0].replaceAll("\`", "")
                AddSeymourArmor(ZCore.GetArmorType(itemName), hex, null, false)
            } catch (e) {
                ZCore.ChatMessage(`&cError adding seymour piece from '${filePath}' on line ${i}: ${line} | Error: ${e}`)
            }
        })

        const newCount = GetTotalOwnedSeymourArmorCount()
        if (newCount > oldCount) {
            const countDifference = newCount - oldCount
            ZCore.ChatMessage(`&aSuccessfully added ${ZCore.PrettyNumber(countDifference, true)}&ax seymour pieces from &e'&a${filePath}&e'&a.`)
            return
        }
        ZCore.ChatMessage(`&cDidn't add any seymour pieces from &e'&a${filePath}&e'&c.`)
    }

    ;(function() {
        const commandName = `${Data.newCommandPrefix}addseymouranalyzerexport`
        const commands = {
            _defaultWithInput: {
                handler: Command_HandleAddSeymourAnalyzerList,
                args: [
                    {
                        name: "filePath",
                        type: cGreedyString,
                    },
                ],
            },
            _defaultWithNoInput: {
                handler: Command_HandleAddSeymourAnalyzerList,
                args: [],
            },
        }

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                cArgument("filePath", cGreedyString(), () => {
                    cExec(({ filePath }) => {
                        ZCore.createCommandHandler(commands, "_defaultWithInput", filePath)
                    })
                })

                cExec(() => {
                    ZCore.createCommandHandler(commands, "_defaultWithNoInput")
                })
            }, [
                `${Data.newCommandPrefix}addseymouranalyzerlist`,
                `${Data.newCommandPrefix}addseymouranalyzer`,
                `${Data.oldCommandPrefix}addseymouranalyzerexport`,
                `${Data.oldCommandPrefix}addseymouranalyzerlist`,
                `${Data.newCommandPrefix}seymouranalyzerexport`,
                `${Data.newCommandPrefix}seymouranalyzerlist`,
                `${Data.newCommandPrefix}seymouranalyzer`,
                `${Data.oldCommandPrefix}seymouranalyzerexport`,
                `${Data.oldCommandPrefix}seymouranalyzerlist`,
                `${Data.oldCommandPrefix}seymouranalyzer`,
                `add${Data.newCommandPrefix}seymouranalyzerlist`,
                `add${Data.newCommandPrefix}seymouranalyzer`,
                "addseymouranalyzerlist",
                "addseymouranalyzer",
                "addseymouranalyzerexport",
                "seymouranalyzerexport",
                "seymouranalyzerlist",
            ],
        )
    })()
    function Command_HandleAddSeymourAnalyzerList(filePath) {
        if (!filePath) {
            const seymourAnalyzerFilePath = Paths.get(`${ZCore.modulesFolder}../../../seymouranalyzer/collection.json`).normalize().toAbsolutePath().toString()
            if (!FileLib.exists(seymourAnalyzerFilePath)) {
                ZCore.ChatMessage(`&cInvalid command. Usage: /addseymouranalyzerlist [filePath].`)
                return
            }
            filePath = seymourAnalyzerFilePath
        }

        if (!FileLib.exists(filePath)) {
            ZCore.ChatMessage(`&cFile not found: '${filePath}&c'.`)
            return
        }

        new Thread(() => {
            const fileContent = JSON.parse(FileLib.read(filePath))
            const oldCount = GetTotalOwnedSeymourArmorCount()

            let i = 0
            Object.entries(fileContent).forEach(([itemUUID, seymourData]) => {
                i++
                try {
                    itemUUID.replaceAll("-", "").toLowerCase().trim()
                    AddSeymourArmor(ZCore.GetArmorType(seymourData.pieceName), seymourData.hexcode, itemUUID, false)
                } catch (e) {
                    ZCore.ChatMessage(`&cError adding seymour piece from '${filePath}' on line ${i}: ${JSON.stringify(seymourData)} | Error: ${e.message}`)
                }
            })

            const newCount = GetTotalOwnedSeymourArmorCount()
            if (newCount > oldCount) {
                const countDifference = newCount - oldCount
                ZCore.ChatMessage(`&aSuccessfully added ${ZCore.PrettyNumber(countDifference, true)}&ax seymour pieces from &e'&a${filePath}&e'&a.`)
                return
            }
            ZCore.ChatMessage(`&cDidn't add any seymour pieces from &e'&a${filePath}&e'&c.`)
        }).start()
    }

    register("command", () => {
        if (ZCore.isNullOrUndefined(allOwnedSeymourArmor)) {
            ZCore.ChatMessage("&cNo seymour armor to clear.")
            return
        }

        const oldCount = GetTotalOwnedSeymourArmorCount()

        ClearSeymourArmor()
        SaveOwnedSeymourArmor(true)

        ZCore.ChatMessage(`&aSuccessfully cleared ${ZCore.PrettyNumber(oldCount, true)}&ax seymour pieces.`)
    }).setName(`${Data.newCommandPrefix}clearseymour`).setAliases([
        `${Data.oldCommandPrefix}clearseymour`,
        "clearseymour",
        `${Data.newCommandPrefix}clearseymourlist`,
        `${Data.oldCommandPrefix}clearseymourlist`,
        "clearseymourlist",
        `${Data.newCommandPrefix}seymourlistclear`,
        `${Data.oldCommandPrefix}seymourlistclear`,
        "seymourlistclear",
        `${Data.oldCommandPrefix}clearseymourlist`,
        "clearseymourlist",
        `${Data.newCommandPrefix}seymourclear`,
        `${Data.oldCommandPrefix}seymourclear`,
        "seymourclear",
    ])

    ;(function() {
        const commandName = `${Data.newCommandPrefix}customseymourword`
        const commands = {
            list: {
                handler: Command_HandleCustomSeymourWordList,
                args: [],
            },
            clear: {
                handler: Command_HandleCustomSeymourWordClear,
                args: [],
            },
            blacklist: {
                handler: Command_HandleCustomSeymourWordBlacklist,
                args: [
                    {
                        name: "word",
                        type: cString,
                    },
                ],
            },
            add: {
                handler: Command_HandleCustomSeymourWordAdd,
                args: [
                    {
                        name: "hexWord",
                        type: cString,
                    },
                    {
                        name: "realWord",
                        type: cString,
                        optional: true,
                    },
                ],
            },
            remove: {
                handler: Command_HandleCustomSeymourWordRemove,
                args: [
                    {
                        name: "hexWord",
                        type: cString,
                    },
                ],
            },
        }
        commands["_defaultWithInput"] = commands.add
        commands["_defaultNoInput"] = commands.list

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                Object.keys(commands).forEach((literalName) => {
                    if (literalName.startsWith("_")) return
                    ZCore.createCommandLiteral(commands, literalName)
                })
                cArgument("hexWord", cString(), () => {
                    cExec(({ hexWord }) => {
                        ZCore.createCommandHandler(commands, "_defaultWithInput", hexWord)
                    })
                })
                cExec(() => {
                    ZCore.createCommandHandler(commands, "_defaultNoInput")
                })
            }, [
                `${Data.oldCommandPrefix}customseymourword`,
                "customseymourword",
                `${Data.newCommandPrefix}customword`,
                `${Data.oldCommandPrefix}customword`,
                "customword",
                `${Data.newCommandPrefix}seymourword`,
                `${Data.oldCommandPrefix}seymourword`,
                "seymourword",
            ],
        )
    })()
    function Command_HandleCustomSeymourWordList() {
        if (Object.keys(Data.data.customSeymourWords).length == 0) {
            ZCore.ChatMessage("&cNo Custom Seymour Words.")
            return
        }

        ZCore.ChatMessage("&aCustom Seymour Words:")
        let i = 0
        Object.entries(Data.data.customSeymourWords).sort().forEach(([hexWord, realWord]) => {
            hexWord = `${hexWord}`.toUpperCase()
            i++
            let realWordString = realWord ? ` (${realWord})` : ""
            ZCore.ChatMessage(`   &6Word #${i} -> ${hexWord}${realWordString}`)
        })
    }
    function Command_HandleCustomSeymourWordClear() {
        Data.data.customSeymourWords = {}
        Data.data.save()
        ZCore.ChatMessage("&aCleared Custom Seymour Words.")
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function Command_HandleCustomSeymourWordBlacklist(word) {
        if (!word) {
            ZCore.ChatMessage("&cInvalid word. Usage: /customseymourword blacklist <word>")
            return
        }
        const seymourWord = word.toUpperCase()
        Data.data.blacklistedSeymourWords.push(seymourWord)
        Data.data.save()
        ZCore.ChatMessage(`&aBlacklisted seymour word: ${seymourWord}`)
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function Command_HandleCustomSeymourWordAdd(hexWord, realWord) {
        if (!hexWord) {
            ZCore.ChatMessage("&cInvalid word. Usage: /customseymourword add <hexWord> [realWord]")
            return
        }
        hexWord = `${hexWord}`.toUpperCase().replace(/^#/, '')
        const regex = /^[0-9A-F]{3,6}$/
        if (!regex.test(hexWord)) {
            ZCore.ChatMessage("&cInvalid hex word. Usage: /customseymourword add <hexWord> [realWord]")
            return
        }

        if (Data.data.customSeymourWords[hexWord]) {
            ZCore.ChatMessage("&cCustom word already exists.")
            return
        }

        realWord = realWord ? realWord.toUpperCase() : null
        Data.data.customSeymourWords[hexWord] = realWord
        Data.data.save()
        const realWordString = realWord ? ` (${realWord})` : ""
        ZCore.ChatMessage(`&aAdded custom seymour word: ${hexWord}${realWordString}`)
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function Command_HandleCustomSeymourWordRemove(hexWord) {
        if (!hexWord) {
            ZCore.ChatMessage("&cInvalid word. Usage: /customseymourword remove <word>")
            return
        }
        hexWord = `${hexWord}`.toUpperCase().replace(/^#/, '')
        if (!Data.data.customSeymourWords[hexWord]) {
            ZCore.ChatMessage("&cWord not found in custom word list.")
            return
        }

        delete Data.data.customSeymourWords[hexWord]
        Data.data.save()
        ZCore.ChatMessage(`&aRemoved custom seymour word: ${hexWord}`)
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }

    ;(function() {
        const commandName = `${Data.newCommandPrefix}customseymourhex`
        const commands = {
            list: {
                handler: Command_HandleCustomSeymourHexList,
                args: [],
            },
            clear: {
                handler: Command_HandleCustomSeymourHexClear,
                args: [],
            },
            add: {
                handler: Command_HandleCustomSeymourHexAdd,
                args: [
                    {
                        name: "hex",
                        type: cString,
                    },
                    {
                        name: "armorPiece",
                        type: cString,
                        optional: true,
                    },
                ],
            },
            remove: {
                handler: Command_HandleCustomSeymourHexRemove,
                args: [
                    {
                        name: "hex",
                        type: cString,
                    },
                    {
                        name: "armorPiece",
                        type: cString,
                        optional: true,
                    },
                ],
            },
        }
        commands["_defaultWithInput"] = commands.add
        commands["_defaultNoInput"] = commands.list

        ZCore.registerNewCommand(
            commandName,
            (...args) => { ZCore.createCommandHandler(commands, ...args) },
            () => {
                Object.keys(commands).forEach((literalName) => {
                    if (literalName.startsWith("_")) return
                    ZCore.createCommandLiteral(commands, literalName)
                })
                cArgument("hex", cString(), () => {
                    cArgument("armorPiece", cString(), () => {
                        cExec(({ hex, armorPiece }) => {
                            ZCore.createCommandHandler(commands, "_defaultWithInput", hex, armorPiece)
                        })
                    })
                    cExec(({ hex }) => {
                        ZCore.createCommandHandler(commands, "_defaultWithInput", hex)
                    })
                })
                cExec(() => {
                    ZCore.createCommandHandler(commands, "_defaultNoInput")
                })
            }, [
                `${Data.oldCommandPrefix}customseymourhex`,
                "customseymourhex",
                `${Data.newCommandPrefix}customhex`,
                `${Data.oldCommandPrefix}customhex`,
                "customhex",
                `${Data.newCommandPrefix}seymourhex`,
                `${Data.oldCommandPrefix}seymourhex`,
                "seymourhex",
                `${Data.newCommandPrefix}customseymourcolor`,
                `${Data.oldCommandPrefix}customseymourcolor`,
                "customseymourcolor",
                `${Data.newCommandPrefix}customcolor`,
                `${Data.oldCommandPrefix}customcolor`,
                "customcolor",
                `${Data.newCommandPrefix}seymourcolor`,
                `${Data.oldCommandPrefix}seymourcolor`,
                "seymourcolor",
            ],
        )
    })()
    function Command_HandleCustomSeymourHexList() {
        const customHexes = Data.data.customSeymourHexes
        const customWildcardHexes = Data.data.customSeymourWildcardHexes
        const customHexesLength = Object.keys(customHexes).length
        const customWildcardHexesLength = Object.keys(customWildcardHexes).length
        if (customHexesLength == 0 && customWildcardHexesLength == 0) {
            ZCore.ChatMessage("&cNo Custom Seymour Hexes.")
            return
        }

        const textComponent = new ZCore.ZTextComponent()
        const addHexEntries = (entries, label) => {
            if (entries.length == 0) return

            if (!textComponent.isEmpty()) {
                textComponent.withText("\n\n")
            }

            textComponent.withText(`&a${label}:`)
            entries.forEach(([hexCode, hexData], i) => {
                let hexCodeU = `${hexCode}`.toLowerCase()
                let armorTypeText = hexData.allTypes
                    ? "&aAll"
                    : hexData.armorTypeList?.length > 0
                        ? `&6${hexData.armorTypeList.map(type => ZCore.TitleCase(type)).join(", ")}`
                        : ""

                let hexCodeObject = {}
                if (hexCodeU.includes("x")) {
                    hexCodeObject = {
                        text: `&6#${hexCode}`,
                    }
                } else {
                    hexCodeObject = {
                        text: `#${hexCode}`,
                        color: `#${hexCode}`,
                    }
                }


                textComponent
                    .withText(`\n   &6Hex #${i + 1} &7-> `)
                    .withTextObject(hexCodeObject)
                if (armorTypeText) {
                    textComponent.withText(` &7- &7(${armorTypeText}&7)`)
                }
            })
        }

        addHexEntries(Object.entries(customHexes), "Custom Seymour Hexes")
        addHexEntries(Object.entries(customWildcardHexes), "Custom Seymour Wildcard Hexes")

        if (!textComponent.isEmpty()) {
            textComponent.chat()
        }
    }
    function Command_HandleCustomSeymourHexClear() {
        Data.data.customSeymourHexes = {}
        Data.data.customSeymourWildcardHexes = {}
        Data.data.save()
        ZCore.ChatMessage("&aCleared All Custom Seymour Hexes.")
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function Command_HandleCustomSeymourHexAdd(hexCode, armorPiece = null) {
        if (!hexCode) {
            ZCore.ChatMessage("&cInvalid hex. Usage: /customseymourhex add <hex> [armorPiece]")
            return
        }

        let seymourHex = hexCode.toUpperCase().replace("#", "")
        const armorType = armorPiece ? ZCore.GetArmorType(armorPiece.toLowerCase()) : null
        const isWildcard = seymourHex.includes("X")
        const hexList = isWildcard ? Data.data.customSeymourWildcardHexes : Data.data.customSeymourHexes
        const hexType = isWildcard ? "wildcard hex" : "hex"
        if (isWildcard) {
            seymourHex = SeymourExtractor.GetPrettySignature(seymourHex)
        }
        const existing = hexList[seymourHex] || {}

        if (existing?.allTypes) {
            ZCore.ChatMessage("&cCustom hex already exists for all armor types.")
            return
        }

        if (!armorType) {
            hexList[seymourHex] = { allTypes: true }
            UpdateCustomSeymourHexes(hexList, isWildcard)
            ZCore.ChatMessage(`&aAdded custom seymour ${hexType}: #${seymourHex}`)
            ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
            return
        }

        if (!existing) {
            hexList[seymourHex] = { armorTypeList: [armorType] }
        } else {
            const armorTypeList = existing.armorTypeList || []
            if (armorTypeList.includes(armorType)) {
                ZCore.ChatMessage(`&cCustom hex with armor type ${armorType} already exists.`)
                return
            }
            hexList[seymourHex].armorTypeList = [...armorTypeList, armorType]
        }
        UpdateCustomSeymourHexes(hexList, isWildcard)
        ZCore.ChatMessage(`&aAdded custom seymour ${hexType}: #${seymourHex} (${armorType})`)
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function Command_HandleCustomSeymourHexRemove(hexCode, armorPiece = null) {
        if (ZCore.isNullOrUndefined(hexCode)) {
            ZCore.ChatMessage("&cInvalid hex. Usage: /customseymourhex remove <hex> [armorPiece]")
            return
        }

        let seymourHex = hexCode.toUpperCase().replace("#", "")
        const armorType = armorPiece ? ZCore.GetArmorType(armorPiece.toLowerCase()) : null
        const isWildcard = seymourHex.includes("X")
        const hexList = isWildcard ? Data.data.customSeymourWildcardHexes : Data.data.customSeymourHexes
        const hexType = isWildcard ? "wildcard hex" : "hex"
        if (isWildcard) {
            seymourHex = SeymourExtractor.GetPrettySignature(seymourHex)
        }

        if (!hexList.hasOwnProperty(seymourHex)) {
            ZCore.ChatMessage(`&c${ZCore.TitleCase(hexType)} not found in custom hex list.`)
            return
        }

        if (armorType != null) {
            const armorTypeList = hexList[seymourHex].armorTypeList
            if (!armorTypeList.includes(armorType)) {
                ZCore.ChatMessage(`&cHex with armor type ${armorType} not found in custom hex list.`)
                return
            }

            armorTypeList.splice(armorTypeList.indexOf(armorType), 1)
            if (armorTypeList.length == 0) {
                delete hexList[seymourHex]
            } else {
                hexList[seymourHex].armorTypeList = armorTypeList
            }
            UpdateCustomSeymourHexes(hexList, isWildcard)
            ZCore.ChatMessage(`&aRemoved custom seymour ${hexType}: #${seymourHex} (${armorType})`)
            ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
            return
        }

        delete hexList[seymourHex]
        UpdateCustomSeymourHexes(hexList, isWildcard)
        ZCore.ChatMessage(`&aRemoved custom seymour ${hexType}: #${seymourHex}`)
        ChatLib.command(`clear${Data.newCommandPrefix}cache false`, true)
    }
    function UpdateCustomSeymourHexes(hexList, isWildcard) {
        if (isWildcard) {
            Data.data.customSeymourWildcardHexes = hexList
        } else {
            Data.data.customSeymourHexes = hexList
        }
        Data.data.save()
    }
}
registerCommands()
