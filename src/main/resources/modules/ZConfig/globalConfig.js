import { ZConfigSettings } from "./index.js"
import {
    isLegacy,
    modulesFolder,
    registerNewCommand,
    createCommandHandler,
    createCommandLiteral,
    numberToByte,
    stringToBytes,
    bytesToString,
    ZTextComponent,
    ChatMessage,
} from "modules/ZCore"
import * as Variables from "./variables"
import * as Utils from "./utils"

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

const SetColorPreset = (presetName) => {
    const colorPreset = Variables.GetAllPresets()[presetName]
    const primaryColorOption = globalConfig.data.persistent["primaryColor"]
    const secondaryColorOption = globalConfig.data.persistent["secondaryColor"]
    const tertiaryColorOption = globalConfig.data.persistent["tertiaryColor"]
    const darkerColorOption = globalConfig.data.persistent["darkerColor"]
    const darkColorOption = globalConfig.data.persistent["darkColor"]
    const lightColorOption = globalConfig.data.persistent["lightColor"]
    const brightColorOption = globalConfig.data.persistent["brightColor"]
    const transparentColorOption = globalConfig.data.persistent["transparentColor"]
    const textColorOption = globalConfig.data.persistent["textColor"]
    const secondaryTextColorOption = globalConfig.data.persistent["secondaryTextColor"]
    Utils.ResetColorPickerFromRGB(primaryColorOption, colorPreset.primary)
    Utils.ResetColorPickerFromRGB(secondaryColorOption, colorPreset.secondary)
    Utils.ResetColorPickerFromRGB(tertiaryColorOption, colorPreset.tertiary)
    Utils.ResetColorPickerFromRGB(darkerColorOption, colorPreset.darker)
    Utils.ResetColorPickerFromRGB(darkColorOption, colorPreset.dark)
    Utils.ResetColorPickerFromRGB(lightColorOption, colorPreset.light)
    Utils.ResetColorPickerFromRGB(brightColorOption, colorPreset.bright)
    Utils.ResetColorPickerFromRGB(transparentColorOption, colorPreset.transparent)
    Utils.ResetColorPickerFromRGB(textColorOption, colorPreset.text)
    Utils.ResetColorPickerFromRGB(secondaryTextColorOption, colorPreset.secondaryText)
    globalConfig.callOnChanged(primaryColorOption, colorPreset.primary)
    globalConfig.callOnChanged(secondaryColorOption, colorPreset.secondary)
    globalConfig.callOnChanged(tertiaryColorOption, colorPreset.tertiary)
    globalConfig.callOnChanged(darkerColorOption, colorPreset.darker)
    globalConfig.callOnChanged(darkColorOption, colorPreset.dark)
    globalConfig.callOnChanged(lightColorOption, colorPreset.light)
    globalConfig.callOnChanged(brightColorOption, colorPreset.bright)
    globalConfig.callOnChanged(transparentColorOption, colorPreset.transparent)
    globalConfig.callOnChanged(textColorOption, colorPreset.text)
    globalConfig.callOnChanged(secondaryTextColorOption, colorPreset.secondaryText)
    primaryColorOption.placeholder = colorPreset.primary
    secondaryColorOption.placeholder = colorPreset.secondary
    tertiaryColorOption.placeholder = colorPreset.tertiary
    darkerColorOption.placeholder = colorPreset.darker
    darkColorOption.placeholder = colorPreset.dark
    lightColorOption.placeholder = colorPreset.light
    brightColorOption.placeholder = colorPreset.bright
    transparentColorOption.placeholder = colorPreset.transparent
    textColorOption.placeholder = colorPreset.text
    secondaryTextColorOption.placeholder = colorPreset.secondaryText
}

const SaveColorPreset = (presetName, presetData, overwrite, sendChatMessage) => {
    if (!presetName) throw "Invalid preset name."
    if (!presetData) throw "Invalid preset data."

    const outputFolder = new File(`${modulesFolder}/${Variables.moduleName}/ColorPresets/`)
    if (!outputFolder.exists()) {
        outputFolder.mkdirs()
    }

    const outputFile = new File(`${outputFolder}/${presetName}.json`)
    if (FileLib.exists(outputFile) && !overwrite) throw "Preset with name already exists."

    FileLib.write(outputFile, JSON.stringify(presetData, null, 4))
    RefreshPresets()

    if (!sendChatMessage) return
    ChatMessage(`&7[&aZConfig&7] &6-> &aSuccessfully saved preset &7\`&e${presetName}&7\`&a!`)
}
const DeletePreset = (presetName) => {
    const presetData = Variables.GetPresetDataFromName(presetName)
    if (!presetData) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cPreset &7\`&e${presetName}&7\`&c not found!`)
        return
    }

    const outputFolder = new File(`${modulesFolder}/${Variables.moduleName}/ColorPresets/`)
    if (!outputFolder.exists()) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cPreset folder not found!`)
        return
    }

    const outputFile = new File(`${outputFolder}/${presetName}.json`)
    if (!FileLib.exists(outputFile)) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cPreset file not found!`)
        return
    }

    FileLib.delete(outputFile)
    ChatMessage(`&7[&aZConfig&7] &6-> &aSuccessfully deleted preset &7\`&e${presetName}&7\`!`)
}

const RefreshPresets = () => {
    globalConfig.data.persistent["globalColorPreset"].options = Object.keys(Variables.GetAllPresets())
}

export const encodePreset = (presetName, presetData) => {
    const nameBytes = stringToBytes(presetName)
    if (nameBytes.length > 255) throw "Preset name too long."

    const totalLen = 1 + nameBytes.length + 40
    const bytes = JavaArray.newInstance(Byte.TYPE, totalLen)

    let i = 0
    bytes[i++] = numberToByte(nameBytes.length)
    for (let n = 0; n < nameBytes.length; n++) {
        bytes[i++] = nameBytes[n]
    }
    for (let k = 0; k < 10; k++) {
        const a = presetData[k]
        bytes[i++] = numberToByte(a[0])
        bytes[i++] = numberToByte(a[1])
        bytes[i++] = numberToByte(a[2])
        bytes[i++] = numberToByte(a[3])
    }

    const data = Base64
        .getUrlEncoder()
        .withoutPadding()
        .encodeToString(bytes)

    return "v1." + data
}
export const decodePreset = (str) => {
    const parts = str.split(".")
    if (parts[0] != "v1") throw "Invalid preset version."

    const bytes = Base64.getUrlDecoder().decode(parts[1])

    let i = 0
    const nameLen = bytes[i++] & 0xff
    const presetName = bytesToString(bytes, i, nameLen)
    i += nameLen

    const presetData = {}
    for (let k = 0; k < 10; k++) {
        presetData[k] = [
            bytes[i++] & 0xFF,
            bytes[i++] & 0xFF,
            bytes[i++] & 0xFF,
            bytes[i++] & 0xFF,
        ]
    }

    return {
        presetName,
        presetData,
    }
}

;(function() {
    const commandName = "zconfigpreset"
    const commands = {
        import: {
            handler: Command_HandleImportPreset,
            args: [
                {
                    name: "presetData",
                    type: cString,
                },
                {
                    name: "overwrite",
                    type: cBool,
                },
            ],
        },
        export: {
            handler: Command_HandleExportPreset,
            args: [
                {
                    name: "presetName",
                    type: cString,
                },
            ],
        },
        list: {
            handler: Command_HandleListPresets,
            args: [],
        },
        delete: {
            handler: Command_HandleDeletePreset,
            args: [
                {
                    name: "presetName",
                    type: cString,
                },
            ],
        },
    }

    registerNewCommand(
        commandName,
        (...args) => { createCommandHandler(commands, ...args) },
        () => {
            Object.keys(commands).forEach((literalName) => {
                if (literalName.startsWith("_")) return
                createCommandLiteral(commands, literalName)
            })
        }, [],
    )
})()
function Command_HandleImportPreset(encodedPreset, overwrite) {
    try {
        const decodedPreset = decodePreset(encodedPreset)
        const shortPresetData = decodedPreset.presetData
        const presetData = {
            primary: shortPresetData[0],
            secondary: shortPresetData[1],
            tertiary: shortPresetData[2],
            darker: shortPresetData[3],
            dark: shortPresetData[4],
            light: shortPresetData[5],
            bright: shortPresetData[6],
            transparent: shortPresetData[7],
            text: shortPresetData[8],
            secondaryText: shortPresetData[9],
        }
        SaveColorPreset(decodedPreset.presetName, presetData, overwrite, false)
        ChatMessage(`&7[&aZConfig&7] &6-> &aSuccessfully imported preset &7\`&e${decodedPreset.presetName}&7\`&a!`)
    } catch (e) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cFailed to import preset: &7\`${e.message}&7\``)
    }
}
function Command_HandleExportPreset(presetName) {
    const presetData = Variables.GetPresetDataFromName(presetName)
    if (!presetData) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cPreset &7\`&e${presetName}&7\`&c not found!`)
        return
    }
    const shortenPresetData = {
        0: presetData.primary.map(Math.round),
        1: presetData.secondary.map(Math.round),
        2: presetData.tertiary.map(Math.round),
        3: presetData.darker.map(Math.round),
        4: presetData.dark.map(Math.round),
        5: presetData.light.map(Math.round),
        6: presetData.bright.map(Math.round),
        7: presetData.transparent.map(Math.round),
        8: presetData.text.map(Math.round),
        9: presetData.secondaryText.map(Math.round),
    }
    const encodedPreset = encodePreset(presetName, shortenPresetData)
    ChatMessage(`&7[&aZConfig&7] &6-> &aSuccessfully exported preset &7\`&e${presetName}&7\` &ato clipboard!`)
    Client.copy(`/zconfigimport ${encodedPreset}`)
}
function Command_HandleListPresets() {
    const presetNames = Variables.GetCustomPresetNames()
    if (presetNames.length == 0) {
        ChatMessage(`&7[&aZConfig&7] &6-> &eNo custom presets found!`)
        return
    }

    const textComponent = new ZTextComponent()
    textComponent.withText(`&7[&aZConfig&7] &6Custom Presets &7- (&6${presetNames.length}&7)&6:`)
    presetNames.forEach((presetName) => {
        textComponent
            .withText("\n")
            .withText(`  &7-> &6${presetName} `)
            .withTextObject({
                text: `&6[Export]`,
                clickEvent: {
                    action: "run_command",
                    value: `/zconfigpreset export ${presetName}`
                },
                hoverEvent: {
                    action: "show_text",
                    value: `&6Export Preset ${presetName}`
                },
            })
            .withText(" ")
            .withTextObject({
                text: `&6[Delete]`,
                clickEvent: {
                    action: "run_command",
                    value: `/zconfigpreset delete ${presetName}`
                },
                hoverEvent: {
                    action: "show_text",
                    value: `&6Delete Preset ${presetName}`
                },
            })
    })
    textComponent.chat()
}
function Command_HandleDeletePreset(presetName) {
    const presetData = Variables.GetPresetDataFromName(presetName)
    if (!presetData) {
        ChatMessage(`&7[&aZConfig&7] &6-> &cPreset &7\`&e${presetName}&7\`&c not found!`)
        return
    }
    DeletePreset(presetName)
}

;(function() {
    const commandName = "zconfigexportpreset"
    const commands = {
        _defaultWithInput: {
            handler: Command_HandleExportPreset,
            args: [
                {
                    name: "presetName",
                    type: cString,
                },
            ],
        },
    }

    registerNewCommand(
        commandName,
        (...args) => { createCommandHandler(commands, ...args) },
        () => {
            cArgument("presetName", cString(), () => {
                cExec(({ presetName }) => {
                    createCommandHandler(commands, "_defaultWithInput", presetName)
                })
            })
        }, [
            "zconfigexport",
            "zconfigpresetexport",
        ],
    )
})()
;(function() {
    const commandName = "zconfigimportpreset"
    const commands = {
        _defaultWithInput: {
            handler: Command_HandleImportPreset,
            args: [
                {
                    name: "presetData",
                    type: cString,
                },
                {
                    name: "overwrite",
                    type: cBool,
                },
            ],
        },
    }

    registerNewCommand(
        commandName,
        (...args) => { createCommandHandler(commands, ...args) },
        () => {
            cArgument("presetData", cString(), () => {
                cArgument("overwrite", cBool(), () => {
                    cExec(({ presetData, overwrite }) => {
                        createCommandHandler(commands, "_defaultWithInput", presetData, overwrite)
                    })
                })
                cExec(({ presetData }) => {
                    createCommandHandler(commands, "_defaultWithInput", presetData, false)
                })
            })
        }, [
            "zconfigimport",
            "zconfigpresetimport",
        ],
    )
})()

const globalConfig = new ZConfigSettings(Variables.globalConfigName, "ZConfig", "ZConfigGlobalSettings.json")
    .command("zconfig")
    .addSwitch({
        varname: "outlineOptions",
        group: "Global",
        category: "Preferences",
        subcategory: "Options",
        name: "Outline On Options",
        description: "Whether an outline is shown around each option to make them easier to distinguish",
        placeholder: true,
    })
    .addSwitch({
        varname: "globalFullscreen",
        group: "Global",
        category: "Preferences",
        subcategory: "Options",
        name: "Fullscreen Menu",
        description: "Whether the settings menu should be displayed in fullscreen mode",
        placeholder: false,
    })
    .addSwitch({
        varname: "globalDarkenBackground",
        group: "Global",
        category: "Preferences",
        subcategory: "Options",
        name: "Darken Background",
        description: "Whether the background should be darkened when the settings menu is open",
        placeholder: true,
        requires: [
            {"globalFullscreen": false}
        ],
    })
    .addSwitch({
        varname: "globalTextShadow",
        group: "Global",
        category: "Preferences",
        subcategory: "Options",
        name: "Menu Text Shadow",
        description: "Whether the menu text should have a text shadow",
        placeholder: true,
    })
    .addSwitch({
        varname: "globalOptionScissor",
        group: "Global",
        category: "Preferences",
        subcategory: "Options",
        name: "Menu Option Scissor",
        description: "Whether the menu options should be scissored.\n§cOnly disable this if you experience issues with menu options being cut off.",
        placeholder: true,
    })
    .addDropdown({
        varname: "globalColorPreset",
        group: "Global",
        category: "Preferences",
        subcategory: "Presets",
        name: "Color Preset",
        description: "Changes the menu colors to a preset. Modifying individual colors will override this.",
        options: Object.keys(Variables.GetAllPresets()),
    })
    .registerListener("globalColorPreset", (option, oldValue, newValue) => {
        SetColorPreset(Variables.GetPresetNameFromIndex(newValue))
    })
    .addButton({
        varname: "refreshCustomPresets",
        group: "Global",
        category: "Preferences",
        subcategory: "Presets",
        name: "Refresh Presets",
        description: "Refreshes the list of color presets.",
        onPress: () => {
            RefreshPresets()
        },
    })

    .addColorPicker({
        varname: "primaryColor",
        description: "Primary menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Primary Color",
        placeholder: [90, 102, 255, 255],
    })
    .addColorPicker({
        varname: "secondaryColor",
        description: "Secondary menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Secondary Color",
        placeholder: [13, 13, 13, 255],
    })
    .addColorPicker({
        varname: "tertiaryColor",
        description: "Tertiary menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Tertiary Color",
        placeholder: [30, 30, 30, 255],
    })
    .addColorPicker({
        varname: "darkerColor",
        description: "Darker menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Darker Color",
        placeholder: [20, 20, 20, 255],
    })
    .addColorPicker({
        varname: "darkColor",
        description: "Dark menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Dark Color",
        placeholder: [51, 51, 51, 255],
    })
    .addColorPicker({
        varname: "lightColor",
        description: "Light menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Light Color",
        placeholder: [102, 102, 102, 255],
    })
    .addColorPicker({
        varname: "brightColor",
        description: "Bright menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Bright Color",
        placeholder: [127, 127, 127, 255],
    })
    .addColorPicker({
        varname: "transparentColor",
        description: "Transparent menu color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Transparent Color",
        placeholder: [102, 102, 102, 100],
    })
    .addColorPicker({
        varname: "textColor",
        description: "Main text color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Text Color",
        placeholder: [255, 255, 255, 255],
    })
    .addColorPicker({
        varname: "secondaryTextColor",
        description: "Secondary text color",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Colors",
        name: "Secondary Text Color",
        placeholder: [170, 170, 170, 255],
    })
    .addButton({
        varname: "resetColorsButton",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Reset",
        name: "Reset Colors",
        description: "Resets all colors to their default values",
        onPress: () => {
            SetColorPreset(Variables.GetPresetNameFromIndex(globalConfig.globalColorPreset))
        },
    })
    .addText({
        varname: "customColorPresetName",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Custom Presets",
        name: "Color Preset Name",
        description: "The name of the custom color preset.",
    })
    .addButton({
        varname: "saveColorPreset",
        group: "Global",
        category: "Menu Colors",
        subcategory: "Custom Presets",
        name: "Save Color Preset",
        description: "Saves the current color settings as a preset.",
        onPress: () => {
            const currentPreset = {
                primary: Variables.globalConfig.data.persistent["primaryColor"].value,
                secondary: Variables.globalConfig.data.persistent["secondaryColor"].value,
                tertiary: Variables.globalConfig.data.persistent["tertiaryColor"].value,
                darker: Variables.globalConfig.data.persistent["darkerColor"].value,
                dark: Variables.globalConfig.data.persistent["darkColor"].value,
                light: Variables.globalConfig.data.persistent["lightColor"].value,
                bright: Variables.globalConfig.data.persistent["brightColor"].value,
                transparent: Variables.globalConfig.data.persistent["transparentColor"].value,
                text: Variables.globalConfig.data.persistent["textColor"].value,
                secondaryText: Variables.globalConfig.data.persistent["secondaryTextColor"].value,
            }
            SaveColorPreset(globalConfig.customColorPresetName, currentPreset, true, true)
        },
    })
