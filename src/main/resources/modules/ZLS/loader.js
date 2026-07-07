import * as DeveloperExports from "./developerExports"
import { dependencyList } from "./Constants"

let BASE_MODULES_FOLDER = null
try {
    BASE_MODULES_FOLDER = ZJS.MODULES_FOLDER_PATH
} catch(e) { }

const modulePrefix = "ZLS"

let isZJS = false
let isFork = false
try {
    isZJS = Object.keys(ZJS).length > 0
} catch(e) { }
try {
    isFork = Object.keys(com.chattriggers.ctjs.api.render.RenderUtils).length > 0
} catch(e) { }

function OnLoaded() {
    try {
        let main = require("./index")
        DeveloperExports.SetFunctionExports(main.FunctionExports)
    } catch (e) {
        const errorMessage = `[${modulePrefix}] Error while loading ${modulePrefix}: ${e} | ${e.stack}`
        console.error(errorMessage)
        ChatLib.chat(errorMessage)
    }
}

function TryLoadDependencies(callback) {
    const missingDependencies = []
    dependencyList.forEach(dependency => {
        if (FileLib.exists(`${BASE_MODULES_FOLDER}/${dependency}`)) return
        console.log(`[${modulePrefix}] Missing dependency: ${dependency}`)
        missingDependencies.push(dependency)
    })

    if (missingDependencies.length == 0) {
        callback()
        return
    }

    console.log(`[${modulePrefix}] Missing ${missingDependencies.length}x dependencies...\n${missingDependencies.join("\n")}`)
}
TryLoadDependencies(() => {
    if (isZJS) {
        OnLoaded()
        return
    }

    let textList = []
    if (isFork) {
        textList = [
            `&6[${modulePrefix}] &cYou are using a outdated version of ChatTriggers.`,
            "&cThis will cause issues with running the mod.",
            `&cTo continue, download the newest version of ZJS from &7\`&b&o${zjsURL}&r&7\`&c.`,
        ]
    } else {
        textList = [
            `&6[${modulePrefix}] &cYou are using a non-compatible/outdated version of ChatTriggers.`,
            "&cThis will cause issues running the mod due to many outstanding problems with the base ChatTriggers mod.",
            `&cTo continue, download the newest version of ZJS from &7\`&b&o${zjsURL}&r&7\`&c.`,
        ]
    }

    if (textList.length == 0) return
    textList.forEach(line => ChatLib.chat(line))
})
