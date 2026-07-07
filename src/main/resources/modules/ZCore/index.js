import * as ZRenderLib from "../ZRenderLib"
import * as ZCoreCore from "./core"
import { fetch } from "../ZRequest/fetch"

export const GetJavaClass = (className) => {
    return Java.type(className)
}

const JavaString = GetJavaClass("java.lang.String")
const ForgeLoader = GetJavaClass("net.minecraftforge.fml.loading.FMLLoader")

const mc = Client.getMinecraft()
export const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (ZJS)",
    "Content-Type": "application/json",
}
const usernameToUUIDLink = "https://api.mojang.com/users/profiles/minecraft"
const uuidToUsernameLink = "https://sessionserver.mojang.com/session/minecraft/profile"

export const versionToInt = (version) => ZCoreCore.versionToInt(version)
export const gameVersionString = ZCoreCore.gameVersionString
export const gameVersion = ZCoreCore.gameVersion
export const isLegacy = ZCoreCore.isLegacy
export const modulesFolder = (isLegacy) ? Config.modulesFolder : ZCoreCore.isZJS ?  ZJS.MODULES_FOLDER_PATH : ChatTriggers.MODULES_FOLDER
export const modsFolder = (isLegacy) ? `${modulesFolder}../../../mods` : FabricLoader.getInstance().getGameDir().resolve("mods").toString()
export const isZJS = ZCoreCore.isZJS
export const isFork = ZCoreCore.isFork

function rejectJavaObjects(key, value) {
    if (value && typeof value == "object" && value.getClass != undefined) {
        return "§c§lJAVA_ERROR§r"
    }
    return value
}
export const safeStringify = (obj) => {
    try {
        return JSON.stringify(obj, rejectJavaObjects)
    } catch(e) {
        return "error"
    }
}

export const PrettyNumber = (number, floor = false, decimalPlaces = 0) => {
    if (floor) {
        return PrettyNumber(Math.floor(number), decimalPlaces)
    }

    const roundedNumber = Number(number).toFixed(decimalPlaces)

    let parts = roundedNumber.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return parts.length > 1 ? parts.join(".") : parts[0]
}

const dividerColorList = ["&c", "&6", "&e", "&a", "&b", "&a", "&e", "&6", "&c"]
let localDivider = ""
export const GetDivider = (width = -1) => {
    if (localDivider != "") return localDivider
    const chatWidth = (width == -1) ? ChatLib.getChatWidth() : width

    const spaceWidth = ZRenderLib.getStringWidth(" ")
    const totalSpaces = Math.floor(chatWidth / spaceWidth)

    const spacesPerSegment = Math.floor(totalSpaces / dividerColorList.length)
    const extraSpaces = totalSpaces % dividerColorList.length

    let divider = ""
    for (let i = 0; i < dividerColorList.length; i++) {
        let segment = dividerColorList[i] + "&m"
        let spaces = spacesPerSegment
        if (i < extraSpaces) {
            spaces++
        }

        for (let j = 0; j < spaces; j++) {
            segment += " "
        }
        divider += segment
    }

    let randomChars = ""
    for (let i = 0; i < 5; i++) {
        randomChars += "§" + String.fromCharCode(Math.floor(Math.random() * 62) + 48)
    }
    divider += randomChars
    return divider
}

export const _ChatDebug = (prefix, ...strings) => ChatLib.chat(prefix + strings.join(" | "))
export const ChatLog = (...strings) => _ChatDebug("&6[&aLOG&6] &r", ...strings)
export const ChatDebug = (...strings) => {
    _ChatDebug("&6[&cDEBUG&6] &r", ...strings)
    console.log(strings.join(" | "))
}
export const ChatMessage = (...strings) => ChatLib.chat(strings.join(" | "))
export const JSONLog = (...strings) => {
    let finalStrings = []
    strings.forEach((str) => {
        finalStrings.push(safeStringify(str))
    })
    ChatLib.chat(finalStrings.join(" | "))
}
export const fixElementaText = (str="") => str.replace("&", "§")

export const GetMapItemFromIndex = (map, index) => { return map.get(Array.from(map.keys())[index]) }

export const romanToDecimal = (s) => {
    s = s.toUpperCase()
    value = 0
    for (let i = 0; i < s.length; i += 1) {
        romanValues[s[i]] < romanValues[s[i + 1]] ? value -= romanValues[s[i]] : value += romanValues[s[i]]
    }
    return value
}
export const decimalToRoman = (num) => {
    let result = ""
    Object.entries(romanValues).forEach(([letter, n]) => {
        result += letter.repeat(Math.floor(num / n))
        num %= n
    })
    return result
}

export const gzipDecompress = (byteArray) => {
    const input = new ByteArrayInputStream(byteArray)
    const gz = new GZIPInputStream(input)
    const out = new ByteArrayOutputStream()
    const buffer = JavaArray.newInstance(Byte.TYPE, 4096)
    let n
    while ((n = gz.read(buffer)) != -1) {
        out.write(buffer, 0, n)
    }
    gz.close()
    out.close()
    return new JavaString(out.toByteArray(), "UTF-8")
}

export const base64Decode = (str, loop = 1) => {
    for (let i = 0; i < loop; i++) {
        str = new JavaString(Base64.getDecoder().decode(str)).toString()
    }
    return str
}
export const base64Encode = (str) => {
    return Base64.getEncoder().encodeToString(new JavaString(str).getBytes())
}
export const numberToByte = (n) => {
    return n > 127 ? n - 256 : n
}
export const stringToBytes = (str) => {
    return new JavaString(str).getBytes("UTF-8")
}
export const bytesToString = (bytes, offset, length) => {
    return new JavaString(bytes, offset, length, "UTF-8").toString()
}

export const ReturnZeroIfNaN = (oldNumber) => {
    return (isNaN(oldNumber)) ? 0 : oldNumber
}

export const GetCorrectedUnixTimestamp = (timestamp) => {
    if (isNullOrUndefined(timestamp) || timestamp == 0) return -1
    const correctedTimestamp = GetCorrectedTimestamp(timestamp)
    return Math.floor(correctedTimestamp.getTime())
}

export const GetCorrectedTimestamp = (timestamp) => {
    if (!isNaN(timestamp)) {
        return new Date(Number(timestamp))
    }
    const shortYearPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2})\s/
    if (shortYearPattern.test(timestamp)) {
        const fixed = timestamp.replace(shortYearPattern, (_, m, d, y) => {
            const fullYear = 2000 + parseInt(y, 10)
            return `${m}/${d}/${fullYear} `
        })
        return new Date(fixed)
    }

    return new Date(timestamp)
}

export const TimestampFormat = (timestamp) => {
    return DateFormat(GetCorrectedTimestamp(timestamp))
}
// Month Day Hour:Minute PM/AM
export const DateFormat = (date) => {
    const isPM = date.getHours() >= 12

    let hours = date.getHours() % 12
    hours = hours == 0 ? 12 : hours

    let monthIndex = date.getMonth()
    let day = date.getDate()
    let year = date.getFullYear()
    let minutes = date.getMinutes().toString().padStart(2, "0")

    return `${shortMonths[monthIndex]}. ${day}, ${year}, ${hours}:${minutes} ${isPM  ? "PM" : "AM"}`
}

export const getOpenedInventory = () => {
    if (isLegacy) {
        return Player.getPlayer()?.field_71070_bA?.func_85151_d/*getLowerChestInventory*/() || null
    }
    if (isZJS) {
        return ZPlayer.getContainer() || null
    }
    return CTPlayer.getContainer() || null
}
export const getOpenedInventoryName = () => {
    if (isLegacy) {
        return Player.getPlayer()?.field_71070_bA?.func_85151_d/*getLowerChestInventory*/()?.func_70005_c_/*getName*/() || null
    }
    return Client.currentGui.get()?.title?.getString() || null
}
export const getItemStackInSlot = (slot, inventory = null) => {
    if (inventory == null) {
        inventory = getOpenedInventory()
    }
    if (isLegacy) {
        return inventory?.func_70301_a/*getStackInSlot*/(slot) || null
    }
    return inventory?.getStackInSlot(slot)?.mcValue || null
}

export const isNullOrUndefined = (item) => {
    return (item == undefined || item == null)
}

export const TimeStringToSeconds = (timeString) => {
    let min = 0
    let sec = 0

    if (timeString.includes("Minutes")) {
        return parseFloat(timeString.split(" Minutes")[0].trim()) * 60
    } else {
        if (timeString.includes("m")) {
            min = parseInt(timeString.split("m")[0])
            if (timeString.includes("s")) {
                sec = parseInt(timeString.split(" ")[1].split("s")[0])
            }
        }
        else {
            sec = parseInt(timeString.split("s")[0])
        }
    }
    return (min * 60) + sec
}

export const UncompactNumber = (abbrNumber) => {
    const abbrev = abbrNumber.slice(-1)
    const numberStr = abbrNumber.slice(0, -1)

    let multiplier = 1
    switch (abbrev) {
        case "k":
            multiplier = 1000
            break
        case "m":
            multiplier = 1000000
            break
        case "b":
            multiplier = 1000000000
            break
        case "t":
            multiplier = 1000000000000
            break
    }
    return (multiplier == 1) ? parseFloat(abbrNumber) : parseFloat(numberStr) * multiplier
}

const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"]
export const CompactNumber = (number) => {
    const tier = Math.log10(Math.abs(number)) / 3 | 0

    if (tier == 0) return number

    const suffix = SI_SYMBOL[tier]
    const scale = Math.pow(10, tier * 3)

    let scaled = number / scale
    let i = 2
    let scaledF = scaled.toFixed(i)
    let lengthF = scaledF.length
    while (scaledF.substring(lengthF, lengthF - 1) == "0") {
        i--
        scaledF = scaled.toFixed(i)
        lengthF = scaledF.length
        if (i == 0) break
    }
    return scaled.toFixed(i) + suffix
}

// xh xm xs
// export const secondsToTimeString = (seconds) => {
//     let min = Math.floor(seconds/60)
//     let hour = Math.floor(min/60)
//     if (hour > 0) return `${hour}h ${min - (hour * 60)}m ${seconds - ((min - (hour * 60)) * 60)}s`
//     return `${min}m ${seconds - (min * 60)}s`
// }
export const secondsToTimeString = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    let timeString = ""

    if (hours > 0) timeString += `${hours}h `

    if (minutes > 0 || hours > 0) timeString += `${minutes}m `

    if (remainingSeconds > 0) timeString += `${remainingSeconds}s`
    return timeString
}

export const repeat = (func, times) => {
    func()
    times && --times && repeat(func, times)
}

export const returnCenteredTextSpaces = (text) => {
    const textWidth = ZRenderLib.getStringWidth(ChatLib.addColor(text))
    const chatWidth = ChatLib.getChatWidth()

    if (textWidth >= chatWidth) {
        return text
    }

    const spaceWidth = (chatWidth - textWidth) / 2
    const spaceBuilder = new Array(parseInt((spaceWidth / ZRenderLib.getStringWidth(" ")).toFixed(0) + 1)).join(" ")
    return spaceBuilder
}

export const TitleCase = (newMessage) => {
    let finalMessage = ""
    newMessage.split(" ").forEach((part) => {
        finalMessage = finalMessage + part.toLowerCase().split("")[0].toUpperCase() + part.substring(1) + " "
    })
    finalMessage = finalMessage.substring(0, finalMessage.length - 1)

    if (finalMessage != null) {
        return finalMessage
    }
    return newMessage
}

export const AlternatingCase = (text, firstCharacterUpperCase = true) => {
    return text
        .split('')
        .map((char, index) => {
            const shouldBeUpper = firstCharacterUpperCase
                ? index % 2 == 0
                : index % 2 != 0
            return shouldBeUpper ? char.toUpperCase() : char.toLowerCase()
        })
        .join('')
}

export const rarityToColor = (rarity) => {
    switch (rarity) {
        case "COMMON":
            return "&f"
        case "UNCOMMON":
            return "&a"
        case "RARE":
            return "&9"
        case "EPIC":
            return "&5"
        case "LEGENDARY":
            return "&6"
        case "MYTHIC":
            return "&d"
        case "DIVINE":
            return "&b"
        case "SPECIAL":
            return "&c"
        case "VERY SPECIAL":
            return "&c"
    }
    return "&f"
}

export const isOnHypixel = () => {
    return Server.getIP().includes("hypixel")
}
export const isOnSkyblock = () => {
    const scoreBoard = ChatLib.removeFormatting(Scoreboard.getTitle())
    return isOnHypixel() && (scoreBoard.includes("SKIBLOCK") || scoreBoard.includes("SKYBLOCK"))
}

const romanValues = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
}
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

export const colorArray = [
    {"ColorName": "red", "ColorList": [255, 0, 0], "ColorCode": "§c", "RenderColor": ZRenderLib.RED},
    {"ColorName": "green", "ColorList": [0, 255, 0], "ColorCode": "§a", "RenderColor": ZRenderLib.GREEN},
    {"ColorName": "blue", "ColorList": [0, 0, 255], "ColorCode": "§9", "RenderColor": ZRenderLib.BLUE},
    {"ColorName": "yellow", "ColorList": [255, 255, 0], "ColorCode": "§e", "RenderColor": ZRenderLib.YELLOW},
    {"ColorName": "orange", "ColorList": [255, 170, 0], "ColorCode": "§6", "RenderColor": ZRenderLib.GOLD},
    {"ColorName": "aqua", "ColorList": [0, 255, 255], "ColorCode": "§b", "RenderColor": ZRenderLib.AQUA},
    {"ColorName": "cyan", "ColorList": [0, 170, 170], "ColorCode": "§3", "RenderColor": ZRenderLib.DARK_AQUA},
    {"ColorName": "pink", "ColorList": [255, 0, 255], "ColorCode": "§d", "RenderColor": ZRenderLib.LIGHT_PURPLE},
    {"ColorName": "purple", "ColorList": [118, 0, 188], "ColorCode": "§5", "RenderColor": ZRenderLib.DARK_PURPLE},
    {"ColorName": "black", "ColorList": [0, 0, 0], "ColorCode": "§8", "RenderColor": ZRenderLib.BLACK},
    {"ColorName": "gray", "ColorList": [85, 85, 85], "ColorCode": "§7", "RenderColor": ZRenderLib.GRAY},
    {"ColorName": "white", "ColorList": [255, 255, 255], "ColorCode": "§f", "RenderColor": ZRenderLib.WHITE}
]
export const colorStringArray = [
    "§cRed",
    "§aGreen",
    "§9Blue",
    "§eYellow",
    "§bAqua",
    "§dPink",
    "§3Cyan",
    "§5Purple",
    "§8Black",
    "§7Gray",
    "§fWhite"
]

export const GetColorIndexFromName = (colorName) => {
    return colorArray.findIndex(color => color.ColorName == colorName)
}

export const GetColorDataFromIndex = (colorIndex) => {
    return colorArray[colorIndex]
}

export const CapitalizeFirstLetter = (text) => {
    return text.toLowerCase().split("")[0].toUpperCase() + text.substring(1)
}

export const RGBAToLong = (r, g, b, a) => {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF) | ((a & 0xFF) << 24)
}
export const ColorToInt = (r, g, b) => {
    return r * 65536 + g * 256 + b
}

// export const IsStringOrTextComponentEmpty = (value) => {
//     if (typeof value == "string") {
//         return value.trim() == ""
//     } else if (value instanceof TextComponent) {
//         return value.unformattedText.toString().trim() == ""
//     } else if (value instanceof ZTextComponent) {
//         return value.isEmpty()
//     }
//     return false
// }

export const GetUnformattedStringOrTextComponent = (value) => {
    if (typeof value == "string") {
        return ChatLib.removeFormatting(value)
    } else if (value instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // return value.unformattedText
    } else if (value instanceof ZTextComponent) {
        return value.getUnformattedText()
    }
    return null
}
export const GetFormattedStringOrTextComponent = (value) => {
    if (typeof value == "string") {
        return value
    } else if (value instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // return value.formattedText
    } else if (value instanceof ZTextComponent) {
        return value.getFormattedText()
    }
    return value
}

export const GetUnformattedScoreboardLines = () => {
    let lines = []
    if (isLegacy) {
        Scoreboard.getLines(false).map(line => line?.getName()?.removeFormatting()?.replace(/(?!✌)[^\u0000-\u007F]/g, ""))?.forEach(line => {
            line = ChatLib.removeFormatting(line).trim()
            lines.push(line)
        })
        return lines
    }
    Scoreboard.getLines(false).map(line => ChatLib.removeFormatting(line?.getName()?.formattedText).trim().replace(/(?!✌)[^\u0000-\u007F]/g, ""))?.forEach(line => {
        lines.push(line)
    })
    return lines
}

export const CheckIfOnIslandFromScoreboardLines = (scoreboardLines, islandName) => {
    if (isNullOrUndefined(scoreboardLines)) return false

    for (let i = 0; i < scoreboardLines.length; i++) {
        if (scoreboardLines[i].includes(islandName)) return true
    }
    return false
}

export const CheckIfOnIsland = (islandName) => {
    const scoreboardLines = GetUnformattedScoreboardLines()
    return CheckIfOnIslandFromScoreboardLines(scoreboardLines, islandName)
}

export const GetServerPlayerList = () => {
    const playerList = []

    const NetHandlerPlayClient = Client.getConnection()
    if (isLegacy) {
        const scoreboard = Scoreboard.getScoreboard()
        const teams = scoreboard?.func_96525_g/*getTeams*/()
        if (isNullOrUndefined(teams)) return []

        teams.forEach(team => {
            let players = team.func_96670_d/*getMembershipCollection*/()
            players.forEach(player => {
                let networkPlayerInfo = NetHandlerPlayClient.func_175104_a/*getPlayerInfo*/(player)
                if (isNullOrUndefined(networkPlayerInfo)) return

                let playerMP = new PlayerMP(new RemotePlayer(World.getWorld(), networkPlayerInfo.func_178845_a/*getGameProfile*/()))
                if (isNullOrUndefined(playerMP)) return

                let formattedName = playerMP.getDisplayName().getText().trim()
                let playerUUID = NormalizePlayerUUID(playerMP.getUUID().toString())

                playerList.push({
                    playerObject: playerMP,
                    uuid: playerUUID,
                    usernameAndRank: formattedName,
                })
            })
        })
        return playerList
    }
    let scoreboard = Scoreboard.getScoreboard()
    let teams = scoreboard?.getPlayerTeams()
    if (isNullOrUndefined(teams)) return []

    teams.forEach(team => {
        let players = team.getPlayers()
        players.forEach(player => {
            let networkPlayerInfo = NetHandlerPlayClient.getPlayerInfo(player)
            if (isNullOrUndefined(networkPlayerInfo)) return

            let teamSuffix = new TextComponent(team.getPlayerSuffix() || "")
            let playerName = ""
            let playerUUID = ""
            if (gameVersion <= 12108) {
                playerName = networkPlayerInfo.profile.getName()
                playerUUID = networkPlayerInfo.profile.getId().toString()
            } else {
                playerName = networkPlayerInfo.profile.name()
                playerUUID = networkPlayerInfo.profile.id().toString()
            }
            let displayName = null
            let teamColor = ""
            if (isZJS) {
                teamColor = new ZTeam(team).getTextColor()
            } else {
                teamColor = new CTTeam(team).getTextColor()
            }
            if (teamColor != null) {
                displayName = new TextComponent({
                    text: playerName,
                    color: teamColor,
                })
            } else {
                displayName = new TextComponent(playerName)
            }

            let playerMP = new PlayerMP(new RemotePlayer(World.toMC(), networkPlayerInfo.profile))
            let formattedName = new TextComponent("").withText(displayName).withText(teamSuffix)

            playerList.push({
                playerObject: playerMP,
                uuid: NormalizePlayerUUID(playerUUID),
                usernameAndRank: formattedName.formattedText,
            })
        })
    })
    return playerList
}

export const NormalizePlayerUUID = (playerUUID) => {
    return playerUUID.toString().replaceAll("-", "").toLowerCase()
}

export const TryReplace = (original, textToReplace, newText, exactOnly = false) => {
    if (exactOnly) return original == textToReplace ? newText : original
    if (original.includes(textToReplace)) {
        original = original.replace(textToReplace, newText)
    }
    return original
}

export const CopyLockedFile = (sourcePathString, destinationPathString) => {
    const sourcePath = Paths.get(sourcePathString).normalize()
    const destinationPath = Paths.get(destinationPathString).normalize()

    const sourceFile = new JavaFile(sourcePath.toString())
    const destFile = new JavaFile(destinationPath.toString())

    try {
        const fis = new FileInputStream(sourceFile)
        const sourceChannel = fis.getChannel()
        const fos = new FileOutputStream(destFile)
        const destChannel = fos.getChannel()
        let  count = 0
        let size = sourceChannel.size()

        while (count < size) {
            count += destChannel.transferFrom(
                sourceChannel,
                count,
                size - count
            )
        }
    }
    catch (e) { }
}

export const DeleteLockedFile = (filePathString) => {
    const filePath = Paths.get(filePathString).normalize()
    const file = new JavaFile(filePath.toString())

    if (!file.exists()) return true

    file.setWritable(true, false)

    if (file.delete()) return true

    try {
        Files.delete(filePath)
        return true
    }
    catch (e) { }

    try {
        const fos = new FileOutputStream(file, true)
        fos.close()
    }
    catch (e) { }

    file.deleteOnExit()
    return false
}

export const CopyFolderRecursive = (source, destination, exclusions = []) => {
    const sourcePath = Paths.get(source).normalize()
    const destinationPath = Paths.get(destination).normalize()

    if (!Files.exists(sourcePath)) return

    Files.walk(sourcePath).forEach((file) => {
        if (exclusions.some((exclusion) => file.startsWith(exclusion))) return

        const relativePath = sourcePath.relativize(file)
        const destFile = destinationPath.resolve(relativePath)

        if (Files.isDirectory(file)) {
            Files.createDirectories(destFile)
        } else {
            Files.copy(file, destFile, StandardCopyOption.REPLACE_EXISTING)
        }
    })
}

export const DeleteFolderRecursive = (folderPathString) => {
    const folderPath = Paths.get(folderPathString).normalize()
    const folder = new JavaFile(folderPath.toString())

    if (folder.exists()) {
        folder.listFiles().forEach((file) => {
            if (file.isDirectory()) {
                DeleteFolderRecursive(file.getPath())
            }
            file.delete()
        })
        folder.delete()
    }
}

export const SplitStringOrTextComponentByNewline = (text) => {
    let lineU = GetUnformattedStringOrTextComponent(text).trim()
    if (lineU == "") {
        return [new ZTextComponent()]
    }

    if (typeof text == "string") {
        return text.split("\n")
    } else if (text instanceof TextComponent) {
        throw new Error("TextComponent is not supported")
        // const list = []
        // ZRenderLib.splitText(text, 512).lines.forEach((line) => {
        //     list.push(new ZTextComponent().withText(line))
        // })
        // return list
    } else if (text instanceof ZTextComponent) {
        const list = []
        ZRenderLib.splitText(text.build(true), 512).lines.forEach((line) => {
            list.push(new ZTextComponent().withTextComponent(new TextComponent(line)))
        })
        return list
    }
    return null
}

export const GetPlayerLevelColor = (playerLevel) => {
    let levelColor = "&7"
    if (playerLevel >= 40) levelColor = "&f"
    if (playerLevel >= 80) levelColor = "&e"
    if (playerLevel >= 120) levelColor = "&a"
    if (playerLevel >= 160) levelColor = "&2"
    if (playerLevel >= 200) levelColor = "&b"
    if (playerLevel >= 240) levelColor = "&3"
    if (playerLevel >= 280) levelColor = "&9"
    if (playerLevel >= 320) levelColor = "&d"
    if (playerLevel >= 360) levelColor = "&5"
    if (playerLevel >= 400) levelColor = "&6"
    if (playerLevel >= 440) levelColor = "&c"
    if (playerLevel >= 480) levelColor = "&4"

    return `${levelColor}${playerLevel}`
}

export const GetClassName = (classObject) => {
    return classObject?.getClass()?.getName() || "ERROR"
}

export const getCustomNBT = (itemStack) => {
    return ((gameVersion <= 12108) ?
        itemStack.get(DataComponents.CUSTOM_DATA)?.nbt :
        itemStack.get(DataComponents.CUSTOM_DATA)?.copyTag()
    ) || null
}
export const setCustomNBT = (itemStack, nbtData) => {
    itemStack.set(DataComponents.CUSTOM_DATA, CustomData.of(nbtData))
}
export const getTag = (nbtCompound, type, key) => {
    if (type == "byte") {
        return getByteTag(nbtCompound, key)
    } else if (type == "short") {
        return getShortTag(nbtCompound, key)
    } else if (type == "int") {
        return getIntTag(nbtCompound, key)
    } else if (type == "long") {
        return getLongTag(nbtCompound, key)
    } else if (type == "float") {
        return getFloatTag(nbtCompound, key)
    } else if (type == "double") {
        return getDoubleTag(nbtCompound, key)
    } else if (type == "string") {
        return getStringTag(nbtCompound, key)
    } else if (type == "byteArray") {
        return getByteArrayTag(nbtCompound, key)
    } else if (type == "intArray") {
        return getIntArrayTag(nbtCompound, key)
    } else if (type == "longArray") {
        return getLongArrayTag(nbtCompound, key)
    } else if (type == "boolean") {
        return getBooleanTag(nbtCompound, key)
    } else if (type == "compoundTag") {
        return getCompoundTagTag(nbtCompound, key)
    }
    return null
}
export const tagContainsKey = (nbtCompound, key, type = null) => {
    if (isLegacy) {
        if (type != null) {
            return nbtCompound.func_150297_b/*hasKey*/(key, type)
        }
        return nbtCompound.func_74764_b/*hasKey*/(key)
    }
    return nbtCompound.contains(key)
}
export const getTagList = (nbtCompound, key, type) => {
    if (isLegacy) {
        return nbtCompound.func_150295_c/*getTagList*/(key, type)
    }
    return nbtCompound.getList(key).orElse(null)
}
export const getTagListCount = (nbtCompound) => {
    if (isLegacy) {
        return nbtCompound.func_74745_c/*tagCount*/()
    }
    return nbtCompound.size()
}
export const getTagListKeys = (nbtCompound) => {
    if (isLegacy) {
        return nbtCompound.func_150296_c/*getKeySet*/()
    }
    return nbtCompound.keySet()
}
export const getTagListEntries = (nbtCompound) => {
    if (isLegacy) {
        throw new Error("getTagListEntries is not supported in legacy mode")
    }
    return nbtCompound.entrySet()
}
export const getStringTagAt = (nbtCompound, index) => {
    if (isLegacy) {
        return nbtCompound.func_150307_f/*getStringTagAt*/(index)
    }
    return nbtCompound.getString(index).orElse(null)
}
export const getCompoundTagAt = (nbtCompound, index) => {
    if (isLegacy) {
        return nbtCompound.func_150305_b/*getCompoundTagAt*/(index)
    }
    return nbtCompound.getCompound(index).orElse(null)
}

export const getByteTag = (nbtCompound, key) => {
    return nbtCompound.getByte(key).orElse(null)
}
export const getShortTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74765_d/*getShort*/(key)
    }
    return nbtCompound.getShort(key).orElse(null)
}
export const getIntTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74762_e/*getInt*/(key)
    }
    return nbtCompound.getInt(key).orElse(null)
}
export const getLongTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74763_f/*getLong*/(key)
    }
    return nbtCompound.getLong(key).orElse(null)
}
export const getFloatTag = (nbtCompound, key) => {
    return nbtCompound.getFloat(key).orElse(null)
}
export const getDoubleTag = (nbtCompound, key) => {
    return nbtCompound.getDouble(key).orElse(null)
}
export const getStringTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74779_i/*getString*/(key)
    }
    return nbtCompound.getString(key).orElse(null)
}
export const getByteArrayTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74770_j/*getByteArray*/(key)
    }
    return nbtCompound.getByteArray(key).orElse(null)
}
export const getIntArrayTag = (nbtCompound, key) => {
    return nbtCompound.getIntArray(key).orElse(null)
}
export const getLongArrayTag = (nbtCompound, key) => {
    return nbtCompound.getLongArray(key).orElse(null)
}
export const getBooleanTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74767_n/*getBoolean*/(key)
    }
    return nbtCompound.getBoolean(key).orElse(null)
}
export const getCompoundTagTag = (nbtCompound, key) => {
    if (isLegacy) {
        return nbtCompound.func_74775_l/*getCompoundTag*/(key)
    }
    return nbtCompound.get(key)
}

export const setTag = (nbtCompound, type, key, value) => {
    if (type == "byte") {
        return setByteTag(nbtCompound, key, value)
    } else if (type == "short") {
        return setShortTag(nbtCompound, key, value)
    } else if (type == "int") {
        return setIntTag(nbtCompound, key, value)
    } else if (type == "long") {
        return setLongTag(nbtCompound, key, value)
    } else if (type == "float") {
        return setFloatTag(nbtCompound, key, value)
    } else if (type == "double") {
        return setDoubleTag(nbtCompound, key, value)
    } else if (type == "string") {
        return setStringTag(nbtCompound, key, value)
    } else if (type == "byteArray") {
        return setByteArrayTag(nbtCompound, key, value)
    } else if (type == "intArray") {
        return setIntArrayTag(nbtCompound, key, value)
    } else if (type == "longArray") {
        return setLongArrayTag(nbtCompound, key, value)
    } else if (type == "boolean") {
        return setBooleanTag(nbtCompound, key, value)
    } else if (type == "compoundTag") {
        return setCompoundTagTag(nbtCompound, key, value)
    }
    return null
}
export const setByteTag = (nbtCompound, key, value) => {
    return nbtCompound.putByte(key, value)
}
export const setShortTag = (nbtCompound, key, value) => {
    return nbtCompound.putShort(key, value)
}
export const setIntTag = (nbtCompound, key, value) => {
    return nbtCompound.putInt(key, value)
}
export const setLongTag = (nbtCompound, key, value) => {
    return nbtCompound.putLong(key, value)
}
export const setFloatTag = (nbtCompound, key, value) => {
    return nbtCompound.putFloat(key, value)
}
export const setDoubleTag = (nbtCompound, key, value) => {
    return nbtCompound.putDouble(key, value)
}
export const setStringTag = (nbtCompound, key, value) => {
    return nbtCompound.putString(key, value)
}
export const setByteArrayTag = (nbtCompound, key, value) => {
    return nbtCompound.putByteArray(key, value)
}
export const setIntArrayTag = (nbtCompound, key, value) => {
    return nbtCompound.putIntArray(key, value)
}
export const setLongArrayTag = (nbtCompound, key, value) => {
    return nbtCompound.putLongArray(key, value)
}
export const setBooleanTag = (nbtCompound, key, value) => {
    return nbtCompound.putBoolean(key, value)
}
export const setCompoundTagTag = (nbtCompound, key, value) => {
    return nbtCompound.put(key, normalizeTag(value))
}

export const normalizeTag = (value) => {
    if (value instanceof NBTTagCompound) {
        return value.mcValue
    }
    if (value instanceof net.minecraft.nbt.Tag) {
        return value
    }
    throw new Error(`Invalid tag type: ${typeof value}`)
}

export const removeTag = (nbtCompound, key) => {
    return nbtCompound.remove(key)
}

export const getItemStackName = (itemStack, formatted = true) => {
    if (isLegacy) {
        let name = itemStack.func_82833_r/*getDisplayName*/()
        return (formatted) ? name : ChatLib.removeFormatting(name).toLowerCase()
    }
    let name = new TextComponent(itemStack.getHoverName())
    return (formatted) ? name.formattedText : name.unformattedText.toLowerCase()
}
export const setItemStackName = (itemStack, name) => {
    if (isLegacy) {
        itemStack.func_151001_c/*setStackDisplayName*/(name)
        return
    }
    itemStack.set(DataComponents.CUSTOM_NAME, new TextComponent(name))
}
export const getItemStackLore = (itemStack, formatted = true) => {
    if (isLegacy) {
        const loreLines = []
        const itemLore = getCustomDataNBT(itemStack).func_74775_l("display").func_150295_c("Lore", 8)
        const loreCount = getTagListCount(itemLore)
        for (let i = 0; i < loreCount; i++) {
            let loreLine = getStringTagAt(itemLore, i)
            if (!formatted) {
                loreLine = ChatLib.removeFormatting(loreLine).toLowerCase()
            }
            loreLines.push(loreLine)
        }
        return loreLines
    }
    const loreComponent = itemStack.get(DataComponents.LORE)
    return new ArrayList(loreComponent?.lines() || []).map(line => {
        if (formatted) {
            return new TextComponent(line).formattedText
        }
        return new TextComponent(line).unformattedText.toLowerCase()
    })
}
export const getCustomDataNBT = (item) => {
    const itemStack = getItemStack(item)
    if (isLegacy) {
        return legacyGetOrCreateCustomNBT(itemStack)
    }
    const customDataComponent = itemStack.get(DataComponents.CUSTOM_DATA)

    if (customDataComponent) {
        return ((gameVersion <= 12108) ?
            customDataComponent.nbt :
            customDataComponent.copyTag()
        ) || null
    }
    return ((gameVersion <= 12108) ?
        CustomData.DEFAULT.nbt.copy() :
        CustomData.EMPTY.copyTag()
    ) || null
}

export const legacyGetOrCreateCustomNBT = (itemStack) => {
    let nbt = itemStack.func_77978_p()
    if (nbt == null) {
        nbt = new net.minecraft.nbt.NBTTagCompound()
        itemStack.func_77982_d(nbt)
    }
    return nbt
}

export const getLeatherArmorColorInt = (itemStack) => {
    if (isLegacy) {
        throw new Error("getLeatherArmorColorInt is not supported in legacy mode")
    }
    const dyedComponent = itemStack.get(DataComponents.DYED_COLOR)
    return (dyedComponent != null) ? dyedComponent.rgb() : null
}

export const isLeatherArmorType = (itemType) => {
    return leatherArmorNames.has(itemType)
}
export const isLeatherArmor = (itemStack) => {
    if (isLegacy) {
        const itemStack = getItemStack(itemStack)
        const registryName = itemStack.func_77973_b().registryName
        return (
            registryName == "minecraft:leather_helmet" ||
            registryName == "minecraft:leather_chestplate" ||
            registryName == "minecraft:leather_leggings" ||
            registryName == "minecraft:leather_boots"
        )
    }

    const item = itemStack.getItem()
    return (
        item == Items.LEATHER_HELMET ||
        item == Items.LEATHER_CHESTPLATE ||
        item == Items.LEATHER_LEGGINGS ||
        item == Items.LEATHER_BOOTS
    )
}
export const getItemStackNBTObject = (itemStack) => {
    if (itemStack == null) return null
    if (!isLegacy && itemStack.isEmpty()) return null
    let finalObject = {}
    let itemID = null
    let customNBT = null
    let loreLines = []
    let itemName = null
    let dyedColorInt = null

    if (isLegacy) {
        return convertNBTToNBTObject(getCustomDataNBT(itemStack))
    }
    itemID = getItemStackRegistryName(itemStack)

    customNBT = ((gameVersion <= 12108) ?
        itemStack.get(DataComponents.CUSTOM_DATA)?.nbt :
        itemStack.get(DataComponents.CUSTOM_DATA)?.copyTag()
    ) || null

    const loreComponent = itemStack.get(DataComponents.LORE)
    loreLines = new ArrayList(loreComponent?.lines() || []).map(line => {
        return new TextComponent(line).formattedText
    })

    const customNameComponent = itemStack.get(DataComponents.CUSTOM_NAME)
    if (customNameComponent == null) {
        itemName = new TextComponent(itemStack.get(DataComponents.ITEM_NAME)).formattedText
    } else {
        itemName = new TextComponent(customNameComponent).formattedText
    }

    if (isLeatherArmor(itemStack)) {
        dyedColorInt = getLeatherArmorColorInt(itemStack)
    }

    if (itemID != null) finalObject["id"] = itemID
    if (customNBT != null) {
        finalObject["ExtraAttributes"] = getReadableNBTDump(customNBT)
        finalObject["RawExtraAttributes"] = customNBT
    }
    if ((loreLines.length > 0 || dyedColorInt != null || itemName) && !finalObject.hasOwnProperty("display")) finalObject["display"] = {}
    if (loreLines.length > 0) finalObject["display"]["Lore"] = loreLines
    if (itemName) finalObject["display"]["Name"] = itemName
    if (dyedColorInt != null) finalObject["display"]["color"] = dyedColorInt

    return finalObject
}
export const convertNBTToNBTObject = (itemNBT) => {
    if (itemNBT == null) return null
    let finalObject = {}
    let itemID = null
    let customNBT = null
    let loreLines = []
    let itemName = null
    let dyedColorInt = null

    itemID = GetModernitemIDRegistryName(getShortTag(itemNBT, "id"))

    if (tagContainsKey(itemNBT, "tag")) {
        itemNBT = getCompoundTagTag(itemNBT, "tag")
    }

    customNBT = null
    if (tagContainsKey(itemNBT, "ExtraAttributes")) {
        customNBT = getCompoundTagTag(itemNBT, "ExtraAttributes")
    }

    if (tagContainsKey(itemNBT, "display")) {
        const displayTag = getCompoundTagTag(itemNBT, "display")

        if (tagContainsKey(displayTag, "Lore", 9)) {
            const itemLore = getTagList(displayTag, "Lore", 8)
            const loreCount = getTagListCount(itemLore)
            for (let i = 0; i < loreCount; i++) {
                const loreLine = getStringTagAt(itemLore, i)
                loreLines.push(loreLine)
            }
        }

        if (tagContainsKey(displayTag, "Name")) {
            itemName = getStringTag(displayTag, "Name")
        }

        if (tagContainsKey(displayTag, "color")) {
            dyedColorInt = getIntTag(displayTag, "color")
        }
    }

    if (itemID != null) finalObject["id"] = itemID
    if (customNBT != null) finalObject["ExtraAttributes"] = customNBT
    if ((loreLines.length > 0 || dyedColorInt != null || itemName) && !finalObject.hasOwnProperty("display")) finalObject["display"] = {}
    if (loreLines.length > 0) finalObject["display"]["Lore"] = loreLines
    if (itemName) finalObject["display"]["Name"] = itemName
    if (dyedColorInt != null) finalObject["display"]["color"] = dyedColorInt

    return finalObject
}

export const GetValueOfNBTTag = (nbtCompound, key = null) => {
    if (nbtCompound == null) return null
    if (nbtCompound instanceof ByteArrayTag) {
        return nbtCompound.getAsByteArray()
    }
    if (nbtCompound instanceof ByteTag) {
        return nbtCompound.byteValue()
    }
    if (nbtCompound instanceof CompoundTag) {
        const obj = {}
        nbtCompound.keySet().toArray().forEach(k => {
            obj[k] = GetValueOfNBTTag(nbtCompound.get(k))
        })
        return obj
    }
    if (nbtCompound instanceof DoubleTag) {
        return nbtCompound.doubleValue()
    }
    if (nbtCompound instanceof FloatTag) {
        return nbtCompound.floatValue()
    }
    if (nbtCompound instanceof IntArrayTag) {
        return nbtCompound.getAsIntArray()
    }
    if (nbtCompound instanceof IntTag) {
        return nbtCompound.intValue()
    }
    if (nbtCompound instanceof LongArrayTag) {
        return nbtCompound.getAsLongArray()
    }
    if (nbtCompound instanceof LongTag) {
        return nbtCompound.longValue()
    }
    if (nbtCompound instanceof ShortTag) {
        return nbtCompound.shortValue()
    }
    if (nbtCompound instanceof StringTag) {
        return nbtCompound.value()
    }
    if (nbtCompound instanceof CollectionTag) {
        const arr = []
        for (let i = 0; i < nbtCompound.size(); i++) {
            arr.push(GetValueOfNBTTag(nbtCompound.get(i)))
        }
        return arr
    }
    throw new Error(`GetValueOfNBTTag - Unsupported NBT type ${nbtCompound.getClass().getName()}`)
}
export const getReadableNBTDump = (tag) => {
    if (!tag) return {}
    const result = {}
    tag.keySet().toArray().forEach(key => {
        const value = GetValueOfNBTTag(tag.get(key), key)
        result[key] = value
    })
    return result
}

export const getItemStack = (item) => {
    if (isLegacy) {
        if (item instanceof com.chattriggers.ctjs.minecraft.wrappers.inventory.Item) {
            return item.itemStack
        }
        return item
    }
    if (item instanceof com.chattriggers.ctjs.api.inventory.CTItem || item instanceof ZItem) {
        return item.mcValue
    }
    return item
}

export const getItemStackRegistryName = (itemStack) => {
    if (isLegacy) {
        return getItemStack(itemStack).func_77973_b().registryName
    }
    return itemStack.getItem().toString() || "minecraft:air"
}

export const getCustomNBTTagFromNBTObject = (itemNBTObject, type, key) => {
    if (!itemNBTObject) return null
    if (!itemNBTObject.hasOwnProperty("ExtraAttributes")) return null
    const extraTag = itemNBTObject["ExtraAttributes"]
    if (isNullOrUndefined(extraTag)) return null

    return getTag(extraTag, type, key)
}
export const getCustomNBTTagFromItemStack = (itemStack, type, key) => {
    return getCustomNBTTag(getCustomNBT(itemStack), type, key)
}
export const getCustomNBTTag = (customData, type, key) => {
    if (isNullOrUndefined(customData)) return null
    return getTag(customData, type, key)
}

export const LegacyGetItemStackFromHoverEvent = (event) => {
    let item = null
    if (mc.currentScreen != null && mc.currentScreen instanceof GuiContainer) {
        const slot = (mc.currentScreen).getSlotUnderMouse()
        if (slot != null) {
            item = slot.getStack()
        }
    }

    if (item == null) {
        item = event.itemStack
    }
    return item
}

export const GetNormalizedNewLines = (baseText) => {
    if (isNullOrUndefined(baseText)) return ""
    const compareText = GetUnformattedStringOrTextComponent(baseText)
    if (compareText == "") return ""
    if (compareText.endsWith("\n\n")) {
        return ""
    } else if (compareText.endsWith("\n")) {
        return "\n"
    }
    return "\n\n"
}

export const DrawItemOverlayRectangle = (drawContext, x, y, z, colorList) => {
    drawContext.fill(x, y, x + 16, y + 16, ZRenderLib.getRGBAColor(...colorList).getIntARGB())
}
export const DrawItemOverlayRectangleJavaColor = (drawContext, x, y, z, javaColor) => {
    DrawItemOverlayRectangle(drawContext, x, y, z, [javaColor.getRed(), javaColor.getGreen(), javaColor.getBlue(), javaColor.getAlpha()])
}

export const modernEntityClassNameMap = {
    "class_1295": "EntityAreaEffectCloud",
    "class_1303": "EntityExperienceOrb",
    "class_1420": "EntityBat",
    "class_1427": "EntityGolem",
    "class_1428": "EntityChicken",
    "class_1430": "EntityCow",
    "class_10730": "EntityCow",
    "class_1431": "EntityCod",
    "class_1433": "EntityDolphin",
    "class_1438": "EntityMooshroom",
    "class_1439": "EntityIronGolem",
    "class_1440": "EntityPanda",
    "class_1451": "EntityCat",
    "class_1452": "EntityPig",
    "class_1453": "EntityParrot",
    "class_1454": "EntityPufferfish",
    "class_1456": "EntityPolarBear",
    "class_1462": "EntitySalmon",
    "class_1463": "EntityRabbit",
    "class_1472": "EntitySheep",
    "class_1473": "EntitySnowGolem",
    "class_1474": "EntityTropicalFish",
    "class_1477": "EntitySquid",
    "class_1481": "EntityTurtle",
    "class_1493": "EntityWolf",
    "class_1495": "EntityDonkey",
    "class_1498": "EntityHorse",
    "class_1500": "EntityMule",
    "class_1501": "EntityLlama",
    "class_1506": "EntitySkeletonHorse",
    "class_1507": "EntityZombieHorse",
    "class_1510": "EntityEnderDragon",
    "class_1511": "EntityEnderCrystal",
    "class_1528": "EntityWither",
    "class_1531": "EntityArmorStand",
    "class_1532": "EntityLeashKnot",
    "class_1533": "EntityItemFrame",
    "class_1534": "EntityPainting",
    "class_1536": "EntityFishingBobber",
    "class_1538": "EntityLightningBolt",
    "class_1540": "EntityFallingBlock",
    "class_1541": "EntityTNT",
    "class_1542": "EntityItem",
    "class_1545": "EntityBlaze",
    "class_1548": "EntityCreeper",
    "class_1549": "EntityCaveSpider",
    "class_1550": "EntityElderGuardian",
    "class_1551": "EntityDrowned",
    "class_1559": "EntityEndermite",
    "class_1560": "EntityEnderman",
    "class_1564": "EntityEvoker",
    "class_1570": "EntityGiant",
    "class_1571": "EntityGhast",
    "class_1576": "EntityHusk",
    "class_1577": "EntityGuardian",
    "class_1581": "EntityIllusioner",
    "class_1584": "EntityRavager",
    "class_1589": "EntityMagmaCube",
    "class_1590": "EntityZombifiedPiglin",
    "class_1593": "EntityPhantom",
    "class_1604": "EntityPillager",
    "class_1606": "EntityShulker",
    "class_1613": "EntitySkeleton",
    "class_1614": "EntitySilverfish",
    "class_1617": "EntitySpellcastingIllager",
    "class_1621": "EntitySlime",
    "class_1627": "EntityStray",
    "class_1628": "EntitySpider",
    "class_1632": "EntityVindicator",
    "class_1634": "EntityVex",
    "class_1639": "EntityWitherSkeleton",
    "class_1640": "EntityWitch",
    "class_1641": "EntityZombieVillager",
    "class_1642": "EntityZombie",
    "class_1646": "EntityVillager",
    "class_1657": "EntityPlayer",
    "class_1667": "EntityArrow",
    "class_1669": "EntityEvokerFangs",
    "class_1670": "EntityDragonFireball",
    "class_1671": "EntityFireworkRocket",
    "class_1672": "EntityEyeOfEnder",
    "class_1673": "EntityLlamaSpit",
    "class_1674": "EntityFireball",
    "class_1677": "EntitySmallFireball",
    "class_1678": "EntityShulkerBullet",
    "class_1679": "EntitySpectralArrow",
    "class_1680": "EntitySnowball",
    "class_1681": "EntityEgg",
    "class_1683": "EntityExperienceBottle",
    "class_1684": "EntityEnderPearl",
    "class_1685": "EntityTrident",
    "class_1686": "EntityPotion",
    "class_1687": "EntityWitherSkull",
    "class_1690": "EntityBoat",
    "class_1694": "EntityChestMinecart",
    "class_1695": "EntityMinecart",
    "class_1696": "EntityFurnaceMinecart",
    "class_1697": "EntityCommandBlockMinecart",
    "class_1699": "EntitySpawnerMinecart",
    "class_1700": "EntityHopperMinecart",
    "class_1701": "EntityTNTMinecart",
    "class_3222": "EntityServerPlayer",
    "class_3701": "EntityOcelot",
    "class_3732": "EntityPatroller",
    "class_3986": "EntityTraderLlama",
    "class_3989": "EntityWanderingTrader",
    "class_4019": "EntityFox",
    "class_4466": "EntityBee",
    "class_4760": "EntityHoglin",
    "class_4836": "EntityPiglin",
    "class_4985": "EntityStrider",
    "class_5136": "EntityZoglin",
    "class_5419": "EntityPiglinBrute",
    "class_745": "EntityOtherPlayerMP",
    "class_746": "EntityPlayerMP",
    "class_5776": "EntityGlowSquid",
    "class_12117": "EntityNautilus",
    "class_12119": "EntityZombieNautilus",
    "class_7689": "EntityCamel",
    "class_12261": "EntityCamelHusk",
    "class_9254": "EntityBogged",
    "class_12263": "EntityParched",
    "class_9069": "EntityArmadillo",
    "class_6053": "EntityGoat",
    "class_5762": "EntityAxolotl",
    "class_7102": "EntityFrog",
    "class_7298": "EntityAllay",
    "class_11573": "EntityCopperGolem",
    "class_8153": "EntitySniffer",
    "class_8949": "EntityBreeze",
    "class_10275": "EntityCreaking",
    "class_7260": "EntityWarden",
    "class_11187": "EntityHappyGhast",
}

export const GetModernEntityClassName = (entity) => {
    const className = entity.getClassName()
    if (!isLegacy) return modernEntityClassNameMap[className] || className
    return className
}

export const modernitemIDToRegistryNameMap = {
    1: "minecraft:stone",
    2: "minecraft:grass",
    3: "minecraft:dirt",
    4: "minecraft:cobblestone",
    5: "minecraft:planks",
    6: "minecraft:sapling",
    7: "minecraft:bedrock",
    8: "minecraft:flowing_water",
    9: "minecraft:water",
    10: "minecraft:flowing_lava",
    11: "minecraft:lava",
    12: "minecraft:sand",
    13: "minecraft:gravel",
    14: "minecraft:gold_ore",
    15: "minecraft:iron_ore",
    16: "minecraft:coal_ore",
    17: "minecraft:log",
    18: "minecraft:leaves",
    19: "minecraft:sponge",
    20: "minecraft:glass",
    21: "minecraft:lapis_ore",
    22: "minecraft:lapis_block",
    23: "minecraft:dispenser",
    24: "minecraft:sandstone",
    25: "minecraft:noteblock",
    27: "minecraft:golden_rail",
    28: "minecraft:detector_rail",
    29: "minecraft:sticky_piston",
    30: "minecraft:web",
    31: "minecraft:tallgrass",
    32: "minecraft:deadbush",
    33: "minecraft:piston",
    35: "minecraft:wool",
    37: "minecraft:yellow_flower",
    38: "minecraft:red_flower",
    39: "minecraft:brown_mushroom",
    40: "minecraft:red_mushroom",
    41: "minecraft:gold_block",
    42: "minecraft:iron_block",
    43: "minecraft:double_stone_slab",
    44: "minecraft:stone_slab",
    45: "minecraft:brick_block",
    46: "minecraft:tnt",
    47: "minecraft:bookshelf",
    48: "minecraft:mossy_cobblestone",
    49: "minecraft:obsidian",
    50: "minecraft:torch",
    51: "minecraft:fire",
    52: "minecraft:mob_spawner",
    53: "minecraft:oak_stairs",
    54: "minecraft:chest",
    56: "minecraft:diamond_ore",
    57: "minecraft:diamond_block",
    58: "minecraft:crafting_table",
    60: "minecraft:farmland",
    61: "minecraft:furnace",
    62: "minecraft:lit_furnace",
    65: "minecraft:ladder",
    66: "minecraft:rail",
    67: "minecraft:stone_stairs",
    69: "minecraft:lever",
    70: "minecraft:stone_pressure_plate",
    72: "minecraft:wooden_pressure_plate",
    73: "minecraft:redstone_ore",
    76: "minecraft:redstone_torch",
    77: "minecraft:stone_button",
    78: "minecraft:snow_layer",
    79: "minecraft:ice",
    80: "minecraft:snow",
    81: "minecraft:cactus",
    82: "minecraft:clay",
    84: "minecraft:jukebox",
    85: "minecraft:fence",
    86: "minecraft:pumpkin",
    87: "minecraft:netherrack",
    88: "minecraft:soul_sand",
    89: "minecraft:glowstone",
    90: "minecraft:portal",
    91: "minecraft:lit_pumpkin",
    95: "minecraft:stained_glass",
    96: "minecraft:trapdoor",
    97: "minecraft:monster_egg",
    98: "minecraft:stonebrick",
    99: "minecraft:brown_mushroom_block",
    100: "minecraft:red_mushroom_block",
    101: "minecraft:iron_bars",
    102: "minecraft:glass_pane",
    103: "minecraft:melon_block",
    106: "minecraft:vine",
    107: "minecraft:fence_gate",
    108: "minecraft:brick_stairs",
    109: "minecraft:stone_brick_stairs",
    110: "minecraft:mycelium",
    111: "minecraft:waterlily",
    112: "minecraft:nether_brick",
    113: "minecraft:nether_brick_fence",
    114: "minecraft:nether_brick_stairs",
    116: "minecraft:enchanting_table",
    119: "minecraft:end_portal",
    120: "minecraft:end_portal_frame",
    121: "minecraft:end_stone",
    122: "minecraft:dragon_egg",
    123: "minecraft:redstone_lamp",
    125: "minecraft:double_wooden_slab",
    126: "minecraft:wooden_slab",
    127: "minecraft:cocoa",
    128: "minecraft:sandstone_stairs",
    129: "minecraft:emerald_ore",
    130: "minecraft:ender_chest",
    131: "minecraft:tripwire_hook",
    133: "minecraft:emerald_block",
    134: "minecraft:spruce_stairs",
    135: "minecraft:birch_stairs",
    136: "minecraft:jungle_stairs",
    137: "minecraft:command_block",
    138: "minecraft:beacon",
    139: "minecraft:cobblestone_wall",
    141: "minecraft:carrots",
    142: "minecraft:potatoes",
    143: "minecraft:wooden_button",
    145: "minecraft:anvil",
    146: "minecraft:trapped_chest",
    147: "minecraft:light_weighted_pressure_plate",
    148: "minecraft:heavy_weighted_pressure_plate",
    151: "minecraft:daylight_detector",
    152: "minecraft:redstone_block",
    153: "minecraft:quartz_ore",
    154: "minecraft:hopper",
    155: "minecraft:quartz_block",
    156: "minecraft:quartz_stairs",
    157: "minecraft:activator_rail",
    158: "minecraft:dropper",
    159: "minecraft:stained_hardened_clay",
    160: "minecraft:stained_glass_pane",
    161: "minecraft:leaves2",
    162: "minecraft:log2",
    163: "minecraft:acacia_stairs",
    164: "minecraft:dark_oak_stairs",
    165: "minecraft:slime",
    166: "minecraft:barrier",
    167: "minecraft:iron_trapdoor",
    168: "minecraft:prismarine",
    169: "minecraft:sea_lantern",
    170: "minecraft:hay_block",
    171: "minecraft:carpet",
    172: "minecraft:hardened_clay",
    173: "minecraft:coal_block",
    174: "minecraft:packed_ice",
    175: "minecraft:double_plant",
    179: "minecraft:red_sandstone",
    180: "minecraft:red_sandstone_stairs",
    181: "minecraft:double_stone_slab2",
    182: "minecraft:stone_slab2",
    183: "minecraft:spruce_fence_gate",
    184: "minecraft:birch_fence_gate",
    185: "minecraft:jungle_fence_gate",
    186: "minecraft:dark_oak_fence_gate",
    187: "minecraft:acacia_fence_gate",
    188: "minecraft:spruce_fence",
    189: "minecraft:birch_fence",
    190: "minecraft:jungle_fence",
    191: "minecraft:dark_oak_fence",
    192: "minecraft:acacia_fence",
    256: "minecraft:iron_shovel",
    257: "minecraft:iron_pickaxe",
    258: "minecraft:iron_axe",
    259: "minecraft:flint_and_steel",
    260: "minecraft:apple",
    261: "minecraft:bow",
    262: "minecraft:arrow",
    263: "minecraft:coal",
    264: "minecraft:diamond",
    265: "minecraft:iron_ingot",
    266: "minecraft:gold_ingot",
    267: "minecraft:iron_sword",
    268: "minecraft:wooden_sword",
    269: "minecraft:wooden_shovel",
    270: "minecraft:wooden_pickaxe",
    271: "minecraft:wooden_axe",
    272: "minecraft:stone_sword",
    273: "minecraft:stone_shovel",
    274: "minecraft:stone_pickaxe",
    275: "minecraft:stone_axe",
    276: "minecraft:diamond_sword",
    277: "minecraft:diamond_shovel",
    278: "minecraft:diamond_pickaxe",
    279: "minecraft:diamond_axe",
    280: "minecraft:stick",
    281: "minecraft:bowl",
    282: "minecraft:mushroom_stew",
    283: "minecraft:golden_sword",
    284: "minecraft:golden_shovel",
    285: "minecraft:golden_pickaxe",
    286: "minecraft:golden_axe",
    287: "minecraft:string",
    288: "minecraft:feather",
    289: "minecraft:gunpowder",
    290: "minecraft:wooden_hoe",
    291: "minecraft:stone_hoe",
    292: "minecraft:iron_hoe",
    293: "minecraft:diamond_hoe",
    294: "minecraft:golden_hoe",
    295: "minecraft:wheat_seeds",
    296: "minecraft:wheat",
    297: "minecraft:bread",
    298: "minecraft:leather_helmet",
    299: "minecraft:leather_chestplate",
    300: "minecraft:leather_leggings",
    301: "minecraft:leather_boots",
    302: "minecraft:chainmail_helmet",
    303: "minecraft:chainmail_chestplate",
    304: "minecraft:chainmail_leggings",
    305: "minecraft:chainmail_boots",
    306: "minecraft:iron_helmet",
    307: "minecraft:iron_chestplate",
    308: "minecraft:iron_leggings",
    309: "minecraft:iron_boots",
    310: "minecraft:diamond_helmet",
    311: "minecraft:diamond_chestplate",
    312: "minecraft:diamond_leggings",
    313: "minecraft:diamond_boots",
    314: "minecraft:golden_helmet",
    315: "minecraft:golden_chestplate",
    316: "minecraft:golden_leggings",
    317: "minecraft:golden_boots",
    318: "minecraft:flint",
    319: "minecraft:porkchop",
    320: "minecraft:cooked_porkchop",
    321: "minecraft:painting",
    322: "minecraft:golden_apple",
    323: "minecraft:sign",
    324: "minecraft:wooden_door",
    325: "minecraft:bucket",
    326: "minecraft:water_bucket",
    327: "minecraft:lava_bucket",
    328: "minecraft:minecart",
    329: "minecraft:saddle",
    330: "minecraft:iron_door",
    331: "minecraft:redstone",
    332: "minecraft:snowball",
    333: "minecraft:boat",
    334: "minecraft:leather",
    335: "minecraft:milk_bucket",
    336: "minecraft:brick",
    337: "minecraft:clay_ball",
    338: "minecraft:reeds",
    339: "minecraft:paper",
    340: "minecraft:book",
    341: "minecraft:slime_ball",
    342: "minecraft:chest_minecart",
    343: "minecraft:furnace_minecart",
    344: "minecraft:egg",
    345: "minecraft:compass",
    346: "minecraft:fishing_rod",
    347: "minecraft:clock",
    348: "minecraft:glowstone_dust",
    349: "minecraft:fish",
    350: "minecraft:cooked_fish",
    351: "minecraft:dye",
    352: "minecraft:bone",
    353: "minecraft:sugar",
    354: "minecraft:cake",
    355: "minecraft:bed",
    356: "minecraft:repeater",
    357: "minecraft:cookie",
    358: "minecraft:filled_map",
    359: "minecraft:shears",
    360: "minecraft:melon",
    361: "minecraft:pumpkin_seeds",
    362: "minecraft:melon_seeds",
    363: "minecraft:beef",
    364: "minecraft:cooked_beef",
    365: "minecraft:chicken",
    366: "minecraft:cooked_chicken",
    367: "minecraft:rotten_flesh",
    368: "minecraft:ender_pearl",
    369: "minecraft:blaze_rod",
    370: "minecraft:ghast_tear",
    371: "minecraft:gold_nugget",
    372: "minecraft:nether_wart",
    373: "minecraft:potion",
    374: "minecraft:glass_bottle",
    375: "minecraft:spider_eye",
    376: "minecraft:fermented_spider_eye",
    377: "minecraft:blaze_powder",
    378: "minecraft:magma_cream",
    379: "minecraft:brewing_stand",
    380: "minecraft:cauldron",
    381: "minecraft:ender_eye",
    382: "minecraft:speckled_melon",
    383: "minecraft:spawn_egg",
    384: "minecraft:experience_bottle",
    385: "minecraft:fire_charge",
    386: "minecraft:writable_book",
    387: "minecraft:written_book",
    388: "minecraft:emerald",
    389: "minecraft:item_frame",
    390: "minecraft:flower_pot",
    391: "minecraft:carrot",
    392: "minecraft:potato",
    393: "minecraft:baked_potato",
    394: "minecraft:poisonous_potato",
    395: "minecraft:map",
    396: "minecraft:golden_carrot",
    397: "minecraft:skull",
    398: "minecraft:carrot_on_a_stick",
    399: "minecraft:nether_star",
    400: "minecraft:pumpkin_pie",
    401: "minecraft:fireworks",
    402: "minecraft:firework_charge",
    403: "minecraft:enchanted_book",
    404: "minecraft:comparator",
    405: "minecraft:netherbrick",
    406: "minecraft:quartz",
    407: "minecraft:tnt_minecart",
    408: "minecraft:hopper_minecart",
    409: "minecraft:prismarine_shard",
    410: "minecraft:prismarine_crystals",
    411: "minecraft:rabbit",
    412: "minecraft:cooked_rabbit",
    413: "minecraft:rabbit_stew",
    414: "minecraft:rabbit_foot",
    415: "minecraft:rabbit_hide",
    416: "minecraft:armor_stand",
    417: "minecraft:iron_horse_armor",
    418: "minecraft:golden_horse_armor",
    419: "minecraft:diamond_horse_armor",
    420: "minecraft:lead",
    421: "minecraft:name_tag",
    422: "minecraft:command_block_minecart",
    423: "minecraft:mutton",
    424: "minecraft:cooked_mutton",
    425: "minecraft:banner",
    427: "minecraft:spruce_door",
    428: "minecraft:birch_door",
    429: "minecraft:jungle_door",
    430: "minecraft:acacia_door",
    431: "minecraft:dark_oak_door",
    2256: "minecraft:record_13",
    2257: "minecraft:record_cat",
    2258: "minecraft:record_blocks",
    2259: "minecraft:record_chirp",
    2260: "minecraft:record_far",
    2261: "minecraft:record_mall",
    2262: "minecraft:record_mellohi",
    2263: "minecraft:record_stal",
    2264: "minecraft:record_strad",
    2265: "minecraft:record_ward",
    2266: "minecraft:record_11",
    2267: "minecraft:record_wait",
}

export const GetModernitemIDRegistryName = (itemID) => {
    if (Object.values(modernitemIDToRegistryNameMap).includes(itemID)) {
        return itemID
    }
    return modernitemIDToRegistryNameMap[itemID] || "minecraft:air"
}

export const FixRenderItemIntoSlotRenderValues = (drawContext, originalItem, x, y, z) => {
    if (isLegacy) {
        return [
            null, // drawContext
            drawContext?.itemStack, // item
            originalItem, // x
            x, // y
            0, // z
        ]
    }
    return [
        drawContext, // drawContext
        originalItem, // item
        x, // x
        y, // y
        z, // z
    ]
}

export const moveFile = (target, destination, replace) => {
    const targetFile = new JavaFile(target)
    const destinationFile = new JavaFile(destination)
    destinationFile.getParentFile().mkdirs()
    return targetFile.renameTo(destinationFile)
}

export const isModLoaded = (modName) => {
    if (isLegacy) {
        return ForgeLoader.isModLoaded(modName)
    }
    return FabricLoader.getInstance().isModLoaded(modName)
}
export const getInstalledModList = () => {
    if (isLegacy) {
        return ForgeLoader.instance().getModList()
    }
    let modList = []
    FabricLoader.getInstance().getAllMods().forEach(mod => {
        modList.push(mod.getMetadata().getId())
    })
    return modList
}
export const getInstalledModVersion = (modID) => {
    if (isLegacy) {
        throw new Error("Not supported in legacy")
    }
    const modContainer = FabricLoader.getInstance()
        .getModContainer(modID)
        .orElse(null)
    if (modContainer) {
        return modContainer.getMetadata().getVersion().getFriendlyString()
    }
    return null
}

const delayedCallbacks = Object.create(null)
register("step", () => {
    const now = Date.now()
    for (const id in delayedCallbacks) {
        let entry = delayedCallbacks[id]
        if (!entry || !entry.active) continue

        if (now - entry.start >= entry.delay) {
            entry.active = false
            try {
                entry.callback()
            } catch (e) {
                ChatDebug(`DelayedCallback ${id} failed`, e, e.stack)
            }
            delete delayedCallbacks[id]
        }
    }
}).setFps(20)

export const StartDelayedCallback = (id, delayMs, callback) => {
    const entry = delayedCallbacks[id]
    const now = Date.now()
    if (entry) {
        entry.start = now
        entry.delay = delayMs
        entry.callback = callback
        entry.active = true
        return
    }

    delayedCallbacks[id] = {
        start: now,
        delay: delayMs,
        callback,
        active: true,
    }
}
export const DelayedCallbackExists = (id) => {
    const entry = delayedCallbacks[id]
    return !!(entry && entry.active)
}
export const DeleteDelayedCallback = (id) => {
    const entry = delayedCallbacks[id]
    if (!entry) return false
    delete delayedCallbacks[id]
    return true
}

export const GetExtendedColorString = (hexCode) => {
    const hexCodeU = hexCode.replace(/^#/, "").toLowerCase().padStart(6, "0")

    let finalString = "§#"
    hexCodeU.split("").forEach((code) => {
        finalString += `§${code}`
    })

    if (finalString.length != 14) return hexCode
    return `${finalString}§/${hexCode}`
}

export class ZTextComponent {
    constructor() {
        this.textComponentList = []
    }

    getTextComponentList() {
        return this.textComponentList
    }

    trim() {
        while (this.textComponentList.length > 0) {
            const first = this.textComponentList[0]
            const text = first.text || (first instanceof TextComponent ? first.getText() : "")

            if (!(text == null || text.trim() === "")) break
            this.textComponentList.shift()
        }

        while (this.textComponentList.length > 0) {
            const last = this.textComponentList[this.textComponentList.length - 1]
            const text = last.text || (last instanceof TextComponent ? last.getText() : "")

            if (!(text == null || text.trim() == "")) break
            this.textComponentList.pop()
        }

        return this
    }

    withText(...args) { return this.addText(...args) }
    addText(text, color = null, clickEvent = null, hoverEvent = null) {
        if (typeof text == "string") {
            this.addTextObject({
                text: text,
                color: color,
                clickEvent: clickEvent,
                hoverEvent: hoverEvent,
            })
        } else if (text instanceof ZTextComponent) {
            this.addZTextComponent(text)
        } else {
            throw new Error(`Text must be a string | got "${typeof text}"`)
        }
        return this
    }
    withTextList(...args) { return this.addTextList(...args) }
    addTextList(textList) {
        textList.forEach(text => {
            this.addText(text)
        })
        return this
    }

    withNewlineTextList(...args) { return this.addNewlineTextList(...args) }
    addNewlineTextList(textList) {
        textList.forEach(text => {
            this.addText(`\n${text}`)
        })
        return this
    }

    withTextObject(...args) { return this.addTextObject(...args) }
    addTextObject(textObject) {
        if (!textObject.hasOwnProperty("text")) {
            throw new Error("Text object must have a 'text' property.")
        }
        if (textObject.text == null || textObject.text == "") {
            return this
        }
        this.textComponentList.push(textObject)
        return this
    }
    withTextObjectList(...args) { return this.addTextObjectList(...args) }
    addTextObjectList(textObjectList) {
        if (!Array.isArray(textObjectList)) {
            throw new Error("Text object list must be an array | got " + typeof textObjectList)
        }
        textObjectList.forEach(textObject => {
            this.addTextObject(textObject)
        })
        return this
    }

    withZTextComponent(...args) { return this.addZTextComponent(...args) }
    addZTextComponent(zTextComponent) {
        if (!(zTextComponent instanceof ZTextComponent)) {
            throw new Error("Argument must be an instance of ZTextComponent.")
        }
        zTextComponent.getTextComponentList().forEach(component => {
            if (component instanceof TextComponent) {
                this.addTextComponent(component)
                return
            }
            this.addTextObject(component)
        })
        return this
    }

    withTextComponent(...args) { return this.addTextComponent(...args) }
    addTextComponent(textComponent) {
        if (!(textComponent instanceof TextComponent)) {
            throw new Error("Argument must be an instance of TextComponent.")
        }
        this.textComponentList.push(textComponent)
        return this
    }

    setClick(clickEvent) {
        this.textComponentList.forEach(component => {
            component["clickEvent"] = clickEvent
        })
        return this
    }

    setHover(hoverEvent) {
        this.textComponentList.forEach(component => {
            component["hoverEvent"] = hoverEvent
        })
        return this
    }

    build(legacyOutputString = true) {
        try {
            if (isLegacy) {
                const textList = this.textComponentList.map(component => {
                    let text = component.color
                        ? GetExtendedColorString(component.color).replace(component.color, component.text)
                        : component.text

                    const textComponent = new TextComponent(text)
                    if (component.clickEvent) {
                        textComponent.setClick(component.clickEvent.action, component.clickEvent.value)
                    }
                    if (component.hoverEvent) {
                        textComponent.setHover(component.hoverEvent.action, component.hoverEvent.value)
                    }

                    return textComponent
                })

                const message = new Message(textList)
                if (legacyOutputString) {
                    return message.getFormattedText()
                }
                return message
            }

            let textComponent = new TextComponent("")
            this.textComponentList.forEach(component => {
                try {
                    if (component instanceof TextComponent) {
                        textComponent = textComponent.withText(component)
                        return
                    }
                    if (component.color == null && component.clickEvent == null && component.hoverEvent == null) {
                        textComponent = textComponent.withText(component.text)
                        return
                    }
                    textComponent = textComponent.withText(component)
                } catch (e) {
                    ChatMessage("ZTextComponent add component error:", e)
                    console.log(`ZTextComponent add component error: ${e} | ${e.stack}`)
                }
            })
            return textComponent
        } catch (e) {
            ChatMessage("ZTextComponent build error:", e)
            console.log(`ZTextComponent build error: ${e} | ${e.stack}`)
        }
        return null
    }

    getUnformattedText() {
        const build = this.build(false)
        if (isLegacy) {
            return build.getUnformattedText()
        }
        return build.unformattedText
    }
    getFormattedText() {
        let build = this.build(false)
        if (isLegacy) {
            return build.getFormattedText()
        }
        return build.formattedText
    }
    isEmpty() {
        return this.textComponentList.length == 0
    }
    chat() {
        return this.build(false)?.chat()
    }
}

export class LRUCacheMap {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Map()
    }
    has(key) {
        return this.cache.has(key)
    }
    get(key) {
        if (!this.cache.has(key)) return null

        const value = this.cache.get(key)
        this.cache.delete(key)
        this.cache.set(key, value)
        return value
    }
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
        }
        this.cache.set(key, value)

        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value
            this.cache.delete(firstKey)
        }
    }
    clear() {
        this.cache.clear()
    }
    size() {
        return this.cache.size
    }
}
export class LRUCacheList {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Set()
    }
    has(key) {
        return this.cache.has(key)
    }
    getFirst() {
        return this.cache.values().next().value
    }
    get(key) {
        if (!this.cache.has(key)) return false
        this.add(key)
        return true
    }
    delete(key) {
        return this.cache.delete(key)
    }
    add(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
        }
        this.cache.add(key)

        if (this.cache.size > this.capacity) {
            this.cache.delete(this.getFirst())
        }
    }
    clear() {
        this.cache.clear()
    }
    size() {
        return this.cache.size
    }
}

const pathSymbol = Symbol("path")
export class DataObject {
    constructor(moduleName, defaultObject = {}, filePath = ".data.json") {
        this[pathSymbol] = [moduleName, filePath]
        let data = FileLib.read(moduleName, filePath)
        try {
            data = data ? JSON.parse(data) : {}
        } catch (e) {
            console.error(e)
            console.log(`[ZCore] Reset ${moduleName} to default data.`)
            data = {}
        }
        Object.assign(this, defaultObject, data)
    }

    save() {
        FileLib.write(
            this[pathSymbol][0],
            this[pathSymbol][1],
            JSON.stringify(this, null, 4),
            true,
        )
    }

    autosave(interval = 5) {
        register("step", () => this.save()).setDelay(60 * interval)
        register("gameUnload", () => this.save())
    }
}

export const helmetNames = new Set([
    "hat",
    "helmet",
    "mask",
    "crown",
    "head",
    "heart",
    "fedora",
    "goggles",
    "cap",
    "tophat",
    "velvet_top_hat",
    "velvet top hat",
    "leather cap",
    "leather helmet",
    "leather_helmet",
    "minecraft:leather_helmet",
])
export const chestplateNames = new Set([
    "chest",
    "chestplate",
    "jacket",
    "tunic",
    "shirt",
    "cashmere_jacket",
    "cashmere jacket",
    "leather tunic",
    "leather chestplate",
    "leather_chestplate",
    "minecraft:leather_chestplate",
])
export const leggingsNames = new Set([
    "leggings",
    "pants",
    "trousers",
    "legs",
    "legging",
    "leg",
    "satin_trousers",
    "satin trousers",
    "leather trousers",
    "leather pants",
    "leather leggings",
    "leather_leggings",
    "minecraft:leather_leggings",
])
export const bootsNames = new Set([
    "boots",
    "shoes",
    "shoe",
    "boot",
    "oxford_shoes",
    "oxford shoes",
    "leather shoes",
    "leather boots",
    "leather_boots",
    "minecraft:leather_boots",
])
export const leatherArmorNames = new Set([
    "leather cap",
    "leather helmet",
    "leather_helmet",
    "minecraft:leather_helmet",

    "leather tunic",
    "leather chestplate",
    "leather_chestplate",
    "minecraft:leather_chestplate",

    "leather trousers",
    "leather pants",
    "leather leggings",
    "leather_leggings",
    "minecraft:leather_leggings",

    "leather shoes",
    "leather boots",
    "leather_boots",
    "minecraft:leather_boots",
])

export const GetArmorType = (itemName) => {
    if (isNullOrUndefined(itemName)) return null
    itemName = ChatLib.removeFormatting(itemName).toLowerCase().trim()
    if (helmetNames.has(itemName)) return "helmet"
    if (chestplateNames.has(itemName)) return "chestplate"
    if (leggingsNames.has(itemName)) return "leggings"
    if (bootsNames.has(itemName)) return "boots"
    return null
}

export const buildModernCommand = (commandName, commandBody, aliases = []) => {
    const commandNode = Commands.buildCommand(commandName, commandBody)
    commandNode.register()
    aliases.forEach(alias => {
        Commands.buildCommand(alias, () => {
            Commands.redirect(commandNode)
        }).register()
    })
}

export const registerNewCommand = (commandName, legacyBody, modernBody, aliases = []) => {
    const nonDuplicateAliases = new Set(aliases)
    if (nonDuplicateAliases.size != aliases.length) {
        ChatMessage(`Duplicate aliases found for command "${commandName}": ${aliases.join(", ")}`)
        return
    }

    if (isLegacy) {
        register("command", (...args) => {
            legacyBody(...args)
        }).setName(commandName).setAliases(aliases)
        return
    }
    buildModernCommand(commandName, modernBody, aliases)
}

let cLiteral, cArgument, cString, cExec, cBool, cInteger, cGreedyString = null
if (!isLegacy) {
    cLiteral = Commands.literal
    cArgument = Commands.argument
    cString = Commands.string
    cExec = Commands.exec
    cBool = Commands.bool
    cInteger = Commands.integer
    cGreedyString = Commands.greedyString
}

export const createCommandLiteral = (commands, subcommandName) => {
    const cmd = commands[subcommandName]
    cLiteral(subcommandName, () => {
        if (cmd.args.length == 0) {
            cExec(() => {
                cmd.handler()
            })
            return
        }

        const firstOptionalIndex = cmd.args.findIndex(arg => arg.optional)
        const optionalFromIndex = firstOptionalIndex === -1 ? Infinity : firstOptionalIndex
        const buildArguments = (argIndex) => {
            if (argIndex >= cmd.args.length) {
                cExec((context) => {
                    const argValues = cmd.args.map(arg => context[arg.name])
                    cmd.handler(...argValues)
                })
                return
            }

            const arg = cmd.args[argIndex]
            const isOptional = argIndex >= optionalFromIndex
            cArgument(arg.name, arg.type(), () => {
                buildArguments(argIndex + 1)
            })

            if (isOptional) {
                cExec((context) => {
                    const argValues = cmd.args.slice(0, argIndex).map(arg => context[arg.name])
                    cmd.handler(...argValues)
                })
            }
        }
        buildArguments(0)
    })
}
export const createCommandHandler = (commands, subcommand, ...args) => {
    if (isLegacy) {
        subcommand = args ? args[0] : null
    }
    if (!subcommand) {
        if (commands.hasOwnProperty("_defaultNoInput")) {
            commands._defaultNoInput.handler()
        }
        return
    }

    const cmd = commands[subcommand]
    if (cmd) {
        cmd.handler(...args)
        return
    }
    if (!commands.hasOwnProperty("_defaultWithInput")) return
    commands._defaultWithInput.handler(...args)
}

export class UpdatingFile {
    constructor(moduleName, fileKey, filePath, fileName, downloadURL) {
        this.moduleName = moduleName
        this.fileKey = fileKey
        this.filePath = filePath
        this.fileName = fileName
        this.downloadURL = downloadURL
    }

    normalizeFilePath() {
        return this.filePath.replace(/^[/\\]+|[/\\]+$/g, "")
    }
    getOutputFolder() {
        return Paths.get(modulesFolder, this.moduleName, this.normalizeFilePath()).toFile()
    }
    getFullFilePath() {
        const filePath = Paths.get(this.getOutputFolder().getAbsolutePath(), this.fileName)
        return filePath.toString()
    }

    readFile() {
        try {
            let filePath = this.getFullFilePath()
            const file = new JavaFile(filePath)
            if (!file.exists()) return null
            return JSON.parse(FileLib.read(filePath))
        } catch (e) {
            ChatDebug(`Error in Read${this.fileName}:`, e, e.stack)
        }
        return null
    }

    preloadData(callback) {
        const fullPath = this.getFullFilePath()
        if (FileLib.exists(fullPath)) {
            try {
                callback(JSON.parse(`${FileLib.read(fullPath)}`))
                return
            } catch (e) {
                ChatDebug(`&cError preloading ${this.fileName}:`, e, e.stack)
            }
        }
        callback(null)
    }

    downloadFile(shouldPreload, currentFileVersion, callback) {
        if (shouldPreload) {
            this.preloadData(callback)
        }

        fetch(this.downloadURL, {
            headers: defaultHeaders,
            json: true,
            timeout: 10000,
        })
        .then(response => {
            if (!response || !response["success"]) {
                ChatDebug(`Error #1 in Download${this.fileName}:`, JSON.stringify(response))
                return
            }

            const outputFolder = this.getOutputFolder()
            if (!outputFolder.exists() && !outputFolder.mkdirs()) {
                ChatDebug(`Failed to create directory: ${outputFolder.getAbsolutePath()}`)
            }

            const fullPath = this.getFullFilePath()
            const newDownloadedVersion = response["version"] || 0
            if (newDownloadedVersion <= currentFileVersion && FileLib.exists(fullPath)) {
                // ChatDebug(`No new ${this.fileName} version available. Current: v${currentFileVersion}, New version: v${newDownloadedVersion}`)
                callback(this.readFile(), null)
                return
            }

            console.log(`New ${this.fileName} version available: ${currentFileVersion} -> ${newDownloadedVersion}. Updating...`)

            FileLib.write(fullPath, JSON.stringify(JSON.parse(response["body"]), null, 4))
            console.log(`Successfully updated ${this.fileName} to version v${newDownloadedVersion}.`)
            callback(this.readFile(), newDownloadedVersion)
        })
        .catch(e => {
            ChatDebug(`Error #2 in Download${this.fileName}:`, e, e.stack)
        })
    }
}

export const GetTextWithBackgroundData = (textList, colorList) => {
    if (isNullOrUndefined(colorList)) {
        colorList = [30, 30, 30, 127]
    }

    let longestLength = 0
    let lineList = []
    textList.forEach((line) => {
        let lineU = GetUnformattedStringOrTextComponent(line).trim()
        if (lineU == "") {
            lineList.push(line)
            return
        }

        lineList.push(...SplitStringOrTextComponentByNewline(line))
    })

    lineList.forEach((line) => {
        let width = ZRenderLib.getStringWidth(GetUnformattedStringOrTextComponent(line))
        longestLength = Math.max(longestLength, width)
    })
    longestLength += 6.5

    const divider = GetDivider(longestLength - ZRenderLib.getStringWidth("  "))
    const finalTextComponent = new ZTextComponent()
    lineList.forEach((line) => {
        let lineU = GetUnformattedStringOrTextComponent(line).trim()
        if (lineU == "_-_divider") {
            finalTextComponent.withText("\n" + divider)
            return
        }

        if (!finalTextComponent.isEmpty()) {
            finalTextComponent.withText("\n")
        }

        if (line instanceof ZTextComponent) {
            finalTextComponent.withZTextComponent(line)
        } else {
            finalTextComponent.withText(line)
        }
    })

    return {
        zTextComponent: finalTextComponent,
        backgroundColorList: colorList,
        width: longestLength,
        height: (lineList.length * 9) + (2.5 * 2),
    }
}
export const DrawTextWithBackground = (drawContext, text, startX, startY, zOffset, backgroundWidth, backgroundHeight, scale, backgroundColorList) => {
    ZRenderLib.drawRoundedRect(drawContext, startX, startY, backgroundWidth * scale, backgroundHeight * scale, 5, backgroundColorList, [], 16, 0)
    if (isLegacy) {
        ZRenderLib.drawGUIString(drawContext, text, startX + 3.5, startY + 3.5, ZRenderLib.WHITE, scale, false, true, 512, zOffset + 1)
        return
    }
    ZRenderLib.drawGUIText(drawContext, text, startX + 3.5, startY + 3.5, ZRenderLib.WHITE, scale, false, true, 512, zOffset + 1)
}
const registeredNotifications = {}
let sortedNotificationKeys = []
export const RegisterNotification = (notificationKey, textList, options = {}) => {
    const notificationData = {
        textList,
        durationSeconds: options.durationSeconds ?? 5,
        startX: options.startX ?? 100,
        startY: options.startY ?? 100,
        zOffset: options.zOffset ?? 0,
        heightOffset: options.heightOffset ?? 0,
        widthOffset: options.widthOffset ?? 0,
        scale: options.scale ?? 1,
        priority: options.priority ?? 0,
        drawFunction: options.drawFunction ?? null,
        centered: options.centered ?? false,
        expirySound: options.expirySound ?? null,
        cachedData: null,
    }
    if (notificationData.durationSeconds != -1) {
        notificationData.endingTime = Date.now() + (notificationData.durationSeconds * 1000)
    } else {
        notificationData.endingTime = null
    }
    registeredNotifications[notificationKey] = notificationData
    sortedNotificationKeys = Object.keys(registeredNotifications).sort((a, b) => registeredNotifications[b].priority - registeredNotifications[a].priority)
}
export const IsNotificationRegistered = (notificationKey) => {
    return !!registeredNotifications[notificationKey]
}
export const DeleteNotification = (notificationKey) => {
    if (!registeredNotifications[notificationKey]) return false
    delete registeredNotifications[notificationKey]
    sortedNotificationKeys = Object.keys(registeredNotifications).sort((a, b) => registeredNotifications[b].priority - registeredNotifications[a].priority)
    return true
}
export const UpdateNotificationData = (notificationKey, newTextList, newOptions = {}) => {
    if (!registeredNotifications[notificationKey]) return false
    registeredNotifications[notificationKey].textList = newTextList
    registeredNotifications[notificationKey].durationSeconds = newOptions.durationSeconds || registeredNotifications[notificationKey].durationSeconds
    registeredNotifications[notificationKey].startX = newOptions.startX || registeredNotifications[notificationKey].startX
    registeredNotifications[notificationKey].startY = newOptions.startY || registeredNotifications[notificationKey].startY
    registeredNotifications[notificationKey].zOffset = newOptions.zOffset || registeredNotifications[notificationKey].zOffset
    registeredNotifications[notificationKey].heightOffset = newOptions.heightOffset || registeredNotifications[notificationKey].heightOffset
    registeredNotifications[notificationKey].widthOffset = newOptions.widthOffset || registeredNotifications[notificationKey].widthOffset
    registeredNotifications[notificationKey].scale = newOptions.scale || registeredNotifications[notificationKey].scale
    registeredNotifications[notificationKey].priority = newOptions.priority || registeredNotifications[notificationKey].priority
    registeredNotifications[notificationKey].drawFunction = newOptions.drawFunction || registeredNotifications[notificationKey].drawFunction
    registeredNotifications[notificationKey].centered = newOptions.centered || registeredNotifications[notificationKey].centered
    registeredNotifications[notificationKey].expirySound = newOptions.expirySound || registeredNotifications[notificationKey].expirySound
    registeredNotifications[notificationKey].cachedData = null
    return true
}
export const GetCachedNotificationData = (notificationKey) => {
    if (!registeredNotifications[notificationKey]) return null
    if (!registeredNotifications[notificationKey].cachedData) {
        return SetCachedNotificationData(notificationKey, registeredNotifications[notificationKey])
    }
    return registeredNotifications[notificationKey].cachedData
}
export const SetCachedNotificationData = (notificationKey, notificationData) => {
    const textWithBackgroundData = GetTextWithBackgroundData(notificationData.textList)
    const cachedData = {
        endingTime: notificationData.endingTime,
        x: notificationData.startX + notificationData.widthOffset + 2,
        y: notificationData.startY + notificationData.heightOffset + 2,
        width: textWithBackgroundData.width + notificationData.widthOffset,
        height: textWithBackgroundData.height + notificationData.heightOffset,
        builtTextComponent: textWithBackgroundData.zTextComponent.build(),
        backgroundColorList: textWithBackgroundData.backgroundColorList,
        scale: notificationData.scale,
        drawFunction: notificationData.drawFunction,
        centered: notificationData.centered,
        expirySound: notificationData.expirySound,
    }
    registeredNotifications[notificationKey].cachedData = cachedData
    return cachedData
}

let lastDrawnNotificationKey = null
export const TryDrawNotifications = (drawContext, partialTicks) => {
    let needsResort = false
    sortedNotificationKeys.forEach((notificationKey) => {
        const notificationData = registeredNotifications[notificationKey]
        if (!notificationData) return

        let cachedData = GetCachedNotificationData(notificationKey)
        if (cachedData.endingTime != null && Date.now() >= cachedData.endingTime) {
            if (cachedData.expirySound) {
                PlaySound(cachedData.expirySound)
            }
            delete registeredNotifications[notificationKey]
            needsResort = true
            lastDrawnNotificationKey = null
            return
        }
        if (lastDrawnNotificationKey && lastDrawnNotificationKey != notificationKey) return
        lastDrawnNotificationKey = notificationKey

        if (cachedData.drawFunction) {
            cachedData.drawFunction(drawContext, cachedData)
            return
        }

        let x = cachedData.x
        let y = cachedData.y
        if (cachedData.centered) {
            const screenSize = ZRenderLib.getScreenSize()
            const width = cachedData.width
            const height = cachedData.height
            const scale = cachedData.scale
            const midX = screenSize.width / 2
            x = midX - (width * scale) / 2
            y = screenSize.height * 3 / 4 - (height * scale) / 2
        }
        DrawTextWithBackground(
            drawContext,
            cachedData.builtTextComponent,
            x,
            y,
            notificationData.zOffset,
            cachedData.width,
            cachedData.height,
            notificationData.scale,
            cachedData.backgroundColorList,
        )
    })

    if (!needsResort) return
    sortedNotificationKeys = Object.keys(registeredNotifications).sort((a, b) => registeredNotifications[b].priority - registeredNotifications[a].priority)
}

const renderOverlayTriggerName = isLegacy ? "RenderOverlay" : "RenderHudOverlay"
register(renderOverlayTriggerName, (drawContext, partialTicks) => {
    TryDrawNotifications(drawContext, partialTicks)
})

export const PlaySound = (soundName, volume = 1, pitch = 1) => {
    if (isLegacy) {
        World.playSound(soundName, volume, pitch)
        return
    }

    const soundData = {
        source: soundName,
        volume: volume,
        pitch: pitch,
    }
    const sound = (isZJS) ? new ZSound(soundData) : new CTSound(soundData)
    sound?.play()
}

export const DownloadFileFromUrl = (fileLink, outputFileName, outputFolder, callback = null) => {
    try {
        let url = new JavaURL(fileLink)
        let http = url.openConnection()
        http.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        let header = http.getHeaderFields()

        while (isRedirected(header)) {
            url = header.get("Location").get(0)
            url = new JavaURL(url)
            http = url.openConnection()
            header = http.getHeaderFields()
        }

        const buffer = JavaArray.newInstance(Byte.TYPE, 4096)
        const inputStream = http.getInputStream()
        const folder = new JavaFile(outputFolder)
        if (!folder.exists()) {
            folder.mkdirs()
        }

        let fileOutputStream = null
        try {
            fileOutputStream = new FileOutputStream(outputFolder + "/" + outputFileName)
            let n = -1
            while ((n = inputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, n)
            }
            if (callback) callback()
        } catch (e) {
            throw e
        } finally {
            if (inputStream) inputStream.close()
            if (fileOutputStream) fileOutputStream.close()
            if (http) http.disconnect()
        }
    } catch (e) {
        ChatDebug(`&cError in DownloadFileFromUrl: ${JSON.stringify(e)}`)
    }
}
function isRedirected(headerList) {
    for (let i = 0; i < headerList.size(); i++) {
        let header = headerList.get(i)
        if (header != null && (header.contains(" 301 ") || header.contains(" 302 "))) return true
    }
    return false
}

export const GetMatchingFilesInDirectory = (directory, patternFunction) => {
    const allFiles = GetAllFilesInDirectory(directory)
    const matchingFiles = []
    allFiles.forEach((file) => {
        if (patternFunction(file.getFileName().toString())) {
            matchingFiles.push(file)
        }
    })
    return matchingFiles
}
export const GetAllFilesInDirectory = (directory) => {
    const dir = Paths.get(directory)
    if (!Files.exists(dir) || !Files.isDirectory(dir)) return []

    const allFiles = []
    Files.walk(dir).forEach((path) => {
        allFiles.push(path)
    })

    return allFiles
}

export const isNumberAscending = (number) => {
    const str = number.toString()
    if (str.length < 2) return false
    for (let i = 1; i < str.length; i++) {
        let prev = Number(str[i - 1])
        let curr = Number(str[i])
        if (curr != prev + 1) return false
    }
    return true
}

export const isNumberDescending = (number) => {
    const str = number.toString()
    if (str.length < 2) return false
    for (let i = 1; i < str.length; i++) {
        let prev = Number(str[i - 1])
        let curr = Number(str[i])
        if (curr != prev - 1) return false
    }
    return true
}

export const listToLower = (list) => {
    return list.map(item => item.toLowerCase())
}
export const listToUpper = (list) => {
    return list.map(item => item.toUpperCase())
}

export const removeNullMapValues = (obj = {}) => {
    const result = {}
    for (const key in obj) {
        if (obj[key] != null) {
            result[key] = obj[key]
        }
    }
    return result
}

const _GetPlayerAccountData = (playerDataToScan, callback) => {
    const url = (playerDataToScan.length >= 32) ? uuidToUsernameLink : usernameToUUIDLink
    fetch(`${url}/${playerDataToScan}`, {
        headers: defaultHeaders,
        json: true,
        timeout: 5000,
    })
    .then(playerInfo => {
        if (isNullOrUndefined(playerInfo)) {
            callback(false, {
                isNull: true,
            })
            return
        }
        if (playerInfo.errorMessage) {
            callback(false, {
                isError: true,
                data: playerInfo,
            })
            return
        }
        callback(true, {
            playerUUID: NormalizePlayerUUID(playerInfo["id"]),
            playerUsername: playerInfo["name"],
        })
    })
    .catch(e => {
        callback(false, {
            isException: true,
            data: e,
        })
    })
}
export const GetPlayerAccountData = (sourceID, playerDataToScan, callback) => {
    _GetPlayerAccountData(playerDataToScan, (success, playerData) => {
        if (!success) {
            if (playerData.isException) {
                ChatMessage(`&cError #2 in ${sourceID}: ${playerData.data.message}|${playerData.data.stack}`)
                return
            }
            if (playerData.isError) {
                ChatMessage(`&cError #3 in ${sourceID}: ${playerData.data.errorMessage}.`)
                return
            }
            if (playerData.isNull) {
                ChatMessage(`&cError #4 in ${sourceID}: PlayerData is null.`)
                return
            }
            ChatMessage(`&cUnexpected Error #5 in ${sourceID}: ${JSON.stringify(playerData)}.`)
            return
        }
        callback(playerData)
    })
}
