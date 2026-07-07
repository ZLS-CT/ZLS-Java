import ClickGui from "../ClickGui/ClickGui"
import * as Data from "./data"

const legacyConfig = new ClickGui(Data.modulePrefixU, ".legacyConfig.toml", [75, 125, 150, 255])
    .addSelection({
        name: "GodlyGhostSelector",
        title: "Godly",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "None",
        description: "&7Choose which &bGodly &7reforged items are marked.",
        category: "Ghost Reforges",
    })
    .addSelection({
        name: "UnpleasantGhostSelector",
        title: "Unpleasant",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "None",
        description: "&7Choose which &bUnpleasant &7reforged items are marked.",
        category: "Ghost Reforges",
    })
    .addSelection({
        name: "SuperiorGhostSelector",
        title: "Superior",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only", "Dragon Armor Only"],
        value: "Dragon Armor Only",
        description: "&7Choose which &bSuperior &7reforged items are marked.",
        category: "Ghost Reforges",
    })
    .addSelection({
        name: "ZealousGhostSelector",
        title: "Zealous",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "None",
        description: "&7Choose which &bZealous &7reforged items are marked.",
        category: "Ghost Reforges",
    })
    .addSelection({
        name: "KeenGhostSelector",
        title: "Keen",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "Weapon + Armor only",
        description: "&7Choose which &bKeen &7reforged items are marked.",
        category: "Ghost Reforges",
    })
    .addToggle({
        name: "StrangeGhostSelector",
        title: "Strange",
        value: false,
        description: "&7Choose whether &bStrange &7reforged accessories are marked.",
        category: "Ghost Reforges",
    })
    .addToggle({
        name: "ShinyGhostSelector",
        title: "Shiny",
        value: false,
        description: "&7Choose whether &bShiny &7reforged accessories are marked.",
        category: "Ghost Reforges",
    })
    .addToggle({
        name: "VividGhostSelector",
        title: "Vivid",
        value: false,
        description: "&7Choose whether &bVivid &7reforged accessories are marked.",
        category: "Ghost Reforges",
    })

    .addToggle({
        name: "ItchyTalismanSelector",
        title: "Itchy",
        value: false,
        description: "&7Choose whether &bItchy &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "ShadedTalismanSelector",
        title: "Shaded",
        value: false,
        description: "&7Choose whether &bShaded &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "PrettyTalismanSelector",
        title: "Pretty",
        value: false,
        description: "&7Choose whether &bPretty &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "OminousTalismanSelector",
        title: "Ominous",
        value: false,
        description: "&7Choose whether &bOminous &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "PleasantTalismanSelector",
        title: "Pleasant",
        value: false,
        description: "&7Choose whether &bPleasant &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "SimpleTalismanSelector",
        title: "Simple",
        value: false,
        description: "&7Choose whether &bSimple &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "BloodyTalismanSelector",
        title: "Bloody",
        value: false,
        description: "&7Choose whether &bBloody &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "SilkyTalismanSelector",
        title: "Silky",
        value: false,
        description: "&7Choose whether &bSilky &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "BizarreTalismanSelector",
        title: "Bizarre",
        value: false,
        description: "&7Choose whether &bBizarre &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })
    .addToggle({
        name: "SweetTalismanSelector",
        title: "Sweet",
        value: true,
        description: "&7Choose whether &bSweet &7reforged accessories are marked.",
        category: "Legacy Talismans",
    })

    .addSelection({
        name: "DemonicLegacySelector",
        title: "Demonic",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "Weapon + Armor only",
        description: "&7Choose which &bDemonic &7reforged items are marked.",
        category: "Legacy Reforges",
    })
    .addSelection({
        name: "StrongLegacySelector",
        title: "Strong",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "Weapon + Armor only",
        description: "&7Choose which &bStrong &7reforged items are marked.",
        category: "Legacy Reforges",
    })
    .addSelection({
        name: "HurtfulLegacySelector",
        title: "Hurtful",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "Weapon + Armor only",
        description: "&7Choose which &bHurtful &7reforged items are marked.",
        category: "Legacy Reforges",
    })
    .addSelection({
        name: "ForcefulLegacySelector",
        title: "Forceful",
        options: ["None", "All", "Armor only", "Weapon only", "Accessory only", "Armor + Accessory only", "Weapon + Accessory only", "Weapon + Armor only"],
        value: "Weapon + Armor only",
        description: "&7Choose which &bForceful &7reforged items are marked.",
        category: "Legacy Reforges",
    })
    .addToggle({
        name: "RichLegacySelector",
        title: "Rich Swords",
        value: true,
        description: "&7Choose whether &bRich &7reforged swords are marked.",
        category: "Legacy Reforges",
    })
    .addToggle({
        name: "OddLegacySelector",
        title: "Odd Bows",
        value: true,
        description: "&7Choose whether &bOdd &7reforged bows are marked.",
        category: "Legacy Reforges",
    })
    .init()

export default legacyConfig
