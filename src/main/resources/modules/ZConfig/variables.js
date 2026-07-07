import * as ZRenderLib from "../ZRenderLib"
import { modulesFolder } from "modules/ZCore"

export class ExportableValue {
    constructor(initial) {
        this._value = initial;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
    }

    toString() {
        return String(this._value);
    }

    valueOf() {
        return this._value;
    }
}

export const moduleName = "ZConfig"
export const globalConfigName = "ZConfig Global Settings"
export const backIcon = ZRenderLib.loadImageFromFile(`${modulesFolder}/${moduleName}/assets/UIBackIcon.png`)
export const colorPresets = {
    "Default": {
        primary: [90, 102, 255, 255],
        secondary: [13, 13, 13, 255],
        tertiary: [30, 30, 30, 255],
        darker: [20, 20, 20, 255],
        dark: [51, 51, 51, 255],
        light: [102, 102, 102, 255],
        bright: [127, 127, 127, 255],
        transparent: [102, 102, 102, 100],
        text: [255, 255, 255, 255],
        secondaryText: [170, 170, 170, 255],
    },
    "Light": {
        primary: [0, 122, 204, 255],
        secondary: [255, 255, 255, 255],
        tertiary: [240, 240, 240, 255],
        darker: [220, 220, 220, 255],
        dark: [180, 180, 180, 255],
        light: [140, 140, 140, 255],
        bright: [100, 100, 100, 255],
        transparent: [140, 140, 140, 100],
        text: [0, 0, 0, 255],
        secondaryText: [85, 85, 85, 255],
    },
    "Neo": {
        primary: [0, 255, 0, 255],
        secondary: [10, 10, 10, 255],
        tertiary: [15, 15, 15, 255],
        darker: [5, 5, 5, 255],
        dark: [25, 25, 25, 255],
        light: [60, 60, 60, 255],
        bright: [100, 100, 100, 255],
        transparent: [60, 60, 60, 100],
        text: [255, 255, 255, 255],
        secondaryText: [0, 180, 0, 255],
    },
}

export const GetCustomPresets = () => {
    const customPresetMap = {}
    const presetFolder = new JavaFile(`${modulesFolder}/${moduleName}/ColorPresets/`)
    if (!presetFolder.exists()) {
        return customPresetMap
    }

    const files = presetFolder.listFiles()
    files.forEach(file => {
        if (!(file.isFile() && file.getName().endsWith(".json"))) return
        try {
            customPresetMap[file.getName().replace(".json", "")] = JSON.parse(FileLib.read(`${modulesFolder}/${moduleName}/ColorPresets/${file.getName()}`))
        } catch (e) { }
    })
    return customPresetMap
}
export const GetCustomPresetNames = () => {
    return Object.keys(GetCustomPresets())
}

export const GetAllPresets = () => {
    return { ...colorPresets, ...GetCustomPresets() }
}
export const GetPresetNameFromIndex = (presetIndex) => {
    try {
        return Object.keys(GetAllPresets())[presetIndex]
    } catch (e) {}
    return "Default"
}
export const GetPresetDataFromName = (presetName) => {
    const allPresets = GetAllPresets()
    const presetData = allPresets[presetName]
    if (presetData) return presetData
    return null
}

export const inputs = {}
export let shouldClick = new ExportableValue(false)
export let globalColors = new ExportableValue(colorPresets["Default"])
export let globalConfig = null
