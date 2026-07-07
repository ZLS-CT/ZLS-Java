const ForgeVersion = Java.type("net.minecraftforge.common.ForgeVersion")

class ExportableValue {
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

export const versionToInt = (version) => {
    const parts = version.split(".").map(n => Number(n))
    const major = parts[0]
    const minor = parts[1] ?? 0
    const patch = parts[2] ?? 0
    return Number(`${major}${String(minor).padStart(2, "0")}${String(patch).padStart(2, "0")}`)
}

let _gameVersion
if (Object.keys(ForgeVersion).length > 0) {
    _gameVersion = ForgeVersion.mcVersion
} else {
    _gameVersion = FabricLoader.getInstance()
        .getModContainer("minecraft")
        .orElseThrow()
        .getMetadata()
        .getVersion()
        .getFriendlyString()
}
export const gameVersionString = _gameVersion
export const gameVersion = versionToInt(_gameVersion)
export const isLegacy = gameVersion < 12100
export let isZJS = new ExportableValue(false)
export let isFork = new ExportableValue(false)
try {
    isZJS = Object.keys(ZJS).length > 0
} catch(e) { }
try {
    isFork = Object.keys(com.chattriggers.ctjs.api.render.RenderUtils).length > 0
} catch(e) { }
