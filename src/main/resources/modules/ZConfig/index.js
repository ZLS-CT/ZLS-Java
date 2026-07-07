import * as ZRenderLib from "../ZRenderLib"
import * as ZKeys from "modules/ZKeys"
import { modulesFolder, gameVersion } from "modules/ZCore"

import * as Variables from "./variables"
import * as Utils from "./utils"
import * as Elements from "./elements"
import * as Hud from "./hud"

const searchIcon = ZRenderLib.loadImageFromFile(`${modulesFolder}/${Variables.moduleName}/assets/UISearchIcon.png`)
const insetSpacing = 1
const doubleInsetSpacing = insetSpacing * 2

let currentOpenedGUI = null
let tooltipFade
let scroll = [
    {
        scroll: 0,
        buffer: 0,
        x: 0,
        max: 0,
        time: 0
    },
    {
        scroll: 0,
        buffer: 0,
        x: 0,
        max: 0,
        time: 0
    },
    {
        scroll: 0,
        buffer: 0,
        x: 0,
        max: 0,
        time: 0
    }
]

const GetElementName = (element) => {
    if (typeof element.name === "function") {
        return element.name(element)
    }
    return element.name
}
const GetElementDescription = (element) => {
    if (typeof element.description === "function") {
        return element.description(element)
    }
    return element.description
}

export class ZConfigSettings {
    isNullOrUndefined = (item) => {
        return (item == undefined || item == null)
    }
    autosave(saveIntervalMinutes) {
        register("step", () => this.data.save()).setDelay(60 * saveIntervalMinutes)
        register("gameUnload", () => this.data.save())
    }

    isOpen() {
        return this.gui.isOpen() || Variables.globalConfig.gui.isOpen()
    }

    IsElementHidden = (element) => {
        if (element.hidden) return true
        if (element.hideIf) {
            if (element.hideIf(this.data.persistent[element.varname].value)) return true
        }

        if (element.requires && element.requires.length > 0) {
            const allDependenciesMet = element.requires.every(requiresData => {
                const dependsOnVarName = Object.keys(requiresData)[0]
                const dependsOnValue = requiresData[dependsOnVarName]
                const dependsOnOption = this.data.persistent[dependsOnVarName]

                if (!dependsOnOption) return false
                if (typeof dependsOnValue == "function") {
                    return dependsOnValue(dependsOnOption.value)
                }
                return dependsOnOption.value == dependsOnValue
            })
            if (!allDependenciesMet) return true
        }
        return false
    }

    callOnChanged(option, oldValue = null) {
        if (this.listeners[option.varname || GetElementName(option)]) {
            const newOldValue = option.old || oldValue
            const isSame = typeof newOldValue === "object" && newOldValue !== null
                ? JSON.stringify(newOldValue) === JSON.stringify(option.value)
                : newOldValue == option.value
            if (isSame) return
            this.listeners[option.varname || GetElementName(option)].forEach(callback => {
                callback(option, option.old || oldValue, option.value)
            })
        }
    }
    addDependency(optionOrVarname, dependsOnVarname, dependsOnValue) {
        if (!optionOrVarname) {
            throw new Error("No option or varname provided to addDependency")
        }
        if (!dependsOnVarname) {
            throw new Error("No dependsOn varname provided to addDependency")
        }
        if (dependsOnValue === undefined) {
            throw new Error("No dependsOnValue provided to addDependency")
        }
        if (typeof optionOrVarname === "string") {
            optionOrVarname = this.data.allOptions[optionOrVarname]
        }
        const option = optionOrVarname

        if (!option) {
            throw new Error(`option \`${optionOrVarname}\` does not exist in module \`${this.moduleName}\``)
        }
        if (!this.data.allOptions[dependsOnVarname]) {
            throw new Error(`dependsOn \`${dependsOnVarname}\` does not exist in module \`${this.moduleName}\``)
        }

        option.requires = option.requires || []
        option.requires.push({ [dependsOnVarname]: dependsOnValue })
        return this
    }
    setCategoryDescription(categoryName, description) {
        if (!categoryName) {
            throw new Error("No category name provided to setCategoryDescription")
        }
        description = description || ""
        let found = false
        for (let group of Object.values(this.data.groups)) {
            for (let category of Object.keys(group)) {
                if (categoryName == category) {
                    group[category].description = description
                    found = true
                }
            }
        }
        if (!found) {
            throw new Error(`Category \`${categoryName}\` does not exist in module \`${this.moduleName}\``)
        }
        return this
    }
    setSubcategoryDescription(subcategoryName, description) {
        if (!subcategoryName) {
            throw new Error("No subcategory name provided to setSubcategoryDescription")
        }
        description = description || ""
        let found = false
        for (let group of Object.values(this.data.groups)) {
            for (let category of Object.values(group)) {
                for (let subcategoryKey of Object.keys(category["subcategories"])) {
                    if (subcategoryName == subcategoryKey) {
                        category["subcategories"][subcategoryKey].description = description
                        found = true
                    }
                }
            }
        }
        if (!found) {
            throw new Error(`Subcategory \`${subcategoryName}\` does not exist in module \`${this.moduleName}\``)
        }
        return this
    }
    addGroupSorter(sortingFunction) {
        if (typeof sortingFunction != "function") {
            throw new Error("addGroupSorter parameter sortingFunction must be a function")
        }
        this.data.groupSorter = sortingFunction
        return this
    }
    addCategorySorter(sortingFunction) {
        if (typeof sortingFunction != "function") {
            throw new Error("addCategorySorter parameter sortingFunction must be a function")
        }
        this.data.categorySorter = sortingFunction
        return this
    }
    addSubcategorySorter(sortingFunction) {
        if (typeof sortingFunction != "function") {
            throw new Error("addSubcategorySorter parameter sortingFunction must be a function")
        }
        this.data.subcategorySorter = sortingFunction
        return this
    }
    addSettingSorter(sortingFunction) {
        if (typeof sortingFunction != "function") {
            throw new Error("addSettingSorter parameter sortingFunction must be a function")
        }
        this.data.settingSorter = sortingFunction
        return this
    }

    buildSearchIndex() {
        const index = []
        Object.entries(this.data.groups).forEach(([groupName, group]) => {
            Object.entries(group).forEach(([categoryName, category]) => {
                Object.entries(category["subcategories"]).forEach(([subCategoryName, subCategory]) => {
                    Object.entries(subCategory["elements"]).forEach(([elementVarName, element]) => {
                        const elementName = GetElementName(element)
                        const elementDescription = GetElementDescription(element)
                        index.push({
                            moduleName: this.moduleName,
                            key: elementVarName,
                            item: element,
                            searchText: (elementName + ' ' + elementDescription).toLowerCase(),
                        })
                    })
                })
            })
        })

        return index
    }

    GetFirstVisibleCategory() {
        let selectedCategory = null
        Object.values(this.data.groups).forEach(groupData => {
            if (selectedCategory) return

            selectedCategory = Object.entries(groupData).find(([categoryName, categoryData]) => {
                if (!categoryData.subcategories) return false
                return Object.values(categoryData.subcategories).some(subcategory =>
                    Object.values(subcategory.elements).some(element => {
                        return !this.IsElementHidden(element)
                    })
                )
            }) || null
        })
        return selectedCategory
    }

    constructor(localModuleName, moduleFolder, settingsFilePath = null, autosaveIntervalMinutes = 2.5) {
        if (localModuleName == Variables.globalConfigName && !Variables.globalConfig) {
            Variables.globalConfig = this
        }
        if (!settingsFilePath) {
            settingsFilePath = `${localModuleName}.json`
        }
        this.gui = new Gui()
        this.lastOpenedGUI = null
        this.orderCounter = 0
        this.data = {
            groups: {},
            allOptions: {},
            persistent: FileLib.read(moduleFolder, settingsFilePath) ? JSON.parse(FileLib.read(moduleFolder, settingsFilePath)) : {},
            save: () => {
                let persistentDataCopy = JSON.parse(JSON.stringify(this.data.persistent))
                const validOptions = ["type", "value", "extraPersistent"]
                Object.keys(persistentDataCopy).forEach(varname => {
                    Object.keys(persistentDataCopy[varname]).forEach(optionType => {
                        if (!validOptions.includes(optionType)) {
                            delete persistentDataCopy[varname][optionType]
                            return
                        }
                    })
                })
                FileLib.write(moduleFolder, settingsFilePath, JSON.stringify(persistentDataCopy, null, 4))
            },
        }
        this.moduleName = localModuleName
        this.listeners = {}
        this.autosave(autosaveIntervalMinutes)

        this.gui.registerOpened(() => {
            currentOpenedGUI = this.gui
            let selectedCategory = null
            for (const groupData of Object.values(this.data.groups)) {
                const groupHasVisibleElements = Object.values(groupData).some(categoryData => {
                    if (!categoryData.subcategories) return false
                    return Object.values(categoryData.subcategories).some(subcategory =>
                        Object.values(subcategory.elements).some(element =>
                            !this.IsElementHidden(element)
                        )
                    )
                })
                if (groupHasVisibleElements) {
                    selectedCategory = Object.entries(groupData)[0]
                    break
                }
            }
            if (!selectedCategory) {
                selectedCategory = this.GetFirstVisibleCategory()
            }
            this.selectedCategory = selectedCategory
            this.selectedSettings = null
        })
        this.gui.registerClosed(() => {
            this.data.save()
        })
        this.gui.registerScrolled((mx, my, dir) => {
            for (let section of scroll) {
                if (mx > section.x) {
                    section.time = Date.now()
                    section.buffer += dir * 48
                    break
                }
            }
        })

        const searchBar = new Utils.TextInput("Search...", true)
        let lastSearchQuery = ""
        const cachedSearchResults = {}
        let searchIndex = 0

        searchBar.onGuiKey((query) => {
            if (query === lastSearchQuery) return
            lastSearchQuery = query

            if (!query || query.trim() === '') {
                this.selectedCategory = this.GetFirstVisibleCategory()
                return
            }

            if (cachedSearchResults[query]) {
                this.selectedCategory = cachedSearchResults[query]
                return
            }

            if (!searchIndex || searchIndex === 0) {
                searchIndex = this.buildSearchIndex()
            }

            const lowerQuery = query.toLowerCase()
            const results = {}

            for (let i = 0; i < searchIndex.length; i++) {
                const entry = searchIndex[i]
                if (entry.searchText.includes(lowerQuery)) {
                    if (!results[entry.moduleName]) {
                        results[entry.moduleName] = {}
                    }
                    results[entry.moduleName][entry.key] = entry.item
                }
            }

            const allResults = {
                description: "",
                subcategories: {
                    default: {
                        description: "",
                        elements: {}
                    }
                }
            }
            for (let moduleName in results) {
                for (let key in results[moduleName]) {
                    allResults.subcategories.default.elements[moduleName + ":" + key] = results[moduleName][key]
                }
            }

            const moduleNames = Object.keys(results).join("§f, §7")
            const categoryData = [
                "§7Results for §f" + query + (Object.keys(results).length > 0 ? " §7from §f" + moduleNames : ""),
                allResults
            ]

            cachedSearchResults[query] = categoryData
            this.selectedCategory = categoryData
        })

        this.gui.registerDraw((drawContext, mx, my, ticks) => {
            [drawContext, mx, my, ticks] = Utils.FixGUIRenderValues(drawContext, mx, my, ticks)

            let tooltip
            for (let section of scroll) {
                section.scroll += (section.buffer - section.scroll) * ((Date.now() - section.time) / 48)
                section.buffer = Math.max(section.max * -1, Math.min(0, section.buffer))
                section.scroll = Math.max(section.max * -1, Math.min(0, section.scroll))
                section.time = Date.now()

                if (!Utils.isMouseButtonDown(0)) {
                    section.clicked = false
                }
            }

            if (!Utils.isMouseButtonDown(0)) {
                Variables.shouldClick = true
            }

            let colors = {
                primary: Variables.globalConfig.primaryColor ?? [90, 102, 255, 255],
                secondary: Variables.globalConfig.secondaryColor ?? [13, 13, 13, 255],
                tertiary: Variables.globalConfig.tertiaryColor ?? [30, 30, 30, 255],
                darker: Variables.globalConfig.darkerColor ?? [20, 20, 20, 255],
                dark: Variables.globalConfig.darkColor ?? [51, 51, 51, 255],
                light: Variables.globalConfig.lightColor ?? [102, 102, 102, 255],
                bright: Variables.globalConfig.brightColor ?? [127, 127, 127, 255],
                transparent: Variables.globalConfig.transparentColor ?? [102, 102, 102, 100],
                text: Variables.globalConfig.textColor ?? [255, 255, 255, 255],
                secondaryText: Variables.globalConfig.secondaryTextColor ?? [170, 170, 170, 255],
            }
            Variables.globalColors = colors

            const screenSize = ZRenderLib.getScreenSize()
            let width = Variables.globalConfig.globalFullscreen ? screenSize.width : screenSize.width / 1.5
            let height = Variables.globalConfig.globalFullscreen ? screenSize.height : screenSize.height / 1.5

            let titleHeight = 24
            let iconWidth = 0

            if (Variables.globalConfig.globalFullscreen) {
                titleHeight += 1
                iconWidth += 1
                height -= titleHeight + 1
                width -= 2
            } else {
                titleHeight = height / 2 - height / 4
                iconWidth = width / 2 - width / 4
            }

            const categoryPadding = 6
            const categoryWidth = Math.max(
                128,
                Utils.getLongest(Object.keys(this.data.groups)).width,
                ...Object.values(this.data.groups).map(
                    group => Utils.getLongest(Object.keys(group)).width + categoryPadding * 5
                )
            )

            scroll[2].x = 0
            scroll[1].x = iconWidth
            scroll[0].x = iconWidth + categoryWidth

            const moduleTitleHeight = 24
            const titleBarX = iconWidth
            const titleBarY = titleHeight - moduleTitleHeight
            const titleText = this.moduleName.trim()
            const moduleTitleWidth = ZRenderLib.getStringWidth(titleText)

            if (Variables.globalConfig.globalFullscreen) {
                // Outline
                ZRenderLib.drawRectRGBA(drawContext, iconWidth - insetSpacing, titleBarY - insetSpacing, width + doubleInsetSpacing, height + moduleTitleHeight + doubleInsetSpacing, ...colors.primary)

                // Sidebar background
                ZRenderLib.drawRectRGBA(drawContext, iconWidth, titleBarY + moduleTitleHeight, categoryWidth - 1, height, ...colors.secondary)

                // Main content background
                ZRenderLib.drawRectRGBA(drawContext, iconWidth + categoryWidth, titleBarY + moduleTitleHeight, width - categoryWidth, height, ...colors.darker)

                // Draw title bar
                ZRenderLib.drawRectRGBA(drawContext, titleBarX, titleBarY, width, moduleTitleHeight - 1, ...colors.secondary)
            } else {
                // Darken Background
                if (Variables.globalConfig.globalDarkenBackground) {
                    ZRenderLib.drawRectRGBA(drawContext, 0, 0, screenSize.width, screenSize.height, 0, 0, 0, 150)
                }

                // Outline
                ZRenderLib.drawRoundedRectRGBA(drawContext, iconWidth - insetSpacing, titleBarY - insetSpacing, width + doubleInsetSpacing, height + moduleTitleHeight + doubleInsetSpacing, 8, ...colors.primary)

                // Sidebar background
                ZRenderLib.drawRoundedRectRGBA(drawContext, iconWidth, titleBarY + moduleTitleHeight, categoryWidth - 1, height, 7, ...colors.secondary, [ZRenderLib.FlattenRoundedRectCorner.TOP_LEFT, ZRenderLib.FlattenRoundedRectCorner.TOP_RIGHT, ZRenderLib.FlattenRoundedRectCorner.BOTTOM_RIGHT])

                // Main content background
                ZRenderLib.drawRoundedRectRGBA(drawContext, iconWidth + categoryWidth, titleBarY + moduleTitleHeight, width - categoryWidth, height, 7, ...colors.darker, [ZRenderLib.FlattenRoundedRectCorner.TOP_LEFT, ZRenderLib.FlattenRoundedRectCorner.TOP_RIGHT, ZRenderLib.FlattenRoundedRectCorner.BOTTOM_LEFT])

                // Draw title bar
                ZRenderLib.drawRoundedRectRGBA(drawContext, titleBarX, titleBarY, width, moduleTitleHeight - 1, 7, ...colors.secondary, [ZRenderLib.FlattenRoundedRectCorner.BOTTOM_LEFT, ZRenderLib.FlattenRoundedRectCorner.BOTTOM_RIGHT])
            }

            // Draw search bar
            const searchBarHeight = 16
            const searchBarWidth = 110
            const searchBarPaddingX = 4
            const searchBarX = titleBarX + width - searchBarWidth - searchBarPaddingX - insetSpacing
            const searchBarY = titleBarY + ((moduleTitleHeight - searchBarHeight) / 2) - 0.5

            // Draw back button if in global settings
            let backButtonDisplacement = 0
            if (this.moduleName == Variables.globalConfigName && this.lastOpenedGUI != null) {
                if (ZKeys.isEscapeDown()) {
                    this.lastOpenedGUI?.open()
                }

                const backButtonPadding = 6
                const backButtonSize = 12
                const backButtonX = titleBarX + backButtonPadding
                const backButtonY = titleBarY + backButtonPadding
                backButtonDisplacement = backButtonPadding + backButtonSize

                let backButtonColor = colors.primary
                if (Utils.isMouseover(mx, my, backButtonX - insetSpacing, backButtonY - insetSpacing, backButtonSize + doubleInsetSpacing, backButtonSize + doubleInsetSpacing)) {
                    backButtonColor = colors.bright
                    if (Utils.isMouseButtonClicked(0)) {
                        this.lastOpenedGUI?.open()
                    }
                }

                // Draw back button
                ZRenderLib.drawRoundedRectRGBA(drawContext, backButtonX - insetSpacing, backButtonY - insetSpacing, backButtonSize + doubleInsetSpacing, backButtonSize + doubleInsetSpacing, 4, ...colors.tertiary)
                ZRenderLib.drawRoundedRectRGBA(drawContext, backButtonX, backButtonY, backButtonSize, backButtonSize, 3, ...backButtonColor)
                ZRenderLib.drawImageRGBA(drawContext, Variables.backIcon, backButtonX + 2, backButtonY + 2, 8, 8, ...colors.text)
            }

            // Draw menu title
            ZRenderLib.drawGUIStringRGBA(drawContext, titleText, ((titleBarX + insetSpacing + searchBarX + backButtonDisplacement) / 2) - moduleTitleWidth / 2, titleBarY + (moduleTitleHeight - 8) / 2, ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

            let searchbarColor = colors.darker
            let searchbarMouseOver = Utils.isMouseover(mx, my, searchBarX, searchBarY, searchBarWidth, searchBarHeight)
            if (Utils.isMouseButtonClicked(0, true)) {
                searchBar.isActive = searchbarMouseOver
            }
            if (searchbarMouseOver) {
                searchbarColor = colors.dark
            }

            ZRenderLib.drawRoundedRectRGBA(drawContext, searchBarX - insetSpacing, searchBarY - insetSpacing, searchBarWidth + doubleInsetSpacing, searchBarHeight + doubleInsetSpacing, 3, ...colors.tertiary)
            ZRenderLib.drawRoundedRectRGBA(drawContext, searchBarX, searchBarY, searchBarWidth, searchBarHeight, 2, ...searchbarColor)

            searchBar.draw(drawContext, searchBarX + 4, searchBarY + 2, width - 8, searchBarHeight / 2, 0)
            ZRenderLib.drawImageRGBA(drawContext, searchIcon, searchBarX + searchBarWidth - 12, searchBarY + (searchBarHeight - 8) / 2, 8, 8, ...colors.text)

            // Draw Global Settings Button
            let sidebarButtonCount = 0
            const sidebarButtonPaddingX = 6
            const sidebarButtonPaddingY = 5
            const sidebarButtonHeight = 12
            const sidebarButtonWidth = categoryWidth - sidebarButtonPaddingX * 2
            const sidebarButtonX = iconWidth + sidebarButtonPaddingX - insetSpacing
            let lastSidebarButtonY = height + titleHeight

            const showGlobalSettingsButton = !Variables.globalConfig.gui.isOpen()
            if (showGlobalSettingsButton) {
                sidebarButtonCount++
                lastSidebarButtonY -= sidebarButtonHeight + sidebarButtonPaddingY
                const globalSettingsButtonText = "Global Settings"
                const globalSettingsButtonTextWidth = ZRenderLib.getStringWidth(globalSettingsButtonText)

                let globalSettingsButtonColor = colors.primary
                let globalSettingsButtonTextColor = colors.text
                if (Utils.isMouseover(mx, my, sidebarButtonX - doubleInsetSpacing, lastSidebarButtonY - insetSpacing, sidebarButtonWidth - sidebarButtonPaddingX + doubleInsetSpacing + 1, sidebarButtonHeight + doubleInsetSpacing)) {
                    globalSettingsButtonColor = colors.light
                    globalSettingsButtonTextColor = ZRenderLib.getRGBAColorList255(ZRenderLib.YELLOW)
                    if (Utils.isMouseButtonClicked(0)) {
                        Variables.globalConfig.lastOpenedGUI = this.gui
                        Variables.globalConfig.gui?.open()
                    }
                }

                ZRenderLib.drawRoundedRectRGBA(drawContext, sidebarButtonX - insetSpacing, lastSidebarButtonY - insetSpacing, sidebarButtonWidth + doubleInsetSpacing + 1, sidebarButtonHeight + doubleInsetSpacing, 4, ...colors.tertiary)
                ZRenderLib.drawRoundedRectRGBA(drawContext, sidebarButtonX, lastSidebarButtonY, sidebarButtonWidth + 1, sidebarButtonHeight, 3, ...globalSettingsButtonColor)
                ZRenderLib.drawGUIStringRGBA(drawContext, globalSettingsButtonText, sidebarButtonX + (sidebarButtonWidth + 1) / 2 - globalSettingsButtonTextWidth / 2, lastSidebarButtonY + 2, ...globalSettingsButtonTextColor, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }

            let showEditHudButton = false
            Object.entries(this.data.groups).forEach(([groupName, groupData]) => {
                if (groupName == "default") return
                Object.values(groupData).some(categoryData => {
                    if (!categoryData.subcategories) return false
                    return Object.values(categoryData.subcategories).some(subcategory =>
                        Object.values(subcategory.elements).some(element => {
                            if (!this.IsElementHidden(element)) {
                                if (element.hudData) {
                                    showEditHudButton = true
                                }
                            }
                        })
                    )
                })
            })

            // Draw Edit HUD button
            const editHudText = "Edit HUD"
            const editHudTextWidth = ZRenderLib.getStringWidth(editHudText)

            if (showEditHudButton) {
                sidebarButtonCount++
                lastSidebarButtonY -= sidebarButtonHeight + sidebarButtonPaddingY
                let editHudButtonColor = colors.primary
                let editHudButtonTextColor = colors.text

                if (Utils.isMouseover(mx, my, sidebarButtonX - doubleInsetSpacing, lastSidebarButtonY - insetSpacing, sidebarButtonWidth + doubleInsetSpacing + 1, sidebarButtonHeight + doubleInsetSpacing)) {
                    editHudButtonColor = colors.light
                    editHudButtonTextColor = ZRenderLib.getRGBAColorList255(ZRenderLib.YELLOW)
                    if (Utils.isMouseButtonClicked(0)) {
                        Hud.openHudGui(currentOpenedGUI)
                        return
                    }
                }

                // Draw button
                ZRenderLib.drawRoundedRectRGBA(drawContext, sidebarButtonX - insetSpacing, lastSidebarButtonY - insetSpacing, sidebarButtonWidth + doubleInsetSpacing + 1, sidebarButtonHeight + doubleInsetSpacing, 4, ...colors.tertiary)
                ZRenderLib.drawRoundedRectRGBA(drawContext, sidebarButtonX, lastSidebarButtonY, sidebarButtonWidth + 1, sidebarButtonHeight, 3, ...editHudButtonColor)
                ZRenderLib.drawGUIStringRGBA(drawContext, editHudText, sidebarButtonX + (sidebarButtonWidth + 1) / 2 - editHudTextWidth / 2, lastSidebarButtonY + 2, ...editHudButtonTextColor, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }

            // Draw button divider
            const dividerWidth = 0.95
            ZRenderLib.drawRectRGBA(drawContext, sidebarButtonX + sidebarButtonWidth * (1 - dividerWidth) / 2, lastSidebarButtonY - sidebarButtonPaddingY, sidebarButtonWidth * dividerWidth, 1, ...colors.bright)

            let scissorYOffset = 0
            if (gameVersion >= 12109) { // Not sure what version it starts
                scissorYOffset = 21
            }
            const sidebarScissorX = iconWidth
            const sidebarScissorY = titleHeight
            const sidebarScissorWidth = categoryWidth
            const sidebarScissorHeight = (lastSidebarButtonY - sidebarButtonPaddingY) - sidebarScissorY
            if (Variables.globalConfig.globalOptionScissor) {
                ZRenderLib.enableScaledScissor(drawContext, sidebarScissorX, sidebarScissorY + scissorYOffset, sidebarScissorWidth, sidebarScissorHeight)
            }

            i = 0
            // Draw sidebar groups
            const totalGroupCount = Object.keys(this.data.groups).length
            let currentGroupCount = 0
            Object.entries(this.data.groups).sort((a, b) => {
                if (this.data.groupSorter) {
                    return this.data.groupSorter(a, b)
                }
                return 0
            }).forEach(([groupName, groupData]) => {
                if (groupName == "default") return
                const groupHasVisibleElements = Object.values(groupData).some(categoryData => {
                    if (!categoryData.subcategories) return false
                    return Object.values(categoryData.subcategories).some(subcategory =>
                        Object.values(subcategory.elements).some(element => {
                            allHidden = false
                            return !this.IsElementHidden(element)
                        })
                    )
                })
                if (!groupHasVisibleElements) return

                currentGroupCount++
                let rX = iconWidth + categoryPadding
                let rY = titleHeight + categoryPadding + i * 16 + scroll[1].scroll
                ZRenderLib.drawGUIStringRGBA(drawContext, `${groupName.trim()} »`, rX + 4, rY, ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                i++

                // Draw sidebar categories
                Object.entries(groupData).sort((a, b) => {
                    if (this.data.categorySorter) {
                        return this.data.categorySorter(a, b)
                    }
                    return 0
                }).forEach(([categoryName, categoryData]) => {
                    if (categoryName == "default" || allHidden) return

                    let rrX = rX + categoryPadding
                    let rrY = titleHeight + categoryPadding + i * 16 + scroll[1].scroll
                    let isSelected = this.selectedCategory[0] == categoryName
                    let mouseOver = Utils.isMouseover(mx, my, rrX, rrY, categoryWidth - categoryPadding * 3, 14)
                    let hoverColor = null
                    if (mouseOver) {
                        if (Utils.isMouseButtonClicked(0)) {
                            this.selectedCategory = [categoryName, categoryData]
                            this.selectedOption = null
                            this.selectedSettings = null
                            scroll[0].buffer = 0
                        }
                        hoverColor = colors.tertiary
                    }
                    if (isSelected) hoverColor = colors.dark
                    if (hoverColor) {
                        ZRenderLib.drawRoundedRectRGBA(drawContext, rX, rrY - 2, categoryWidth - categoryPadding * 3, 14, 4, ...hoverColor)
                    }
                    let textColor = isSelected ? colors.text : colors.secondaryText
                    ZRenderLib.drawGUIStringRGBA(drawContext, `» ${categoryName.trim()}`, rrX, rrY + 1, ...textColor, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                    i++
                })

                // Draw group divider line
                if (currentGroupCount < totalGroupCount) {
                    ZRenderLib.drawRectRGBA(drawContext, rX + 2, titleHeight + categoryPadding + i * 16 + scroll[1].scroll + 1, categoryWidth - categoryPadding * 3 - 4, 1, ...colors.bright)
                    ZRenderLib.drawRectRGBA(drawContext, rX + 3, titleHeight + categoryPadding + i * 16 + scroll[1].scroll + 2, categoryWidth - categoryPadding * 3 - 4, 1, ...colors.darker)
                }
                i += 0.5
            })
            scroll[1].max = Math.max(0, (titleHeight + categoryPadding + (i - 1.5) * 16) - height)
            scroll[1].width = categoryWidth

            if (Variables.globalConfig.globalOptionScissor) {
                // Test Scissor
                // ZRenderLib.drawRectRGBA(drawContext, 0, 0, 1920, 1080, 255, 0, 0, 255)

                ZRenderLib.disableScissor(drawContext)
            }

            const scrollBarWidth = 8
            const paddingX = 8
            const paddingY = 12
            let boxWidth = width - (categoryWidth + 16) - scrollBarWidth
            i = 0

            let rX = iconWidth + categoryWidth + paddingX
            let rY = titleHeight + paddingY
            if (this.selectedSettings) {
                rX = width / 2 - settingsWidth / 2 + paddingX
            }

            const guiX = iconWidth + categoryWidth
            const guiY = titleHeight
            const guiWidth = width - categoryWidth
            const guiHeight = height
            const scissorX = guiX
            const scissorY = guiY
            const scissorWidth = guiWidth
            const scissorHeight = guiHeight
            if (Variables.globalConfig.globalOptionScissor) {
                ZRenderLib.enableScaledScissor(drawContext, scissorX, scissorY, scissorWidth, scissorHeight)
            }

            function isRectInViewport(x, y, width, height) {
                const x1 = x
                const y1 = y
                const x2 = x + width
                const y2 = y + height

                return (
                    x2 > scissorX &&
                    x1 < (scissorX + scissorWidth) &&
                    y2 > scissorY &&
                    y1 < (scissorY + scissorHeight)
                )
            }

            // Draw category title
            ZRenderLib.drawRoundedRectRGBA(drawContext, iconWidth + categoryWidth + paddingX + insetSpacing, titleHeight + paddingY + scroll[0].scroll - insetSpacing, boxWidth - insetSpacing, 13 + doubleInsetSpacing, 4, ...colors.primary)
            ZRenderLib.drawRoundedRectRGBA(drawContext, iconWidth + categoryWidth + paddingX + doubleInsetSpacing, titleHeight + paddingY + scroll[0].scroll, boxWidth - doubleInsetSpacing - insetSpacing, 13, 3, ...colors.dark)
            ZRenderLib.drawGUIStringRGBA(drawContext, this.selectedCategory[0].trim(),
                iconWidth + categoryWidth + paddingX + boxWidth / 2 - (ZRenderLib.getStringWidth(this.selectedCategory[0]) / 2),
                titleHeight + paddingY + scroll[0].scroll + 3,
                ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1
            )
            i += 0.1

            // Draw category description
            if (this.selectedCategory[1].description) {
                let descriptionLines = Utils.splitIntoLines(this.selectedCategory[1].description, boxWidth - 4)
                for (let line of descriptionLines) {
                    line = line.trim()
                    const y = titleHeight + paddingY + 14 + 4 + i * 12 + scroll[0].scroll
                    const x = (iconWidth + categoryWidth) + paddingX + (boxWidth - ZRenderLib.getStringWidth(line)) / 2
                    // const x = iconWidth + categoryWidth + paddingX + 2
                    ZRenderLib.drawGUIStringRGBA(drawContext, line, x, y, ...colors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                    i++
                }
                i += 0.15
            }
            i += 1.6

            const settingsWidth = Math.min(width / 5 * 4, 600)
            if (this.selectedSettings) {
                boxWidth = settingsWidth - paddingX * 2
                const progress = Utils.lerp(0, 1, this.optionSettingsOpenTime, 300)
                ZRenderLib.drawRectRGBA(drawContext, 0, 0, width, height, 0, 0, 0, 200 * progress)
                let settingsColor = colors.darker.slice()
                settingsColor[3] = (settingsColor[3] || 255) * Math.min(1, progress * 2)
                ZRenderLib.drawRoundedRectRGBA(drawContext, width / 2 - settingsWidth / 2 + settingsWidth * (1 - progress) / 2, titleHeight * 2, settingsWidth * progress, (height - titleHeight * 4) * progress, 6, ...settingsColor)
            }

            // Draw main content subcategories
            Object.entries(this.selectedCategory[1]["subcategories"]).sort((a, b) => {
                if (this.data.subcategorySorter) {
                    return this.data.subcategorySorter(a, b)
                }
                return 0
            }).forEach(([subcategoryName, subCategoryData]) => {
                subcategoryName = subcategoryName.trim()
                rY = titleHeight + paddingY + i * 12 + scroll[0].scroll

                // if all settings in subcategory are hidden, skip
                let allHidden = true
                Object.values(subCategoryData.elements).forEach((option) => {
                    if (this.IsElementHidden(option)) return
                    allHidden = false
                })
                if (allHidden) return

                // Draw subcategory title
                if (subcategoryName !== "default" && !this.selectedSettings) {
                    const stringWidth = ZRenderLib.getStringWidth(subcategoryName)
                    let rrX = rX + boxWidth / 2 - stringWidth / 2
                    ZRenderLib.drawRectRGBA(drawContext, rX, rY + 2, boxWidth, 1, ...colors.bright)
                    ZRenderLib.drawRectRGBA(drawContext, rrX - 2, rY + 2, stringWidth + 4, 1, ...colors.darker)
                    ZRenderLib.drawGUIStringRGBA(drawContext, "§o" + subcategoryName, Math.max(rX, rrX), rY - 1, ...colors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                    i += 0.85
                }

                // Draw subcategory description
                if (subcategoryName !== "default" && subCategoryData.description && !this.selectedSettings) {
                    let descriptionLines = Utils.splitIntoLines(subCategoryData.description, boxWidth - 4)
                    for (let line of descriptionLines) {
                        line = line.trim()
                        const y = titleHeight + paddingY + i * 12 + scroll[0].scroll
                        // const x = rx + 2
                        const x = rX + boxWidth / 2 - ZRenderLib.getStringWidth(line) / 2
                        ZRenderLib.drawGUIStringRGBA(drawContext, line, x, y, ...colors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                        i++
                    }
                } else {
                    i += 0.1
                }
                i += 0.5

                // Draw settings
                Object.values(subCategoryData.elements).sort((a, b) => {
                    if (this.data.settingSorter) {
                        return this.data.settingSorter(a, b)
                    }
                    return a.orderIndex - b.orderIndex
                }).forEach((option) => {
                    if (this.selectedSettings) return
                    if (this.IsElementHidden(option)) return

                    // Update setting height
                    const y = titleHeight + paddingY + i * 12 + scroll[0].scroll
                    let lines = Utils.splitIntoLines(GetElementDescription(option), boxWidth - 4 - 16)
                    let k = 0 // offsets other options
                    let lineOffset = 0 // makes the current option box larger
                    if (option.type == "color") {
                        for (let i = 0; i < 13; i++) {
                            lines.push("")
                        }
                    } else if (option.type == "mccolor") {
                        lines.push("")
                        lineOffset += 5
                        k += 0.35
                    } else if (option.type == "list") {
                        let listSize = 0
                        if (option.extra.editable) {
                            listSize = 1
                            lineOffset += 6
                            k += 0.55
                        }
                        for (let i = 0; i < option.options.length + listSize; i++) {
                            lines.push("")
                        }
                    } else if (option.type == "unorderedList") {
                        let combinedList = new Set([...option.options, ...option.value])
                        let listSize = -1
                        if (option.extra.editable) {
                            listSize = 0
                            lineOffset += 6
                            k += 0.55
                        }
                        for (let i = 0; i < Math.max(option.extra.minimumHeight, combinedList.size) + listSize; i++) {
                            lines.push("")
                        }
                    } else if (option.type == "dropdown" || option.type == "checkbox") {
                        if (option.down) {
                            lineOffset += 16 * option.options.length
                            k += (1.325 * option.options.length)// + 1.35
                        }
                    } else if (option.type == "button" || option.type == "hud") {
                        lineOffset += 4
                        k += 0.35
                    } else if (option.type == "keybind") {
                        if (option.extra.showActivateInMenusToggle) {
                            lineOffset += 16
                            k += 1.35
                        }
                    }

                    let inViewport = isRectInViewport(rX, y, boxWidth, 35 + 12 * lines.length + lineOffset)
                    // Draw setting outline
                    if (Variables.globalConfig.outlineOptions && option.type != "markdown" && inViewport) {
                        Utils.drawRoundOutline(drawContext, rX, y, boxWidth, 35 + 12 * lines.length + lineOffset, colors.primary, colors.darker, 3)

                        // Draw option name cutout
                        const settingNameWidth = ZRenderLib.getStringWidth(GetElementName(option))
                        ZRenderLib.drawRectRGBA(drawContext, rX + 6, y - 3, settingNameWidth + 4, 10, ...colors.darker)
                    }

                    let mouseOver
                    if (inViewport) {
                        mouseOver = Utils.isMouseover(mx, my, rX, y, boxWidth, 35 + 12 * lines.length + lineOffset)
                        if (option.type != "markdown") {
                            // Draw Hover outline
                            if (mouseOver) {
                                if (Variables.globalConfig.outlineOptions) {
                                    ZRenderLib.drawRoundedRectRGBA(drawContext, rX, y, boxWidth, 35 + 12 * lines.length + lineOffset, 3, ...colors.transparent)
                                } else {
                                    ZRenderLib.drawRectRGBA(drawContext, rX, y, boxWidth, 35 + 12 * lines.length + lineOffset, ...colors.transparent)
                                }
                            }

                            // Draw setting name
                            ZRenderLib.drawGUIStringRGBA(drawContext, GetElementName(option).trim(), rX + 8, y - 3, ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                            i += 0.5

                            // Draw setting description
                            for (let line of lines) {
                                if (line) {
                                    ZRenderLib.drawGUIStringRGBA(drawContext, line.trim(), rX + 8, titleHeight + paddingY + i * 12 + scroll[0].scroll + 4, ...colors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                                }
                                i++
                            }
                        }
                    } else if (option.type != "markdown") {
                        i += 0.5 + lines.length
                    }
                    i += 2
                    i += k

                    // Draw reset button
                    if (option.canReset && inViewport) {
                        let resetColor = null
                        const resetBoxWidth = 48
                        const resetBoxHeight = 20
                        const resetBoxX = rX + boxWidth - resetBoxWidth - 1 - 4
                        const resetBoxY = y + 35 + 12 * lines.length + lineOffset - resetBoxHeight - 0.5 - 4

                        if (Utils.isMouseover(mx, my, resetBoxX, resetBoxY, resetBoxWidth, resetBoxHeight)) {
                            mouseOver = false
                            resetColor = colors.light
                            const tooltipText = "Reset"
                            const textWidth = ZRenderLib.getStringWidth(tooltipText)
                            tooltip = {
                                line: tooltipText,
                                x: resetBoxX + textWidth / 8,
                                y: resetBoxY - 8
                            }

                            if (Utils.isMouseButtonClicked(0)) {
                                option.old = JSON.parse(JSON.stringify(option.value))
                                if (option.type == "hud") {
                                    option.value.x = option.placeholder.baseX
                                    option.value.y = option.placeholder.baseY
                                    option.value.width = option.placeholder.baseWidth
                                    option.value.height = option.placeholder.baseHeight
                                    option.value.scaleX = option.placeholder.scaleX
                                    option.value.scaleY = option.placeholder.scaleY
                                } else if (option.type == "list") {
                                    for (let key in option.value) {
                                        if (!(key in option.placeholder)) {
                                            delete option.value[key]
                                            const optIndex = option.options.findIndex(opt => opt[1] === key)
                                            if (optIndex !== -1) option.options.splice(optIndex, 1)
                                        }
                                    }
                                    for (let key in option.placeholder) {
                                        option.value[key] = option.placeholder[key]
                                    }
                                } else {
                                    option.value = JSON.parse(JSON.stringify(option.placeholder))
                                    if (option.type == "color") {
                                        Utils.ResetColorPickerFromRGB(option, option.placeholder)
                                    } else if (option.type == "slider") {
                                        Utils.UpdateInputFieldText(option, option.value)
                                    } else if (option.type == "text") {
                                        Utils.UpdateInputFieldText(option, option.value)
                                    } else if (option.type == "keybind") {
                                        Variables.inputs[option.varname].reset(option.placeholder)
                                        option.extraPersistent = JSON.parse(JSON.stringify(option.extra.persistentPlaceholder))
                                    }
                                }
                                option.changed = true
                            }
                        } else {
                            resetColor = colors.dark
                        }

                        ZRenderLib.drawRoundedRectRGBA(drawContext, resetBoxX - insetSpacing, resetBoxY - insetSpacing, resetBoxWidth + doubleInsetSpacing, resetBoxHeight + doubleInsetSpacing, 4, ...colors.primary)
                        ZRenderLib.drawRoundedRectRGBA(drawContext, resetBoxX, resetBoxY, resetBoxWidth, resetBoxHeight, 3, ...resetColor)

                        const resetText = ZRenderLib.getStringWidth("Reset")
                        ZRenderLib.drawGUIStringRGBA(drawContext, "Reset", resetBoxX + (resetBoxWidth - resetText) / 2, resetBoxY + (resetBoxHeight - 8) / 2, ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
                    }

                    let rrY = titleHeight + paddingY + i * 12 + scroll[0].scroll
                    if (option.canReset && !option.changed && inViewport) {
                        ;(function() {
                            if (option.type == "slider" || option.type == "color" || option.type == "list") return
                            option.old = JSON.parse(JSON.stringify(option.value))
                        }())
                    }

                    // Draw option element
                    switch (option.type) {
                        case "button":
                            if (inViewport) {
                                Elements.drawButton(drawContext, mx, my, rX - 1, rrY - 4, boxWidth, option, mouseOver)
                            }
                            break
                        case "color":
                            if (inViewport) {
                                Elements.drawColor(drawContext, mx, my, rX + 7, rrY - 36, option, this, mouseOver)
                            }
                            break
                        case "mccolor":
                            if (inViewport) {
                                Elements.drawMcColor(drawContext, mx, my, rX + 6, rrY - 31, option, mouseOver)
                            }
                            break
                        case "list":
                            if (inViewport) {
                                let listSizeOffset = 0
                                if (option.extra.editable) {
                                    listSizeOffset = 2
                                }
                                Elements.drawList(drawContext, mx, my, rX + 6, rrY - 7 - (option.options.length + listSizeOffset) * 12, option, mouseOver)
                            }
                            break
                        case "unorderedList":
                            if (inViewport) {
                                let combinedList = new Set([...option.options, ...option.value])
                                let listSizeOffset = -1
                                if (option.extra.editable) {
                                    listSizeOffset = 1
                                }
                                Elements.drawUnorderedList(drawContext, mx, my, rX + 6, rrY - 7 - (Math.max(option.extra.minimumHeight, combinedList.size) + listSizeOffset) * 12, boxWidth - 8, option, mouseOver)
                            }
                            break
                        case "dropdown":
                            rrY -= k * 12
                            if (inViewport) {
                                Elements.drawDropdown(drawContext, mx, my, rX + 6, rrY - 17, option, mouseOver)
                                if (option.hovered) {
                                    mouseOver = false
                                }
                            }
                            break
                        case "text":
                            if (inViewport) {
                                Elements.drawText(drawContext, mx, my, rX + 6, rrY - 15, boxWidth - 8, option, this, mouseOver)
                            }
                            break
                        case "percentSlider":
                            if (inViewport) {
                                Elements.drawPercentSlider(drawContext, mx, my, rX + 11, rrY - 14, option, this, mouseOver, 100, (tt) => {
                                    tooltip = tt
                                })
                            }
                            break
                        case "slider":
                            if (inViewport) {
                                Elements.drawSlider(drawContext, mx, my, rX + 11, rrY - 14, option, this, mouseOver, 100, (tt) => {
                                    tooltip = tt
                                })
                            }
                            break
                        case "switch":
                            if (inViewport) {
                                Elements.drawSwitch(drawContext, mx, my, rX + 8, rrY - 13, option, mouseOver, () => {
                                    this.selectedSettings = option
                                    this.optionSettingsOpenTime = Date.now()
                                })
                            }
                            break
                        case "checkbox":
                            rrY -= k * 12
                            if (inViewport) {
                                Elements.drawCheckbox(drawContext, mx, my, rX + 6, rrY - 17, option, mouseOver)
                                if (option.hovered) {
                                    mouseOver = false
                                }
                            }
                            break
                        case "keybind":
                            if (inViewport) {
                                let yOffset = 0
                                if (option.extra.showActivateInMenusToggle) {
                                    yOffset = 16
                                }
                                Elements.drawKeybind(drawContext, mx, my, rX + 6, rrY - 17 - yOffset, boxWidth - 8, option, this, mouseOver)
                            }
                            break
                        case "hud":
                            if (inViewport) {
                                Elements.drawHud(drawContext, mx, my, rX - 1, rrY - 4, boxWidth, option, mouseOver, currentOpenedGUI)
                            }
                            break
                        case "markdown":
                            const markdownData = Utils.drawMarkdown(mx, my, rX + 6, rrY - 33, boxWidth, option)
                            inViewport = isRectInViewport(rX, rrY - 26, boxWidth, 7 + markdownData.height)
                            if (inViewport) {
                                Utils.drawRoundOutline(drawContext, rX, rrY - 26, boxWidth, 7 + markdownData.height, colors.primary, colors.darker, 3)
                                markdownData.draw(drawContext)
                            }
                            i += markdownData.height / 12
                            i -= 2
                            break
                        default:
                            break
                    }

                    if (option.changed) {
                        this.callOnChanged(option)
                    }
                    option.changed = false
                    i += 1.5
                })
            })

            if (Variables.globalConfig.globalOptionScissor) {
                // Test Scissor
                // ZRenderLib.drawRectRGBA(drawContext, 0, 0, 1920, 1080, 255, 0, 0, 255)

                ZRenderLib.disableScissor(drawContext)
            }

            i++
            scroll[0].max = Math.max(0, (i * 12) - (height + doubleInsetSpacing))
            scroll[0].width = boxWidth + paddingX * 2

            if (this.selectedSettings && Utils.isMouseButtonDown(0) && Variables.shouldClick) {
                this.selectedSettings = null
            }

            // Draw scrollbar
            scroll.forEach((section, index) => {
                const visibleHeight = height - (categoryPadding * 4)
                const totalContentHeight = section.max + visibleHeight
                const scrollBarRatio = Math.min(visibleHeight / totalContentHeight, 1)
                if (scrollBarRatio < 1) {
                    const rX = section.x + section.width - scrollBarWidth + 4
                    const scrollBarHeight = scrollBarRatio * visibleHeight
                    const trackHeight = visibleHeight - scrollBarHeight
                    const scrollPercentage = Math.abs(section.scroll) / section.max
                    const rY = titleHeight + categoryPadding * 2 + (scrollPercentage * trackHeight)

                    // handle background
                    ZRenderLib.drawRoundedRectRGBA(
                        drawContext,
                        rX - insetSpacing,
                        rY - insetSpacing,
                        scrollBarWidth + doubleInsetSpacing,
                        scrollBarHeight + doubleInsetSpacing,
                        4,
                        ...colors.primary,
                    )

                    // handle
                    let handleColor = colors.tertiary
                    if (Utils.isMouseover(mx, my, rX, titleHeight, scrollBarWidth, height) || section.clicked) {
                        handleColor = colors.light
                        if (Utils.isMouseButtonClicked(0)) {
                            section.initialY = my
                            section.clicked = true
                        }
                    }
                    ZRenderLib.drawRoundedRectRGBA(drawContext, rX, rY, scrollBarWidth, scrollBarHeight, 3, ...handleColor)

                    if (section.clicked) {
                        const deltaY = my - section.initialY
                        const scrollDelta = (deltaY / trackHeight) * section.max
                        section.buffer -= scrollDelta
                        section.initialY = my
                    }
                }
            })

            // Draw current tooltip
            if (tooltip) {
                Utils.drawTooltip(drawContext, tooltip.line, tooltip.x, tooltip.y, colors.tertiary, 255)
                tooltipFade = tooltip
                tooltipFade.time = Date.now()
            } else if (tooltipFade && Date.now() - tooltipFade.time < 150) {
                Utils.drawTooltip(drawContext, tooltipFade.line, tooltipFade.x, tooltipFade.y, colors.tertiary, 255 - (Date.now() - tooltipFade.time) / 150)
            }
        })
    }
    command(name, aliases = []) {
        this.command = name
        register("command", () => {
            this.gui.open()
        }).setName(name).setAliases(aliases)
        return this
    }
    registerListener = (name, callback) => {
        if (!this.listeners[name]) {
            this.listeners[name] = []
        }
        this.listeners[name].push(callback)
        return this
    }
    addParagraph = (data) => {
        this.addMarkdown(data)
        return this
    }
    addTextParagraph = (data) => {
        this.addMarkdown(data)
        return this
    }
    addMarkdown = (data) => {
        if (!data.value) {
            throw new Error("Markdown cannot be empty")
        }
        data.type = "markdown"
        data.canReset = false
        if (!data.extra) {
            data.extra = {}
        }
        data.extra.separate = !data.category
        if (data.extra.separate) {
            data.category = data.name
        }
        this._addOption(data)
        return this
    }
    addSlider = (data) => {
        data.type = "slider"
        if (!data.options) {
            data.options = [0, 100]
        }
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? data.options[0] : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        if (!data.extra) {
            data.extra = {
                increment: this.isNullOrUndefined(data.increment) ? 1 : data.increment,
                isDecimal: this.isNullOrUndefined(data.isDecimal) ? false : data.isDecimal,
                isPercent: this.isNullOrUndefined(data.isPercent) ? false : data.isPercent,
                decimalPlaces: this.isNullOrUndefined(data.decimalPlaces) ? 2 : data.decimalPlaces,
            }
        }
        this._addOption(data)
        return this
    }
    addText = (data) => {
        data.type = "text"
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? "" : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        this._addOption(data)
        return this
    }
    addTextInput = (data) => {
        this.addText(data)
        return this
    }
    addNumber = (data) => {
        data.type = "text"
        if (!data.extra) {
            data.extra = {
                number: true
            }
        }
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? 0 : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        this._addOption(data)
        return this
    }
    addNumberInput = (data) => {
        this.addNumber(data)
        return this
    }
    addPassword = (data) => {
        data.type = "text"
        if (!data.extra) {
            data.extra = {
                password: true
            }
        }
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? "" : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        this._addOption(data)
        return this
    }
    addPasswordInput = (data) => {
        this.addPassword(data)
        return this
    }
    addCommand = (data) => {
        data.type = "command"
        data.canReset = false
        this._addOption(data)
        return this
    }
    addButton = (data) => {
        data.type = "button"
        data.canReset = false
        this._addOption(data)
        return this
    }
    addSwitch = (data) => {
        data.type = "switch"
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? false : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        this._addOption(data)
        return this
    }
    addToggle = (data) => {
        this.addSwitch(data)
        return this
    }
    addColor = (data) => {
        data.type = "color"
        if (!data.placeholder) {
            data.placeholder = [255, 255, 255, 255]
        }
        if (!data.value) {
            data.value = [...data.placeholder]
        }
        if (!data.extraPersistent) {
            data.extraPersistent = {}
        }
        if (!data.extra) {
            data.extra = {}
            data.extra.allowAlpha = this.isNullOrUndefined(data.allowAlpha) ? true : data.allowAlpha

            // This is awful, but imports apparently aren't loaded here
            require(`../ZConfig/utils`).ResetColorPickerFromRGB(data, data.placeholder)
        }
        this._addOption(data)
        return this
    }
    addColour = (data) => {
        this.addColor(data)
        return this
    }
    addColorPicker = (data) => {
        this.addColor(data)
        return this
    }
    addColourPicker = (data) => {
        this.addColor(data)
        return this
    }
    addMinecraftColor = (data) => {
        data.type = "mccolor"
        if (!data.placeholder) {
            data.placeholder = ["", ""]
        }
        if (!data.value) {
            data.value = [...data.placeholder]
        }
        this._addOption(data)
        return this
    }
    addDropDown = (data) => {
        if (!data.options) {
            throw new Error("Dropdown cannot be initialized without options")
        }
        data.type = "dropdown"
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? 0 : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        this._addOption(data)
        return this
    }
    addDropdown = (data) => {
        this.addDropDown(data)
        return this
    }
    addSelection = (data) => {
        if (!data.options) {
            throw new Error("Selection cannot be initialized without options")
        }
        data.type = "dropdown"
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? data.options[0] : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        if (!data.extra) {
            data.extra = {
                selection: true
            }
        }
        this._addOption(data)
        return this
    }
    addKeybind = (data) => {
        data.type = "keybind"
        if (!data.placeholder) {
            data.placeholder = this.isNullOrUndefined(data.value) ? "KEY_NONE" : data.value
        }
        if (!data.value) {
            data.value = data.placeholder
        }
        if (!data.extra) {
            data.extra = {
                showActivateInMenusToggle: data.showActivateInMenusToggle || false,
            }
        }
        if (!data.extraPersistent) {
            data.extraPersistent = {}
        }
        if (this.isNullOrUndefined(data.extraPersistent.isMouseKey)) {
            data.extraPersistent.isMouseKey = false
        }
        if (this.isNullOrUndefined(data.extraPersistent.modifiers)) {
            data.extraPersistent.modifiers = {
                ctrl: false,
                shift: false,
                alt: false,
            }
        }
        if (this.isNullOrUndefined(data.extraPersistent.activateInMenus)) {
            data.extraPersistent.activateInMenus = false
        }
        if (!data.extra.persistentPlaceholder) {
            data.extra.persistentPlaceholder = data.extraPersistent
        }

        data.setupCallback = (option) => {
            // This is awful, but imports apparently aren't loaded here
            require(`../ZConfig/elements`).setupKeybind(option, this)
        }

        this._addOption(data)
        return this
    }
    addList = (data) => {
        data.type = "list"
        if (!data.options) {
            throw new Error("List cannot be initialized without options")
        }
        if (!data.placeholder) {
            data.placeholder = {}
        }
        if (!data.value) {
            data.value = JSON.parse(JSON.stringify(data.placeholder))
        }
        if (!data.extra) {
            data.extra = {
                editable: data.editable ?? false,
                lineIndices: data.lineIndices ?? false,
                maxLength: data.maxLength ?? null,
            }
        }
        data.options.forEach((arr, i) => {
            data.placeholder[arr[1]] = i
            data.value[arr[1]] = i
        })

        const persisted = this.data.persistent[data.varname]
        if (persisted && persisted.type == "list" && persisted.value) {
            const staticKeys = new Set(data.options.map(arr => arr[1]))
            for (let key in persisted.value) {
                if (!staticKeys.has(key)) {
                    data.options.push([key, key])
                }
            }
        }

        this._addOption(data)
        return this
    }
    addUnorderedList = (data) => {
        data.type = "unorderedList"
        if (!data.options) {
            throw new Error("List cannot be initialized without options")
        }
        if (!data.placeholder) {
            data.placeholder = JSON.parse(JSON.stringify(data.options)) || []
        }
        if (!data.value) {
            data.value = JSON.parse(JSON.stringify(data.placeholder))
        }
        if (!data.extra) {
            data.extra = {
                editable: data.editable ?? true,
                minimumHeight: data.minimumHeight ?? 4,
            }
        }
        this._addOption(data)
        return this
    }
    addCustomList = (data) => {
        this.addUnorderedList(data)
        return this
    }
    addCheckbox = (data) => {
        data.type = "checkbox"
        if (!data.options) {
            throw new Error("Checkbox cannot be initialized without options")
        }
        if (!data.placeholder) {
            data.placeholder = []
        }
        if (!data.value) {
            data.value = [...data.placeholder]
        }
        this._addOption(data)
        return this
    }
    addMultiCheckbox = (data) => {
        this.addCheckbox(data)
        return this
    }
    addMultiCheckBox = (data) => {
        this.addCheckbox(data)
        return this
    }
    addHud = (data) => {
        data.type = "hud"
        if (!data.hudData) {
            data.hudData = {}
        }

        data.hudData.hudTitle = (!this.isNullOrUndefined(data.hudData.hudTitle) ? data.hudData.hudTitle : (this.isNullOrUndefined(data.name) ? "Untitled Hud" : data.name))
        data.hudData.baseX = this.isNullOrUndefined(data.hudData.baseX) ? 0 : data.hudData.baseX
        data.hudData.baseY = this.isNullOrUndefined(data.hudData.baseY) ? 0 : data.hudData.baseY
        data.hudData.baseWidth = this.isNullOrUndefined(data.hudData.baseWidth) ? 100 : data.hudData.baseWidth
        data.hudData.baseHeight = this.isNullOrUndefined(data.hudData.baseHeight) ? 50 : data.hudData.baseHeight
        data.hudData.scaleX = this.isNullOrUndefined(data.hudData.scaleX) ? 1 : data.hudData.scaleX
        data.hudData.scaleY = this.isNullOrUndefined(data.hudData.scaleY) ? 1 : data.hudData.scaleY
        data.hudData.onDraw = data.hudData.onDraw/* || function(drawContext, title, x, y, width, height, scaleX, scaleY, isHovered, isSelected) {
            ZRenderLib.drawRectRGBA(drawContext, x, y, width, height, ...Variables.globalColors.primary.slice(0, 3), isHovered ? 150 : 100)
            ZRenderLib.drawGUIStringRGBA(drawContext, title, x, y, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
        }*/
        data.placeholder = JSON.parse(JSON.stringify(data.hudData))
        this._addOption(data)
        return this
    }
    addHUD = (data) => {
        this.addHud(data)
        return this
    }
    addCategory = (name, options) => {
        for (let option of options) {
            option.category = name
            switch (option.type) {
                case "slider":
                    this.addSlider(option)
                    break
                case "text":
                    this.addText(option)
                    break
                case "button":
                    this.addButton(option)
                    break
                case "switch":
                    this.addSwitch(option)
                    break
                case "color":
                case "colour":
                    this.addColor(option)
                    break
                case "color":
                    this.addColor(option)
                    break
                default:
                    this._addOption(option)
                    break
            }
        }
    }
    runInOrder(callback) {
        callback(this)
        return this
    }
    _addOption({
        type,
        name = "Untitled",
        description = "§7No description",
        group = "default",
        category,
        subcategory = "default",
        value,
        placeholder,
        varname = name,
        options,
        extra = {},
        extraPersistent = {},
        requires = [],
        canReset = true,
        hidden = false,
        onPress = null,
        onValueChanged = null,
        hideIf = null,
        setupCallback = null,
    }) {
        if (type == "colour") type = "color"
        if (!category) category = "default"
        if (!this.data.groups[group]) {
            this.data.groups[group] = {}
        }
        if (!this.data.groups[group][category]) {
            this.data.groups[group][category] = {
                "description": "",
                "subcategories": {},
            }
        }
        if (!this.data.groups[group][category]["subcategories"][subcategory]) {
            this.data.groups[group][category]["subcategories"][subcategory] = {
                "description": "",
                "elements": {},
            }
        }
        if (this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname]) {
            ChatLib.chat(`§c[ZConfig] §7Option with varname §e${varname}§7 already exists in module §e${this.moduleName}§7!`)
            throw new Error(`Option with varname ${varname} already exists in module ${this.moduleName}!`)
        }

        const orderIndex = this.orderCounter++
        this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname] = {
            orderIndex: orderIndex,
            type,
            name,
            description,
            group,
            category,
            subcategory,
            value: this.isNullOrUndefined(value) ? placeholder : value,
            placeholder,
            varname,
            options,
            extra,
            extraPersistent,
            requires,
            hidden,
            canReset,
            onPress,
            onValueChanged,
            hideIf,
        }

        if (!this.data.persistent[varname]) {
            this.data.persistent[varname] = {}
        }

        const invalidValueTypes = ["button", "command", "markdown"]
        if (this.data.persistent[varname] && !invalidValueTypes.includes(type) && this.data.persistent[varname].type == type) {
            if (!this.isNullOrUndefined(this.data.persistent[varname].value)) {
                this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname].value = this.data.persistent[varname].value
            }
            if (!this.isNullOrUndefined(this.data.persistent[varname].extraPersistent)) {
               this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname].extraPersistent = this.data.persistent[varname].extraPersistent
            }
        }

        if (!this.data.allOptions[varname]) {
            this.data.allOptions[varname] = {}
        }
        this.data.allOptions[varname] = this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname]

        if (type == "hud") {
            const opt = this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname]
            this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname].value = Hud.createHud(
                this.isNullOrUndefined(opt.placeholder.hudTitle) ? opt.name : opt.placeholder.hudTitle,
                this.isNullOrUndefined(opt.value?.x) ? opt.placeholder.baseX : opt.value?.x,
                this.isNullOrUndefined(opt.value?.y) ? opt.placeholder.baseY : opt.value?.y,
                this.isNullOrUndefined(opt.value?.width) ? opt.placeholder.baseWidth : opt.value?.width,
                this.isNullOrUndefined(opt.value?.height) ? opt.placeholder.baseHeight : opt.value?.height,
                this.isNullOrUndefined(opt.value?.scaleX) ? opt.placeholder.scaleX : opt.value?.scaleX,
                this.isNullOrUndefined(opt.value?.scaleY) ? opt.placeholder.scaleY : opt.value?.scaleY,
                opt.placeholder.onDraw,
            )
        }
        this.data.persistent[varname] = this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname]

        if (onValueChanged) {
            this.registerListener(varname, onValueChanged)
        }

        if (setupCallback) {
            setupCallback(this.data.groups[group][category]["subcategories"][subcategory]["elements"][varname])
        }

        Object.defineProperty(this, varname || name, {
            get: function() {
                return this.data.persistent[varname].value
            },
            set: function(newValue) {
                this.data.persistent[varname].value = newValue
            },
            enumerable: true,
            configurable: true,
        })
    }
}
export default ZConfigSettings
