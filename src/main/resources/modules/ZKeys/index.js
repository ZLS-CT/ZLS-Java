import { isLegacy } from "modules/ZCore"

const mouseKeyOffset = 100
const keyNameToKeyDataMap = {
    "KEY_UNKNOWN": {
        legacyKeycode: 0,
        modernKeycode: -1,
        prettyName: "Unknown",
    },
    "KEY_NONE": {
        legacyKeycode: 0,
        modernKeycode: -1,
        prettyName: "None",
    },
    "KEY_ESCAPE": {
        legacyKeycode: 1,
        modernKeycode: 256,
        prettyName: "Escape",
    },
    "KEY_1": {
        legacyKeycode: 2,
        modernKeycode: 49,
        prettyName: "1",
    },
    "KEY_2": {
        legacyKeycode: 3,
        modernKeycode: 50,
        prettyName: "2",
    },
    "KEY_3": {
        legacyKeycode: 4,
        modernKeycode: 51,
        prettyName: "3",
    },
    "KEY_4": {
        legacyKeycode: 5,
        modernKeycode: 52,
        prettyName: "4",
    },
    "KEY_5": {
        legacyKeycode: 6,
        modernKeycode: 53,
        prettyName: "5",
    },
    "KEY_6": {
        legacyKeycode: 7,
        modernKeycode: 54,
        prettyName: "6",
    },
    "KEY_7": {
        legacyKeycode: 8,
        modernKeycode: 55,
        prettyName: "7",
    },
    "KEY_8": {
        legacyKeycode: 9,
        modernKeycode: 56,
        prettyName: "8",
    },
    "KEY_9": {
        legacyKeycode: 10,
        modernKeycode: 57,
        prettyName: "9",
    },
    "KEY_0": {
        legacyKeycode: 11,
        modernKeycode: 48,
        prettyName: "0",
    },
    "KEY_MINUS": {
        legacyKeycode: 12,
        modernKeycode: 45,
        prettyName: "-",
    },
    "KEY_EQUALS": {
        legacyKeycode: 13,
        modernKeycode: 61,
        prettyName: "=",
    },
    "KEY_BACKSPACE": {
        legacyKeycode: 14,
        modernKeycode: 259,
        prettyName: "Backspace",
    },
    "KEY_TAB": {
        legacyKeycode: 15,
        modernKeycode: 258,
        prettyName: "Tab",
    },
    "KEY_Q": {
        legacyKeycode: 16,
        modernKeycode: 81,
        prettyName: "Q",
    },
    "KEY_W": {
        legacyKeycode: 17,
        modernKeycode: 87,
        prettyName: "W",
    },
    "KEY_E": {
        legacyKeycode: 18,
        modernKeycode: 69,
        prettyName: "E",
    },
    "KEY_R": {
        legacyKeycode: 19,
        modernKeycode: 82,
        prettyName: "R",
    },
    "KEY_T": {
        legacyKeycode: 20,
        modernKeycode: 84,
        prettyName: "T",
    },
    "KEY_Y": {
        legacyKeycode: 21,
        modernKeycode: 89,
        prettyName: "Y",
    },
    "KEY_U": {
        legacyKeycode: 22,
        modernKeycode: 85,
        prettyName: "U",
    },
    "KEY_I": {
        legacyKeycode: 23,
        modernKeycode: 73,
        prettyName: "I",
    },
    "KEY_O": {
        legacyKeycode: 24,
        modernKeycode: 79,
        prettyName: "O",
    },
    "KEY_P": {
        legacyKeycode: 25,
        modernKeycode: 80,
        prettyName: "P",
    },
    "KEY_LBRACKET": {
        legacyKeycode: 26,
        modernKeycode: 91,
        prettyName: "[",
    },
    "KEY_RBRACKET": {
        legacyKeycode: 27,
        modernKeycode: 93,
        prettyName: "]",
    },
    "KEY_ENTER": {
        legacyKeycode: 28,
        modernKeycode: 257,
        prettyName: "Enter",
    },
    "KEY_LCONTROL": {
        legacyKeycode: 29,
        modernKeycode: 341,
        prettyName: "L-Control",
    },
    "KEY_A": {
        legacyKeycode: 30,
        modernKeycode: 65,
        prettyName: "A",
    },
    "KEY_S": {
        legacyKeycode: 31,
        modernKeycode: 83,
        prettyName: "S",
    },
    "KEY_D": {
        legacyKeycode: 32,
        modernKeycode: 68,
        prettyName: "D",
    },
    "KEY_F": {
        legacyKeycode: 33,
        modernKeycode: 70,
        prettyName: "F",
    },
    "KEY_G": {
        legacyKeycode: 34,
        modernKeycode: 71,
        prettyName: "G",
    },
    "KEY_H": {
        legacyKeycode: 35,
        modernKeycode: 72,
        prettyName: "H",
    },
    "KEY_J": {
        legacyKeycode: 36,
        modernKeycode: 74,
        prettyName: "J",
    },
    "KEY_K": {
        legacyKeycode: 37,
        modernKeycode: 75,
        prettyName: "K",
    },
    "KEY_L": {
        legacyKeycode: 38,
        modernKeycode: 76,
        prettyName: "L",
    },
    "KEY_SEMICOLON": {
        legacyKeycode: 39,
        modernKeycode: 59,
        prettyName: ";",
    },
    "KEY_APOSTROPHE": {
        legacyKeycode: 40,
        modernKeycode: 39,
        prettyName: "'",
    },
    "KEY_GRAVE": {
        legacyKeycode: 41,
        modernKeycode: 96,
        prettyName: "`",
    },
    "KEY_LSHIFT": {
        legacyKeycode: 42,
        modernKeycode: 340,
        prettyName: "L-Shift",
    },
    "KEY_BACKSLASH": {
        legacyKeycode: 43,
        modernKeycode: 92,
        prettyName: "\\",
    },
    "KEY_Z": {
        legacyKeycode: 44,
        modernKeycode: 90,
        prettyName: "Z",
    },
    "KEY_X": {
        legacyKeycode: 45,
        modernKeycode: 88,
        prettyName: "X",
    },
    "KEY_C": {
        legacyKeycode: 46,
        modernKeycode: 67,
        prettyName: "C",
    },
    "KEY_V": {
        legacyKeycode: 47,
        modernKeycode: 86,
        prettyName: "V",
    },
    "KEY_B": {
        legacyKeycode: 48,
        modernKeycode: 66,
        prettyName: "B",
    },
    "KEY_N": {
        legacyKeycode: 49,
        modernKeycode: 78,
        prettyName: "N",
    },
    "KEY_M": {
        legacyKeycode: 50,
        modernKeycode: 77,
        prettyName: "M",
    },
    "KEY_COMMA": {
        legacyKeycode: 51,
        modernKeycode: 44,
        prettyName: ",",
    },
    "KEY_PERIOD": {
        legacyKeycode: 52,
        modernKeycode: 46,
        prettyName: ".",
    },
    "KEY_SLASH": {
        legacyKeycode: 53,
        modernKeycode: 47,
        prettyName: "/",
    },
    "KEY_RSHIFT": {
        legacyKeycode: 54,
        modernKeycode: 344,
        prettyName: "R-Shift",
    },
    "KEY_MULTIPLY": {
        legacyKeycode: 55,
        modernKeycode: 332,
        prettyName: "Numpad *",
    },
    "KEY_LMENU": {
        legacyKeycode: 56,
        modernKeycode: 342,
        prettyName: "L-Alt",
    },
    "KEY_SPACE": {
        legacyKeycode: 57,
        modernKeycode: 32,
        prettyName: "Space",
    },
    "KEY_CAPITAL": {
        legacyKeycode: 58,
        modernKeycode: 280,
        prettyName: "Caps Lock",
    },
    "KEY_F1": {
        legacyKeycode: 59,
        modernKeycode: 290,
        prettyName: "F1",
    },
    "KEY_F2": {
        legacyKeycode: 60,
        modernKeycode: 291,
        prettyName: "F2",
    },
    "KEY_F3": {
        legacyKeycode: 61,
        modernKeycode: 292,
        prettyName: "F3",
    },
    "KEY_F4": {
        legacyKeycode: 62,
        modernKeycode: 293,
        prettyName: "F4",
    },
    "KEY_F5": {
        legacyKeycode: 63,
        modernKeycode: 294,
        prettyName: "F5",
    },
    "KEY_F6": {
        legacyKeycode: 64,
        modernKeycode: 295,
        prettyName: "F6",
    },
    "KEY_F7": {
        legacyKeycode: 65,
        modernKeycode: 296,
        prettyName: "F7",
    },
    "KEY_F8": {
        legacyKeycode: 66,
        modernKeycode: 297,
        prettyName: "F8",
    },
    "KEY_F9": {
        legacyKeycode: 67,
        modernKeycode: 298,
        prettyName: "F9",
    },
    "KEY_F10": {
        legacyKeycode: 68,
        modernKeycode: 299,
        prettyName: "F10",
    },
    "KEY_NUMLOCK": {
        legacyKeycode: 69,
        modernKeycode: 282,
        prettyName: "Num Lock",
    },
    "KEY_SCROLL": {
        legacyKeycode: 70,
        modernKeycode: 281,
        prettyName: "Scroll Lock",
    },
    "KEY_NUMPAD7": {
        legacyKeycode: 71,
        modernKeycode: 327,
        prettyName: "Numpad 7",
    },
    "KEY_NUMPAD8": {
        legacyKeycode: 72,
        modernKeycode: 328,
        prettyName: "Numpad 8",
    },
    "KEY_NUMPAD9": {
        legacyKeycode: 73,
        modernKeycode: 329,
        prettyName: "Numpad 9",
    },
    "KEY_SUBTRACT": {
        legacyKeycode: 74,
        modernKeycode: 333,
        prettyName: "Numpad -",
    },
    "KEY_NUMPAD4": {
        legacyKeycode: 75,
        modernKeycode: 324,
        prettyName: "Numpad 4",
    },
    "KEY_NUMPAD5": {
        legacyKeycode: 76,
        modernKeycode: 325,
        prettyName: "Numpad 5",
    },
    "KEY_NUMPAD6": {
        legacyKeycode: 77,
        modernKeycode: 326,
        prettyName: "Numpad 6",
    },
    "KEY_ADD": {
        legacyKeycode: 78,
        modernKeycode: 334,
        prettyName: "Numpad +",
    },
    "KEY_NUMPAD1": {
        legacyKeycode: 79,
        modernKeycode: 321,
        prettyName: "Numpad 1",
    },
    "KEY_NUMPAD2": {
        legacyKeycode: 80,
        modernKeycode: 322,
        prettyName: "Numpad 2",
    },
    "KEY_NUMPAD3": {
        legacyKeycode: 81,
        modernKeycode: 323,
        prettyName: "Numpad 3",
    },
    "KEY_NUMPAD0": {
        legacyKeycode: 82,
        modernKeycode: 320,
        prettyName: "Numpad 0",
    },
    "KEY_DECIMAL": {
        legacyKeycode: 83,
        modernKeycode: 330,
        prettyName: "Numpad .",
    },
    "KEY_F11": {
        legacyKeycode: 87,
        modernKeycode: 300,
        prettyName: "F11",
    },
    "KEY_F12": {
        legacyKeycode: 88,
        modernKeycode: 301,
        prettyName: "F12",
    },
    "KEY_F13": {
        legacyKeycode: 100,
        modernKeycode: 302,
        prettyName: "F13",
    },
    "KEY_F14": {
        legacyKeycode: 101,
        modernKeycode: 303,
        prettyName: "F14",
    },
    "KEY_F15": {
        legacyKeycode: 102,
        modernKeycode: 304,
        prettyName: "F15",
    },
    "KEY_F16": {
        legacyKeycode: 103,
        modernKeycode: 305,
        prettyName: "F16",
    },
    "KEY_F17": {
        legacyKeycode: 104,
        modernKeycode: 306,
        prettyName: "F17",
    },
    "KEY_F18": {
        legacyKeycode: 105,
        modernKeycode: 307,
        prettyName: "F18",
    },
    // "KEY_KANA": [112,],
    "KEY_F19": {
        legacyKeycode: 113,
        modernKeycode: 308,
        prettyName: "F19",
    },
    // "KEY_CONVERT": [121,],
    // "KEY_NOCONVERT": [123,],
    // "KEY_YEN": [125,],
    "KEY_NUMPADEQUALS": {
        legacyKeycode: 141,
        modernKeycode: 336,
        prettyName: "Numpad =",
    },
    // "KEY_CIRCUMFLEX": [144,],
    // "KEY_AT": [145,],
    // "KEY_COLON": [146,],
    // "KEY_UNDERLINE": [147,],
    // "KEY_KANJI": [148,],
    // "KEY_STOP": [149,],
    // "KEY_AX": [150,],
    // "KEY_UNLABELED": [151,],
    "KEY_NUMPADENTER": {
        legacyKeycode: 156,
        modernKeycode: 335,
        prettyName: "Numpad Enter",
    },
    "KEY_RCONTROL": {
        legacyKeycode: 157,
        modernKeycode: 345,
        prettyName: "R-Control",
    },
    // "KEY_SECTION": [167,],
    // "KEY_NUMPADCOMMA": [179,],
    "KEY_DIVIDE": {
        legacyKeycode: 181,
        modernKeycode: 331,
        prettyName: "Numpad /",
    },
    "KEY_PRINTSCREEN": {
        legacyKeycode: 183,
        modernKeycode: 283,
        prettyName: "Print Screen",
    },
    "KEY_RMENU": {
        legacyKeycode: 184,
        modernKeycode: 346,
        prettyName: "R-Alt",
    },
    // "KEY_FUNCTION": [196,],
    "KEY_PAUSE": {
        legacyKeycode: 197,
        modernKeycode: 284,
        prettyName: "Pause",
    },
    "KEY_HOME": {
        legacyKeycode: 199,
        modernKeycode: 268,
        prettyName: "Home",
    },
    "KEY_UP": {
        legacyKeycode: 200,
        modernKeycode: 265,
        prettyName: "Up",
    },
    "KEY_PRIOR": {
        legacyKeycode: 201,
        modernKeycode: 266,
        prettyName: "Prior",
    },
    "KEY_LEFT": {
        legacyKeycode: 203,
        modernKeycode: 263,
        prettyName: "Left",
    },
    "KEY_RIGHT": {
        legacyKeycode: 205,
        modernKeycode: 262,
        prettyName: "Right",
    },
    "KEY_END": {
        legacyKeycode: 207,
        modernKeycode: 269,
        prettyName: "End",
    },
    "KEY_DOWN": {
        legacyKeycode: 208,
        modernKeycode: 264,
        prettyName: "Down",
    },
    "KEY_NEXT": {
        legacyKeycode: 209,
        modernKeycode: 267,
        prettyName: "Next",
    },
    "KEY_INSERT": {
        legacyKeycode: 210,
        modernKeycode: 260,
        prettyName: "Insert",
    },
    "KEY_DELETE": {
        legacyKeycode: 211,
        modernKeycode: 261,
        prettyName: "Delete",
    },
    // "KEY_CLEAR": [218,],
    "KEY_LWIN": {
        legacyKeycode: 219,
        modernKeycode: 343,
        prettyName: "L-Win",
    },
    "KEY_RWIN": {
        legacyKeycode: 220,
        modernKeycode: 347,
        prettyName: "R-Win",
    },
    // "KEY_APPS": [221,],
    // "KEY_POWER": [222,],
    // "KEY_SLEEP": [223,]
    "LEFT_MOUSE": {
        legacyKeycode: 0 - mouseKeyOffset,
        modernKeycode: 0 - mouseKeyOffset,
        prettyName: "L-Mouse",
    },
    "RIGHT_MOUSE": {
        legacyKeycode: 1 - mouseKeyOffset,
        modernKeycode: 1 - mouseKeyOffset,
        prettyName: "R-Mouse",
    },
    "MIDDLE_MOUSE": {
        legacyKeycode: 2 - mouseKeyOffset,
        modernKeycode: 2 - mouseKeyOffset,
        prettyName: "Middle Mouse",
    },
    "MOUSE_4": {
        legacyKeycode: 3 - mouseKeyOffset,
        modernKeycode: 3 - mouseKeyOffset,
        prettyName: "Mouse 4",
    },
    "MOUSE_5": {
        legacyKeycode: 4 - mouseKeyOffset,
        modernKeycode: 4 - mouseKeyOffset,
        prettyName: "Mouse 5",
    },
    "MOUSE_6": {
        legacyKeycode: 5 - mouseKeyOffset,
        modernKeycode: 5 - mouseKeyOffset,
        prettyName: "Mouse 6",
    },
    "MOUSE_7": {
        legacyKeycode: 6 - mouseKeyOffset,
        modernKeycode: 6 - mouseKeyOffset,
        prettyName: "Mouse 7",
    },
    "MOUSE_8": {
        legacyKeycode: 7 - mouseKeyOffset,
        modernKeycode: 7 - mouseKeyOffset,
        prettyName: "Mouse 8",
    },
    "MOUSE_9": {
        legacyKeycode: 8 - mouseKeyOffset,
        modernKeycode: 8 - mouseKeyOffset,
        prettyName: "Mouse 9",
    },
}
const shiftedCharacters = {
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '"',
    ',': '<',
    '.': '>',
    '/': '?',
    '`': '~',
}
const modifierKeyNames = new Set([
    "KEY_LCONTROL", "KEY_RCONTROL",
    "KEY_LSHIFT", "KEY_RSHIFT",
    "KEY_LMENU", "KEY_RMENU" // ALT
])
const modifierKeyCodes = new Set()
for (let keyName of modifierKeyNames) {
    let keyData = keyNameToKeyDataMap[keyName]
    modifierKeyCodes.add(keyData[isLegacy ? "legacyKeycode" : "modernKeycode"])
}

const keyCodeToKeyNameMappings = {}
function GenerateKeyCodeMappings() {
    for (let keyName in keyNameToKeyDataMap) {
        let keyData = keyNameToKeyDataMap[keyName]
        keyCodeToKeyNameMappings[keyData[isLegacy ? "legacyKeycode" : "modernKeycode"]] = keyName
    }
}
GenerateKeyCodeMappings()

export const getKeyCode = (keyName) => {
    if (keyNameToKeyDataMap.hasOwnProperty(keyName)) {
        return keyNameToKeyDataMap[keyName][isLegacy ? "legacyKeycode" : "modernKeycode"]
    }
    ChatLib.chat(`§c[ZConfig] Unknown key with name: §e${keyName}§c.`)
    return null
}
export const getKeyName = (keyCode) => {
    if (keyCodeToKeyNameMappings[keyCode]) {
        return keyCodeToKeyNameMappings[keyCode]
    }
    ChatLib.chat(`§c[ZConfig] Unknown keycode: §e${keyCode}§c.`)
    return "KEY_UNKNOWN"
}
export const getKeyNamePrettyName = (keyName) => {
    if (keyName == "KEY_UNKNOWN") return "Unknown"
    if (keyNameToKeyDataMap.hasOwnProperty(keyName)) {
        return keyNameToKeyDataMap[keyName].prettyName
    }
    ChatLib.chat(`§c[ZConfig] Unknown key with name: §e${keyName}§c.`)
    return "Unknown"
}
export const getKeyCodePrettyName = (keyCode) => {
    return getKeyNamePrettyName(getKeyName(keyCode))
}
export const getModifiedCharacter = (char) => {
    if (!isShiftDown()) return char
    return shiftedCharacters[char] || char.toUpperCase()
}
export const isKeyNameDown = (keyName) => {
    return isKeyCodeDown(getKeyCode(keyName))
}
export const isKeyCodeDown = (keyCode) => {
    if (keyCode == null) return false
    return UKeyboard.isKeyDown(keyCode)
}
export const isModifierKeyName = (keyName) => {
    return modifierKeyNames.has(keyName)
}
export const isModifierKeyCode = (keyCode) => {
    return modifierKeyCodes.has(keyCode)
}
export const isShiftDown = () => {
    return isKeyNameDown("KEY_LSHIFT") || isKeyNameDown("KEY_RSHIFT")
}
export const isCtrlDown = () => {
    return isKeyNameDown("KEY_LCONTROL") || isKeyNameDown("KEY_RCONTROL")
}
export const isAltDown = () => {
    return isKeyNameDown("KEY_LMENU") || isKeyNameDown("KEY_RMENU")
}
export const isEscapeDown = () => {
    return isKeyNameDown("KEY_ESCAPE")
}
export const GetKeyComboName = (originalKeyName, modifiers) => {
    if (originalKeyName == "KEY_UNKNOWN") return "Unknown"
    let modifierNames = []
    if (modifiers.ctrl) modifierNames.push("Ctrl")
    if (modifiers.shift) modifierNames.push("Shift")
    if (modifiers.alt) modifierNames.push("Alt")
    modifierNames.push(getKeyNamePrettyName(originalKeyName))
    return modifierNames.join(" + ")
}
