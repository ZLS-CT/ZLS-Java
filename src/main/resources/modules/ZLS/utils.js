export const divider = " &c&m            &6&m            &e&m            &a&m            &b&m            &a&m            &e&m           &6&m           &c&m           &7"
export const PrettyNumber = (number, floor = false) => {
    return (floor) ? PrettyNumber(Math.floor(number), false) : number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const ChatLog = (...strings) => ChatLib.chat(strings.join(" | "))
export const fixElementaText = (str = '') => str.replace('&', '§')

export const GetMapItemFromIndex = (map, index) => {
    return map.get(Array.from(map.keys())[index])
}

export const romanToDecimal = (s) => {
    s = s.toUpperCase()
    value = 0
    for (let i = 0; i < s.length; i += 1) {
        romanValues[s[i]] < romanValues[s[i + 1]] ? value -= romanValues[s[i]] : value += romanValues[s[i]]
    }
    return value
}
export const decimalToRoman = (num) => {
    // const map = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
    let result = ''
    Object.entries(romanValues).forEach(([letter, n]) => {
        result += letter.repeat(Math.floor(num / n))
        num %= n
    })
    return result
}

export const base64Decode = (str, loop = 1) => {
    for (let i = 0; i < loop; i++) {
        str = new java.lang.String(java.util.Base64.getDecoder().decode(str)).toString()
    }
    return str
}
export const base64Encode = (str) => {
    return java.util.Base64.getEncoder().encodeToString(new java.lang.String(str).getBytes())
}

export const ReturnZeroIfNaN = (oldNumber) => {
    return (isNaN(oldNumber)) ? 0 : oldNumber
}

// Month Day Hour:Minute PM/AM
export const DateFormat = (date) => {
    let hours = date.getHours()
    return `${months[date.getMonth()]} ${date.getDate()} ${(hours > 12) ? hours - 12 : hours}:${date.getMinutes().toString().padStart(2, "0")} ${(hours >= 12 && hours != 24) ? "PM" : "AM"}`
}

export const getOpenedInventory = () => {
    return Player.getPlayer()?.field_71070_bA?.func_85151_d()
}
export const getOpenedInventoryName = () => {
    return Player.getPlayer()?.field_71070_bA?.func_85151_d()?.func_70005_c_()
}
export const getItemInSlot = (slot) => {
    return getOpenedInventory()?.func_70301_a(slot)
}
export const getItemName = (item) => {
    return item?.func_82833_r()
}
export const getItemLore = (itemOrSlot, getItem = false) => {
    if (getItem) return getItemLore(getItemInSlot(itemOrSlot))
    return itemOrSlot?.func_77978_p()?.func_74781_a("display")?.func_74781_a("Lore")
}
export const isNullOrUndefined = (item) => {
    return (item == undefined || item == "undefined" || item == null || item == "null")
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
        } else {
            sec = parseInt(timeString.split("s")[0])
        }
    }
    return (min * 60) + sec
}

export const UncompactNumber = (abbrNumber) => {
    let abbrev = abbrNumber.slice(-1)
    let numberStr = abbrNumber.slice(0, -1)

    let multiplier = 1
    switch (abbrev) {
        case 'k':
            multiplier = 1000
            break
        case 'm':
            multiplier = 1000000
            break
        case 'b':
            multiplier = 1000000000
            break
        case 't':
            multiplier = 1000000000000
            break
    }
    return (multiplier == 1) ? parseFloat(abbrNumber) : parseFloat(numberStr) * multiplier
}

const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"]
export const CompactNumber = (number) => {
    var tier = Math.log10(Math.abs(number)) / 3 | 0

    if (tier == 0) return number

    var suffix = SI_SYMBOL[tier]
    var scale = Math.pow(10, tier * 3)

    var scaled = number / scale
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
// 	let min = Math.floor(seconds/60)
// 	let hour = Math.floor(min/60)
// 	if (hour > 0) return `${hour}h ${min - (hour * 60)}m ${seconds - ((min - (hour * 60)) * 60)}s`
// 	return `${min}m ${seconds - (min * 60)}s`
// }
export const secondsToTimeString = (seconds) => {
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds % 3600) / 60)
    let remainingSeconds = seconds % 60
    let timeString = ""

    if (hours > 0) timeString += `${hours}h `

    if (minutes > 0 || hours > 0) timeString += `${minutes}m `

    if (remainingSeconds > 0) timeString += `${remainingSeconds}s`
    return timeString
}

function repeat(func, times) {
    func()
    times && --times && repeat(func, times)
}

export const returnCenteredTextSpaces = (text) => {
    let textWidth = Renderer.getStringWidth(ChatLib.addColor(text))
    let chatWidth = ChatLib.getChatWidth()

    if (textWidth >= chatWidth) {
        return text
    }

    let spaceWidth = (chatWidth - textWidth) / 2
    let spaceBuilder = new Array(parseInt((spaceWidth / Renderer.getStringWidth(" ")).toFixed(0) + 1)).join(' ')
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

export const isOnSkyblock = () => {
    let scoreBoard = ChatLib.removeFormatting(Scoreboard.getTitle())
    return Server.getIP().includes("hypixel") && (scoreBoard.includes("SKIBLOCK") || scoreBoard.includes("SKYBLOCK"))
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

// const colorStringArray = {
// 	'§cRed': 0,
// 	'§aGreen': 1,
// 	'§9Blue': 2,
// 	'§eYellow': 3,
// 	'§6Orange': 4,
// 	'§bAqua': 5,
// 	'§3Cyan': 6,
// 	'§dPink': 7,
// 	'§5Purple': 8,
// 	'§8Gray': 9,
// 	'§8Black': 10,
// 	'§fWhite': 11
// }
// const colorArray = {
// 	"red": [255, 0, 0],
// 	"green": [0, 255, 0],
// 	"blue": [0, 0, 255],
// 	"yellow": [255, 255, 0],
// 	"orange": [255, 170, 0],
// 	"aqua": [0, 255, 255],
// 	"cyan": [0, 170, 170],
// 	"pink": [255, 0, 255],
// 	"purple": [118, 0, 188],
// 	"black": [0, 0, 0],
// 	"gray": [85, 85, 85],
// 	"white": [255, 255, 255]
// }

// const renderArray = [
// 	Renderer.RED, Renderer.GREEN, Renderer.BLUE, Renderer.YELLOW,
// 	Renderer.AQUA, Renderer.LIGHT_PURPLE, Renderer.BLACK, Renderer.WHITE]

export const colorArray = [{
        "ColorName": "red",
        "ColorList": [255, 0, 0],
        "ColorCode": "§c",
        "RenderColor": Renderer.RED
    },
    {
        "ColorName": "green",
        "ColorList": [0, 255, 0],
        "ColorCode": "§a",
        "RenderColor": Renderer.GREEN
    },
    {
        "ColorName": "blue",
        "ColorList": [0, 0, 255],
        "ColorCode": "§9",
        "RenderColor": Renderer.BLUE
    },
    {
        "ColorName": "yellow",
        "ColorList": [255, 255, 0],
        "ColorCode": "§e",
        "RenderColor": Renderer.YELLOW
    },
    {
        "ColorName": "orange",
        "ColorList": [255, 170, 0],
        "ColorCode": "§6",
        "RenderColor": Renderer.GOLD
    },
    {
        "ColorName": "aqua",
        "ColorList": [0, 255, 255],
        "ColorCode": "§b",
        "RenderColor": Renderer.AQUA
    },
    {
        "ColorName": "cyan",
        "ColorList": [0, 170, 170],
        "ColorCode": "§3",
        "RenderColor": Renderer.DARK_AQUA
    },
    {
        "ColorName": "pink",
        "ColorList": [255, 0, 255],
        "ColorCode": "§d",
        "RenderColor": Renderer.LIGHT_PURPLE
    },
    {
        "ColorName": "purple",
        "ColorList": [118, 0, 188],
        "ColorCode": "§5",
        "RenderColor": Renderer.DARK_PURPLE
    },
    {
        "ColorName": "black",
        "ColorList": [0, 0, 0],
        "ColorCode": "§8",
        "RenderColor": Renderer.BLACK
    },
    {
        "ColorName": "gray",
        "ColorList": [85, 85, 85],
        "ColorCode": "§7",
        "RenderColor": Renderer.GRAY
    },
    {
        "ColorName": "white",
        "ColorList": [255, 255, 255],
        "ColorCode": "§f",
        "RenderColor": Renderer.WHITE
    }
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
    return colorArray.findIndex(color => color.colorName == colorName)
}

export const GetColorDataFromIndex = (colorIndex) => {
    return colorArray[colorIndex]
}
