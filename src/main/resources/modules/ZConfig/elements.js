import * as ZRenderLib from "../ZRenderLib"
import { isLegacy } from "modules/ZCore"
import * as Variables from "./variables"
import * as Utils from "./utils"
import * as Hud from "./hud"

const insetSpacing = 1
const doubleInsetSpacing = insetSpacing * 2
function _drawSwitch(drawContext, x, y, width, height, value, progress, time) {
    const handleOffset = 1
    const handleSize = 12

    const travelDistance = width - handleSize
    const xLerp = Utils.lerp(progress, travelDistance, time, 300)
    const startColor = value ? Variables.globalColors.light : Variables.globalColors.primary
    const endColor = value ? Variables.globalColors.primary : Variables.globalColors.light
    const handleX = value
        ? x + xLerp
        : x + travelDistance - xLerp

    // Draw track
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - insetSpacing, y - insetSpacing, width + doubleInsetSpacing, height + doubleInsetSpacing, 3, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, width, height, 2, ...Utils.interpColor(startColor, endColor, Utils.lerp(progress / 30, 1, time, 200)), 255)

    // Draw handle
    ZRenderLib.drawRoundedRectRGBA(drawContext, handleX - insetSpacing, y - handleOffset - insetSpacing, handleSize + doubleInsetSpacing, handleSize + doubleInsetSpacing, 3, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRect(drawContext, handleX, y - handleOffset, handleSize, handleSize, 2, ZRenderLib.WHITE)
}
export const drawSwitch = (drawContext, mx, my, x, y, option, mouseOver, onSettingsClicked) => {
    const switchWidth = 40
    const switchHeight = 10

    if (!option.time) {
        option.time = Date.now()
        option.progress = switchWidth - 12
    }
    _drawSwitch(drawContext, x, y, switchWidth, switchHeight, option.value, option.progress, option.time)
    if (mouseOver && Utils.isMouseButtonClicked(0)) {
        option.value = !option.value
        option.time = Date.now()
        option.progress = 0
        option.changed = true
    }
}

export const drawText = (drawContext, mx, my, x, y, width, option, settingsObject, mouseOver) => {
    if (!Variables.inputs[option.varname]) {
        Variables.inputs[option.varname] = new Utils.TextInput("Type here...", true, option.extra.number, option.extra.password)
        if (option.value) {
            Variables.inputs[option.varname].text = option.value
        }

        Variables.inputs[option.varname].onGuiKey((text) => {
            Variables.inputs[option.varname].text = text
        })
        const onExit = (text) => {
            if (option.value == text) return
            const oldValue = JSON.parse(JSON.stringify(option.value))
            option.value = text
            settingsObject.callOnChanged(option, oldValue)
        }
        Variables.inputs[option.varname].onExit(onExit)
        Variables.inputs[option.varname].onEnter(onExit)
    }

    if (Variables.inputs[option.varname].isActive) {
        if (Utils.isMouseButtonClicked(0, true) && !mouseOver) {
            Variables.inputs[option.varname].callOnExit()
        }
    } else {
        if (mouseOver && Utils.isMouseButtonClicked(0)) {
            Variables.inputs[option.varname].isActive = true
        }
    }

    // Draw input box
    const textWidth = Math.min(width, Variables.inputs[option.varname].getWidth() + 8)
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - insetSpacing, y - insetSpacing, textWidth + doubleInsetSpacing, 14 + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, textWidth, 14, 3, ...Variables.globalColors.primary)
    Variables.inputs[option.varname].draw(drawContext, x + 2, y + 1, width, 12)
}
export const drawMcColor = (drawContext, mx, my, x, y, option, mouseOver) => {
    const totalSize = 16
    const xSpacing = 2
    const cellWidth = totalSize + xSpacing
    const insetSize = totalSize - doubleInsetSpacing

    const primaryColor = Variables.globalColors.primary
    const secondaryColor = Variables.globalColors.secondary
    const tertiaryColor = Variables.globalColors.tertiary
    const textShadow = Variables.globalConfig.globalTextShadow

    const drawColorCell = (col, idx, yPos, valueIdx, stringOffset = 0) => {
        const xPos = x + idx * cellWidth
        const cellX = xPos - insetSpacing
        const cellY = yPos - insetSpacing

        // Draw backgrounds
        ZRenderLib.drawRoundedRectRGBA(drawContext, cellX, cellY, totalSize, totalSize, 4, ...tertiaryColor)
        ZRenderLib.drawRoundedRectRGBA(drawContext, xPos, yPos, insetSize, insetSize, 3, ...(option.value[valueIdx] === col ? primaryColor : secondaryColor))

        // Handle interaction
        const isHover = Utils.isMouseover(mx, my, xPos, yPos, totalSize, totalSize)
        const text = isHover ? col : `§${col}${col}`
        const textX = xPos + 4 + stringOffset
        const textY = yPos + 3

        ZRenderLib.drawGUIStringRGBA(drawContext, text, textX, textY, ...Variables.globalColors.text, 1, false, textShadow, 512, 1)

        if (isHover && Utils.isMouseButtonClicked(0)) {
            option.value[valueIdx] = option.value[valueIdx] === col ? "" : col
            option.changed = true
        }
    }

    const colorCodes = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
    colorCodes.forEach((col, i) => drawColorCell(col, i, y - 1, 0))

    // Second row: formatting codes k-o
    const formatCodes = ["k", "l", "m", "n", "o"]
    formatCodes.forEach((col, i) =>
        drawColorCell(col, i, y + 17, 1, col === "l" ? 1.5 : 0)
    )
}
export const drawColor = (drawContext, mx, my, x, y, option, settingsObject, mouseOver) => {
    y -= 128

    const hueBarX = x
    const hueBarY = y - 4

    // Draw hue bar (top bar)
    ZRenderLib.drawRectRGBA(drawContext, hueBarX - 1, hueBarY - 1, 130, 14, ...Variables.globalColors.primary)
    Utils.drawHueBar(drawContext, hueBarX, hueBarY, 128, 12)

    // Draw hue bar cursor outline
    Utils.drawOutline(drawContext, hueBarX - 1 + option.extraPersistent.hueSelection * 124, hueBarY - 2, 6, 15, ZRenderLib.BLACK)
    Utils.drawOutline(drawContext, hueBarX + option.extraPersistent.hueSelection * 124, hueBarY - 1, 4, 13, ZRenderLib.WHITE)

    if (Utils.isMouseover(mx, my, hueBarX - 1, hueBarY, 128, 12) && Utils.isMouseButtonClicked(0)) {
        option.old = JSON.parse(JSON.stringify(option.value))
        option.hueClicked = true
    }

    const alpha = option.extra.allowAlpha ? option.value[3] : 255
    if (option.hueClicked && Utils.isMouseButtonClicked(0, true)) {
        option.extraPersistent.hueSelection = Math.max(0, Math.min(1, (mx - hueBarX) / 128))
        const hueColor = Utils.getColorFromHueBar(option.extraPersistent.hueSelection * 128, 128)
        option.extraPersistent.hueColor = [...hueColor]
        option.extraPersistent.value = [...hueColor, alpha]
        option.value = [
            Math.min(255, Math.max(0, option.extraPersistent.value[0] + (255 - option.extraPersistent.value[0]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            Math.min(255, Math.max(0, option.extraPersistent.value[1] + (255 - option.extraPersistent.value[1]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            Math.min(255, Math.max(0, option.extraPersistent.value[2] + (255 - option.extraPersistent.value[2]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            alpha,
        ]
        Utils.UpdateColorPickerHexCodeText(option)
    } else {
        if (option.hueClicked) {
            option.changed = true
        }
        option.hueClicked = false
    }
    y += 13
    x += 131

    if (option.extra.allowAlpha) {
        const alphaBarX = x + 2
        const alphaBarY = y
        // Draw alpha bar (right bar)
        ZRenderLib.drawRectRGBA(drawContext, alphaBarX - 1, alphaBarY - 1, 14, 130, ...Variables.globalColors.primary)
        ZRenderLib.drawRect(drawContext, alphaBarX, alphaBarY, 12, 128, ZRenderLib.WHITE)
        ZRenderLib.drawSimpleGradientRGBA(
            drawContext,
            alphaBarX, alphaBarY, 12, 128,
            255, 255, 255, 255,
            ...(option.value.slice(0, 3)), 255,
            ZRenderLib.GradientDirection.TOP_TO_BOTTOM
        )

        // Draw alpha bar cursor outline
        Utils.drawOutline(drawContext, alphaBarX - 2, alphaBarY - 2 + option.value[3] / 255 * 125, 15, 5, ZRenderLib.BLACK)
        Utils.drawOutline(drawContext, alphaBarX - 1, alphaBarY - 1 + option.value[3] / 255 * 125, 13, 3, ZRenderLib.WHITE)

        if (Utils.isMouseover(mx, my, alphaBarX, alphaBarY, 12, 128) && Utils.isMouseButtonClicked(0)) {
            option.old = JSON.parse(JSON.stringify(option.value))
            option.alphaClicked = true
        }

        if (option.alphaClicked && Utils.isMouseButtonClicked(0, true)) {
            option.value[3] = Math.max(0, Math.min(255, (my - (alphaBarY + 1)) / 126 * 255))
            Utils.UpdateColorPickerHexCodeText(option)
        } else {
            if (option.alphaClicked) {
                option.changed = true
            }
            option.alphaClicked = false
        }
    }
    x -= 131

    // Draw main color square white background
    ZRenderLib.drawRectRGBA(drawContext, x - 1, y - 1, 130, 130, ...Variables.globalColors.primary)
    ZRenderLib.drawRect(drawContext, x, y, 128, 128, ZRenderLib.WHITE)

    // Draw main color square
    ZRenderLib.drawGradient(
        drawContext,
        x, y, 128, 128,
        ZRenderLib.WHITE,
        ZRenderLib.getRGBAColor(...option.extraPersistent.hueColor, 255).getLong(),
        ZRenderLib.BLACK,
        ZRenderLib.BLACK,
        ZRenderLib.GradientDirection.TOP_LEFT_TO_BOTTOM_RIGHT
    )

    // Draw main color square cursor outline
    Utils.drawOutline(drawContext, x + 128 - option.extraPersistent.xDif * 128 - 4, y + 128 - option.extraPersistent.yDif * 128 - 4, 8, 8, ZRenderLib.BLACK)
    Utils.drawOutline(drawContext, x + 128 - option.extraPersistent.xDif * 128 - 3, y + 128 - option.extraPersistent.yDif * 128 - 3, 6, 6, ZRenderLib.WHITE)

    if (Utils.isMouseover(mx, my, x, y, 128, 128) && Utils.isMouseButtonClicked(0)) {
        option.old = JSON.parse(JSON.stringify(option.value))
        option.brightnessClicked = true
    }

    if (option.brightnessClicked && Utils.isMouseButtonClicked(0, true)) {
        option.extraPersistent.xDif = (x + 128 - Math.max(x, Math.min(mx, x + 128))) / 128
        option.extraPersistent.yDif = (y + 128 - Math.max(y, Math.min(my, y + 128))) / 128
        option.value = [
            Math.min(255, Math.max(0, option.extraPersistent.value[0] + (255 - option.extraPersistent.value[0]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            Math.min(255, Math.max(0, option.extraPersistent.value[1] + (255 - option.extraPersistent.value[1]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            Math.min(255, Math.max(0, option.extraPersistent.value[2] + (255 - option.extraPersistent.value[2]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
            alpha,
        ]
        Utils.UpdateColorPickerHexCodeText(option)
    } else {
        if (option.brightnessClicked) {
            option.changed = true
        }
        option.brightnessClicked = false
    }
    y += 128 + 8

    const hexCode = Utils.rgbArrayToHex(option.value)
    let width = ZRenderLib.getStringWidth(hexCode) + 8
    if (!Variables.inputs[option.varname]) {
        Variables.inputs[option.varname] = new Utils.TextInput("Enter Hex...", false, false, false)
        Utils.UpdateColorPickerHexCodeText(option)
        let toChange = option
        Variables.inputs[option.varname].onGuiKey((text) => {
            let textU = null
            if (isLegacy) {
                textU = text.replace("§#", "").replace("§/", "")
            }
            textU = text.replace("#", "")
            text = "#" + Utils.RemoveFormatting(textU).toUpperCase().replace(/[^0-9A-F]/g, "").slice(0, option.extra.allowAlpha ? 8 : 6)
            Variables.inputs[option.varname].text = text

            let rgb = Utils.hexToRgbArray(text)
            if (rgb) {
                toChange.value = [
                    rgb[0],
                    rgb[1],
                    rgb[2],
                    option.extra.allowAlpha ? (rgb.length > 3 ? rgb[3] : 255) : 255,
                ]
            }
        })

        const onExit = (text) => {
            if (text == "" || text == "#") {
                Variables.inputs[option.varname].value = option.placeholder
            }
            Utils.ResetColorPickerFromRGB(option, option.value)
        }
        Variables.inputs[option.varname].onExit(onExit)
        Variables.inputs[option.varname].onEnter(onExit)
    }

    if (Utils.isMouseButtonClicked(0, true) && !mouseOver) {
        if (Variables.inputs[option.varname].isActive) {
            option.changed = true
            Variables.inputs[option.varname].callOnExit()
        }
    }
    if (mouseOver && Utils.isMouseButtonClicked(0)) {
        if (!Variables.inputs[option.varname].isActive) {
            option.changed = true
        }
        Variables.inputs[option.varname].isActive = true
    }

    // Draw hex code input box
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - 1 - insetSpacing, y - insetSpacing, Math.min(width, Math.max(80, Variables.inputs[option.varname].getWidth() + 8)) + doubleInsetSpacing, 14 + doubleInsetSpacing, 4, ...Variables.globalColors.primary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - 1, y, Math.min(width, Math.max(80, Variables.inputs[option.varname].getWidth() + 8)), 14, 3, ...Variables.globalColors.dark)
    Variables.inputs[option.varname].draw(drawContext, x + 2, y + 1, width, 12)
}

export const drawButton = (drawContext, mx, my, x, y, width, option, mouseOver) => {
    const label = option.placeholder || "Click"
    const labelWidth = ZRenderLib.getStringWidth(label)
    const buttonWidth = Math.max(Math.min(labelWidth + 8, width), 64)
    const buttonX = x + 8
    const buttonY = y - 14
    const buttonHeight = 16
    const textX = buttonX + (buttonWidth - labelWidth) / 2
    const textY = buttonY + 4

    const colors = Variables.globalColors
    const isHover = Utils.isMouseover(mx, my, buttonX, buttonY, buttonWidth, buttonHeight)
    const buttonColor = isHover ? colors.light : colors.primary

    // Draw button with outline
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX - insetSpacing, buttonY - insetSpacing, buttonWidth + doubleInsetSpacing, buttonHeight + doubleInsetSpacing, 4, ...colors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX, buttonY, buttonWidth, buttonHeight, 3, ...buttonColor)

    // Draw button label
    ZRenderLib.drawGUIStringRGBA(drawContext, label, textX, textY, ...colors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

    // Handle click
    if (mouseOver && Utils.isMouseButtonClicked(0) && option.onPress) {
        option.onPress(option)
    }
}

export const drawSlider = (drawContext, mx, my, x, y, option, settingsObject, mouseOver, width, drawTooltip) => {
    const sliderHeight = 12
    const handleWidth = 10

    const [minVal, maxVal] = option.options
    const dif = maxVal - minVal
    const valueRatio = (option.value - minVal) / dif

    // Cache colors and settings
    const colors = Variables.globalColors
    const primaryColor = colors.primary
    const tertiaryColor = colors.tertiary
    const lightColor = colors.light
    const textShadow = Variables.globalConfig.globalTextShadow

    // Draw min/max labels
    const minWidth = ZRenderLib.getStringWidth(minVal.toString())
    ZRenderLib.drawGUIStringRGBA(drawContext, minVal, x - 3, y + 2, ...colors.text, 1, false, textShadow, 512, 1)
    ZRenderLib.drawGUIStringRGBA(drawContext, maxVal, x + minWidth + width + 3, y + 2, ...colors.text, 1, false, textShadow, 512, 1)

    const trackX = x + minWidth
    const filledWidth = valueRatio * width
    const handleX = trackX + valueRatio * (width - handleWidth)

    // Draw track background
    ZRenderLib.drawRoundedRectRGBA(drawContext, trackX - insetSpacing, y - insetSpacing, width + doubleInsetSpacing, sliderHeight + doubleInsetSpacing, 3, ...tertiaryColor)
    ZRenderLib.drawRoundedRectRGBA(drawContext, trackX, y, width, sliderHeight, 2, ...lightColor)

    // Draw filled track
    ZRenderLib.drawRoundedRectRGBA(drawContext, trackX - insetSpacing, y - insetSpacing, filledWidth + doubleInsetSpacing, sliderHeight + doubleInsetSpacing, 3, ...tertiaryColor)
    ZRenderLib.drawRoundedRectRGBA(drawContext, trackX, y, filledWidth, sliderHeight, 2, ...primaryColor)

    // Draw handle
    const handleY = y - 0.5
    const handleH = sliderHeight + 1
    ZRenderLib.drawRoundedRectRGBA(drawContext, handleX - insetSpacing, handleY - insetSpacing, handleWidth + doubleInsetSpacing, handleH + doubleInsetSpacing, 3, ...tertiaryColor)
    ZRenderLib.drawRoundedRect(drawContext, handleX, handleY, handleWidth, handleH, 2, ZRenderLib.WHITE)

    // Handle click to start dragging
    if (Utils.isMouseover(mx, my, trackX - 1, y, width + 2, sliderHeight) && Utils.isMouseButtonClicked(0)) {
        option.old = JSON.parse(JSON.stringify(option.value))
        option.clicked = true
    }

    const normalizeValue = (value, bypassClamp = false) => {
        value = option.extra.isDecimal
            ? parseFloat(value.toFixed(option.extra.decimalPlaces))
            : Math.round(value / option.extra.increment) * option.extra.increment

        return bypassClamp ? value : Math.max(minVal, Math.min(maxVal, value))
    }

    // Handle dragging
    if (option.clicked && Utils.isMouseButtonClicked(0, true)) {
        option.value = normalizeValue((mx - trackX) / width * dif + minVal)
        drawTooltip({
            line: `${Math.floor(option.value * width) / width}${option.extra.isPercent ? "%" : ""}`,
            x: mx,
            y: y
        })
        Utils.UpdateInputFieldText(option, `${option.value}${option.extra.isPercent ? "%" : ""}`)
    } else if (option.clicked) {
        option.changed = true
        option.clicked = false
    }

    // Initialize input field
    let input = Variables.inputs[option.varname]
    if (!input) {
        input = Variables.inputs[option.varname] = new Utils.TextInput("...", true, true, false)
        input.text = `${option.value}${option.extra.isPercent ? "%" : ""}`

        input.onGuiKey((text) => input.text = `${text}`)

        const onExit = (text) => {
            const newValue = parseFloat(text) || minVal
            const oldValue = JSON.parse(JSON.stringify(option.value))
            option.value = normalizeValue(newValue, false)

            if (`${option.value}` !== input.text) {
                input.text = `${option.value}${option.extra.isPercent ? "%" : ""}`
                settingsObject.callOnChanged(option, oldValue)
            }
        }
        input.onExit(onExit)
        input.onEnter(onExit)
    }

    // Handle input activation
    if (input.isActive) {
        if (Utils.isMouseButtonClicked(0, true) && !mouseOver) {
            input.callOnExit()
        }
    } else if (mouseOver && Utils.isMouseButtonClicked(0)) {
        input.isActive = true
    }

    // Draw input box
    const maximumValueWidth = ZRenderLib.getStringWidth(maxVal) + 8
    const currentValueWidth = ZRenderLib.getStringWidth(input.text || "...") + 8
    const inputBoxX = x + width + minWidth + maximumValueWidth + 4

    ZRenderLib.drawRoundedRectRGBA(drawContext, inputBoxX - 1 - insetSpacing, y - insetSpacing, currentValueWidth + doubleInsetSpacing, sliderHeight + doubleInsetSpacing, 4, ...tertiaryColor)
    ZRenderLib.drawRoundedRectRGBA(drawContext, inputBoxX - 1, y, currentValueWidth, sliderHeight, 3, ...primaryColor)
    input.draw(drawContext, inputBoxX + 1, y + 0.5, currentValueWidth, sliderHeight)
}
export const drawDropdown = (drawContext, mx, my, x, y, option, mouseOver) => {
    const progress = Utils.lerp(option.progress, option.down ? 1 : 0, option.time, 100)
    const w = Math.max(80, Utils.getLongest(option.options).width + 24)

    // Draw option outline
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - insetSpacing, y - insetSpacing, w + doubleInsetSpacing, 16 * (option.down ? option.options.length + 1 : 1) * (progress || 1) + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)

    // Draw main dropdown box and selected option
    let mainFlatCorners = (option.down) ? ZRenderLib.BOTTOM_FLAT_CORNERS : []
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, w, 16, 3, ...Variables.globalColors.primary, mainFlatCorners)
    ZRenderLib.drawGUIStringRGBA(drawContext, option.extra.selection ? option.value : option.options[option.value ?? 0], x + 4, y + 4, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
    ZRenderLib.drawGUIStringRGBA(drawContext, option.down ? "▲" : "▼", x + w - 8, y + 4, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

    option.hovered = false
    if (option.down || progress) {
        let ii = 1
        option.options.forEach((str, i) => {
            let mOver = Utils.isMouseover(mx, my, x, y + ii * 16 * progress, w, 16)
            if (mOver && Utils.isMouseButtonClicked(0)) {
                option.value = option.extra.selection ? str : ii - 1
                option.time = Date.now()
                option.progress = 1
                option.changed = true
            }
            if (mOver) {
                option.hovered = true
            }

            // Draw option background
            let hoverColor = null
            if (progress > 0.9 && mOver) {
                hoverColor = Variables.globalColors.light
            } else {
                hoverColor = Variables.globalColors.dark
            }

            let itemFlatCorners = (i == option.options.length - 1) ? ZRenderLib.TOP_FLAT_CORNERS : ZRenderLib.ALL_FLAT_CORNERS
            ZRenderLib.drawRoundedRectRGBA(drawContext, x, y + ii * 16 * progress, w, 16, 4, ...hoverColor, itemFlatCorners)

            // Draw divider line
            ZRenderLib.drawRectRGBA(drawContext, x, y + ii * 16 * progress, w, 1, ...Variables.globalColors.primary)

            // Draw currently selected square
            if ((option.extra.selection && option.value == str) || (!option.extra.selection && option.value == ii - 1)) {
                ZRenderLib.drawRoundedRectRGBA(drawContext, x + 3, y + 3 + ii * 16 * progress, 10, 10, 3, ...Variables.globalColors.primary)
                ZRenderLib.drawGUIStringRGBA(drawContext, "§l✓", x + 6, y + 3 + ii * 16 * progress, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }

            // Draw option text
            if (progress > 0.9) {
                ZRenderLib.drawGUIStringRGBA(drawContext, str, x + 16, y + 5 + ii * 16 * progress, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }
            ii++
        })
    }

    if (mouseOver && Utils.isMouseButtonClicked(0)) {
        option.down = !option.down
        option.time = Date.now()
        option.progress = (option.down ? 0 : 1)
    }
}

export const setupKeybind = (option, settingsObject) => {
    if (!Variables.inputs[option.varname]) {
        Variables.inputs[option.varname] = new Utils.KeybindInput(
            option.placeholder,
            option.value,
            option.extraPersistent.isMouseKey,
            option.extraPersistent.modifiers,
            option.extraPersistent.activateInMenus,
            option.onPress,
        )

        Variables.inputs[option.varname].onChanged((keyName, isMouseKey, modifiers) => {
            option.old = JSON.parse(JSON.stringify(option.value))
            option.value = keyName
            option.extraPersistent.isMouseKey = isMouseKey
            option.extraPersistent.modifiers = modifiers

            settingsObject.data.persistent[option.varname].value = keyName
            settingsObject.data.persistent[option.varname].extraPersistent = {
                isMouseKey: isMouseKey,
                modifiers: modifiers,
                activateInMenus: option.extraPersistent.activateInMenus,
            }
            settingsObject.callOnChanged(option)
        })
        option.isSetup = true
    }
}
export const drawKeybind = (drawContext, mx, my, x, y, width, option, settingsObject, mouseOver) => {
    const textWidth = Math.min(width, Variables.inputs[option.varname].getWidth() + 8)

    let isToggleHovered = false
    if (option.extra.showActivateInMenusToggle) {
        const toggleWidth = 32
        const toggleHeight = 10
        const toggleX = x
        const toggleY = y + 20 + doubleInsetSpacing
        const toggleTextX = x + toggleWidth + doubleInsetSpacing + 2
        const toggleTextY = toggleY + 1
        isToggleHovered = Utils.isMouseover(mx, my, toggleX, toggleY, toggleWidth, toggleHeight)

        if (!option.time) {
            option.time = Date.now()
            option.progress = toggleWidth - 12
        }
        _drawSwitch(drawContext, toggleX, toggleY, toggleWidth, toggleHeight, option.extraPersistent.activateInMenus, option.progress, option.time)
        ZRenderLib.drawGUIStringRGBA(drawContext, "Trigger in Menus?", toggleTextX, toggleTextY, ...Variables.globalColors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
        if (isToggleHovered && Utils.isMouseButtonClicked(0)) {
            option.extraPersistent.activateInMenus = !option.extraPersistent.activateInMenus
            option.time = Date.now()
            option.progress = 0
            option.changed = true
            Variables.inputs[option.varname].activateInMenus = option.extraPersistent.activateInMenus
        }
    }

    if (Variables.inputs[option.varname].isActive) {
        if (Utils.isMouseButtonClicked(0, true) && !mouseOver) {
            Variables.inputs[option.varname].callOnChanged()
        }
    } else {
        if ((mouseOver && !isToggleHovered) && Utils.isMouseButtonClicked(0)) {
            Variables.inputs[option.varname].isActive = true
        }
    }

    ZRenderLib.drawRoundedRectRGBA(drawContext, x - insetSpacing, y - insetSpacing, textWidth + doubleInsetSpacing, 16 + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, textWidth, 16, 3, ...Variables.globalColors.primary)
    Variables.inputs[option.varname].draw(drawContext, x + 2, y + 2)
}

export const drawList = (drawContext, mx, my, x, y, option, mouseOver) => {
    let linePrefix = ""
    let linePrefixWidth = 0
    const lineOffsetX = 1 + 4
    if (option.extra.lineIndices) {
        const maxIndexNum = option.options.filter((_, i) => {
            return option.value[option.options[i][1]] !== null
        }).length + 1
        linePrefixWidth = ZRenderLib.getStringWidth(`${maxIndexNum} §8| §r`)
    } else {
        linePrefix = "= "
        linePrefixWidth = ZRenderLib.getStringWidth(linePrefix)
    }
    const width = Math.max(116, Utils.getLongest(option.options.map(opt => opt[0])).width + (2 * lineOffsetX) + 8 + linePrefixWidth)
    const height = option.options.length * 12 + 4 + 4 + 6
    y -= 8

    ZRenderLib.drawRectRGBA(drawContext, x, y, width, height, ...Variables.globalColors.primary)
    ZRenderLib.drawRectRGBA(drawContext, x + 1, y + 1, width - 2, height - 2, ...Variables.globalColors.dark)

    const addButtonX = x + width - 10
    const addButtonY = y + 4
    const addOptions = option.options.filter(opt => option.value[opt[1]] === null)
    const activeOptions = option.options
        .filter(opt => option.value[opt[1]] != null)
        .sort((a, b) => option.value[a[1]] - option.value[b[1]])
    activeOptions.forEach((opt, index) => {
        option.value[opt[1]] = index
    })
    const isOverLimit = option.extra.maxLength != null && activeOptions.length >= option.extra.maxLength

    if (addOptions.length == 0) {
        option.addMenuOpen = false
    } else if (!isOverLimit) {
        ZRenderLib.drawGUIStringRGBA(drawContext, "+", addButtonX, addButtonY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512)
    }

    activeOptions.forEach(arr => {
        let rY = y + 3 + (option.value[arr[1]] + 1) * 12

        // Hover hightlight
        if (Utils.isMouseover(mx, my, x + 1, rY - 2, width - 2, 12)) {
            ZRenderLib.drawRectRGBA(drawContext, x + 1, rY - 2, width - 2, 12, ...Variables.globalColors.light)
        }

        // Lines
        if (option.clicked?.[0] !== arr[0]) {
            let realLinePrefix = option.extra.lineIndices ? `${option.value[arr[1]] + 1} §8| §r` : linePrefix
            ZRenderLib.drawGUIStringRGBA(drawContext, `${realLinePrefix}${arr[0]}`, x + lineOffsetX, rY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512)
            ZRenderLib.drawGUIStringRGBA(drawContext, "⤬", x + width - 10, rY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512)
        }

        if (!option.addMenuOpen && Utils.isMouseover(mx, my, x + 1, rY - 2, width - 2, 12)) {
            if (!option.clicked) {
                if (Utils.isMouseButtonClicked(0)) {
                    option.old = JSON.parse(JSON.stringify(option.value))
                    if (Utils.isMouseover(mx, my, x + width - 12, rY - 1, 10, 10)) {
                        const isCustom = option.placeholder && !(arr[1] in option.placeholder)
                        if (isCustom) {
                            const optIndex = option.options.findIndex(opt => opt[1] === arr[1])
                            if (optIndex !== -1) option.options.splice(optIndex, 1)
                            delete option.value[arr[1]]
                        } else {
                            for (let key in option.value) {
                                if (option.value[key] > option.value[arr[1]]) {
                                    option.value[key] -= 1
                                }
                            }
                            option.value[arr[1]] = null
                        }
                        option.changed = true
                    } else {
                        option.clicked = arr
                    }
                }
            } else {
                const tempValue = option.value[option.clicked[1]]
                option.value[option.clicked[1]] = option.value[arr[1]]
                option.value[arr[1]] = tempValue
            }
        }

        if (option.clicked && !Utils.isMouseButtonClicked(0, true)) {
            if (option.clicked) {
                option.changed = true
            }
            option.clicked = null
        }
    })
    if (option.clicked) {
        ZRenderLib.drawGUIStringRGBA(drawContext, option.clicked[0], mx, my - 10, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512)
    }

    if (option.addMenuOpen) {
        let i = 0
        ZRenderLib.drawRectRGBA(drawContext, x + 1, y + 1, width - 2, 12 * (option.options.length + 1), ...Variables.globalColors.dark, 1)
        ZRenderLib.drawGUIStringRGBA(drawContext, "Click to Add...", x + 4, y + 4, ...Variables.globalColors.secondaryText, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
        if (addOptions.length == 0) {
            option.addMenuOpen = false
        }
        for (let arr of addOptions) {
            const optionBoxX = x + 1
            const optionBoxY = y + i * 12 + 13
            const optionBoxWidth = width - 2
            const optionBoxHeight = 11

            // Border lines
            ZRenderLib.drawRectRGBA(drawContext, optionBoxX, optionBoxY, optionBoxWidth, optionBoxHeight + 2, ...Variables.globalColors.tertiary, 1)
            ZRenderLib.drawRectRGBA(drawContext, optionBoxX + 1, optionBoxY + 1, optionBoxWidth - 2, optionBoxHeight, ...Variables.globalColors.dark, 1)

            // Hover highlight
            if (Utils.isMouseover(mx, my, optionBoxX + 1, optionBoxY + 1, optionBoxWidth - 2, optionBoxHeight)) {
                ZRenderLib.drawRectRGBA(drawContext, optionBoxX + 1, optionBoxY + 1, optionBoxWidth - 2, optionBoxHeight, ...Variables.globalColors.light, 1)
                if (!isOverLimit && Utils.isMouseButtonClicked(0)) {
                    option.old = JSON.parse(JSON.stringify(option.value))
                    option.value[arr[1]] = activeOptions.length
                    option.changed = true
                }
            }

            // Lines
            ZRenderLib.drawGUIStringRGBA(drawContext, `+ ${arr[0]}`, optionBoxX + 4, optionBoxY + 2, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            i++
        }
    }

    if (!option.addMenuOpen && Utils.isMouseover(mx, my, addButtonX - 2.5, addButtonY - 1, 10, 10) && addOptions.length > 0) {
        ZRenderLib.drawRectRGBA(drawContext, addButtonX - 2.5, addButtonY - 1, 10, 10, 255, 255, 255, 100)
        if (Utils.isMouseButtonClicked(0) && addOptions.length > 0) {
            option.addMenuOpen = true
        }
    } else if (Utils.isMouseButtonClicked(0, false, true)) {
        option.addMenuOpen = false
    }

    if (!option.extra.editable) return

    const TryAddNewListValue = () => {
        if (isOverLimit) return
        const newValue = Variables.inputs[option.varname].text
        if (newValue == "") return
        if (option.options.some(opt => opt[0] === newValue)) return
        Variables.inputs[option.varname].text = ""

        option.old = JSON.parse(JSON.stringify(option.value))
        option.options.push([newValue, newValue])
        option.value[newValue] = activeOptions.length
        option.changed = true
    }

    if (!Variables.inputs[option.varname]) {
        Variables.inputs[option.varname] = new Utils.TextInput("Type here...", true, false, false)
        Variables.inputs[option.varname].onGuiKey((text) => {
            Variables.inputs[option.varname].text = text
        })

        Variables.inputs[option.varname].onEnter((text) => {
            TryAddNewListValue()
        })
    }

    const buttonLabel = "Add"
    const buttonLabelWidth = ZRenderLib.getStringWidth(buttonLabel)
    const buttonWidth = Math.max(Math.min(buttonLabelWidth + 8, width), 16)
    const buttonHeight = 16
    const buttonX = x + 1
    const buttonY = y + height + 1 + 5
    const buttonTextX = buttonX + (buttonWidth - buttonLabelWidth) / 2
    const buttonTextY = buttonY + 4
    const isButtonHover = !isOverLimit && Utils.isMouseover(mx, my, buttonX, buttonY, buttonWidth, buttonHeight)
    const buttonColor = isOverLimit
        ? Variables.globalColors.dark
        : (isButtonHover ? Variables.globalColors.light : Variables.globalColors.primary)
    const buttonTextColor = isOverLimit ? Variables.globalColors.secondaryText : Variables.globalColors.text
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX - insetSpacing, buttonY - insetSpacing, buttonWidth + doubleInsetSpacing, buttonHeight + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX, buttonY, buttonWidth, buttonHeight, 3, ...buttonColor)
    ZRenderLib.drawGUIStringRGBA(drawContext, buttonLabel, buttonTextX, buttonTextY, ...buttonTextColor, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

    if (isButtonHover && Utils.isMouseButtonClicked(0)) {
        TryAddNewListValue()
    }

    const textBoxX = x + 1 + buttonWidth + 8
    const textBoxY = buttonY + 1
    const textBoxWidth = Math.min(width, Math.max(80, Variables.inputs[option.varname].getWidth() + 8))
    const textBoxHeight = 14
    const isTextBoxHover = !isOverLimit && Utils.isMouseover(mx, my, textBoxX, textBoxY, textBoxWidth, textBoxHeight)

    if (isOverLimit) {
        if (Variables.inputs[option.varname].isActive) {
            Variables.inputs[option.varname].callOnExit()
        }
    } else if (Variables.inputs[option.varname].isActive) {
        if (Utils.isMouseButtonClicked(0, true) && !isTextBoxHover) {
            Variables.inputs[option.varname].callOnExit()
        }
    } else if (isTextBoxHover) {
        if (Utils.isMouseButtonClicked(0)) {
            Variables.inputs[option.varname].isActive = true
        }
    }

    const textBoxOuterColor = isOverLimit ? Variables.globalColors.dark : Variables.globalColors.primary
    ZRenderLib.drawRoundedRectRGBA(drawContext, textBoxX - insetSpacing, textBoxY - insetSpacing, textBoxWidth + doubleInsetSpacing, textBoxHeight + doubleInsetSpacing, 4, ...textBoxOuterColor)
    ZRenderLib.drawRoundedRectRGBA(drawContext, textBoxX, textBoxY, textBoxWidth, textBoxHeight, 3, ...Variables.globalColors.dark)
    Variables.inputs[option.varname].draw(drawContext, textBoxX + 2, textBoxY + 1, width, 12)
}
export const drawUnorderedList = (drawContext, mx, my, x, y, width, option, mouseOver) => {
    const TryAddNewListValue = () => {
        const newValue = Variables.inputs[option.varname].text
        if (newValue == "") return
        if (option.value.includes(newValue)) return
        Variables.inputs[option.varname].text = ""
        option.value.push(newValue)
        option.changed = true
    }
    if (!Variables.inputs[option.varname]) {
        Variables.inputs[option.varname] = new Utils.TextInput("Type here...", true, false, false)
        Variables.inputs[option.varname].onGuiKey((text) => {
            Variables.inputs[option.varname].text = text
        })

        Variables.inputs[option.varname].onEnter((text) => {
            TryAddNewListValue()
        })
    }

    const combinedList = new Set([...option.options, ...option.value])
    const linePrefix = "- "
    const lineOffsetX = 1 + 4
    const lineOffsetY = 1 + 2
    const boxWidth = Math.max(116, Math.min(width - 2, Utils.getLongest([...combinedList]).width + (2 * lineOffsetX) + 8 + ZRenderLib.getStringWidth(linePrefix)))
    const height = Math.max(option.extra.minimumHeight * 12, combinedList.size * 12 + 2)
    y -= 8

    // Background
    ZRenderLib.drawRectRGBA(drawContext, x, y, boxWidth, height, ...Variables.globalColors.primary)
    ZRenderLib.drawRectRGBA(drawContext, x + 1, y + 1, boxWidth - 2, height - 2, ...Variables.globalColors.dark)

    option.value.forEach((line, index) => {
        let rY = y + index * 12 + lineOffsetY

        // Hover hightlight
        if (Utils.isMouseover(mx, my, x + 1, rY - 2, boxWidth - 2, 12)) {
            ZRenderLib.drawRectRGBA(drawContext, x + 1, rY - 2, boxWidth - 2, 12, ...Variables.globalColors.light)
        }

        // Lines
        ZRenderLib.drawGUIStringRGBA(drawContext, `${linePrefix}${line}`, x + lineOffsetX, rY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, boxWidth - 18)
        ZRenderLib.drawGUIStringRGBA(drawContext, "⤬", x + boxWidth - 10, rY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512)

        // X Button
        if (Utils.isMouseover(mx, my, x + boxWidth - 12, rY - 1, 10, 10)) {
            if (Utils.isMouseButtonClicked(0)) {
                option.old = JSON.parse(JSON.stringify(option.value))
                option.value.splice(index, 1)
                option.changed = true
            }
        }
    })

    if (!option.extra.editable) return

    const buttonLabel = "Add"
    const buttonLabelWidth = ZRenderLib.getStringWidth(buttonLabel)
    const buttonWidth = Math.max(Math.min(buttonLabelWidth + 8, boxWidth), 16)
    const buttonHeight = 16
    const buttonX = x + 1
    const buttonY = y + height + 1 + 5
    const buttonTextX = buttonX + (buttonWidth - buttonLabelWidth) / 2
    const buttonTextY = buttonY + 4
    const isButtonHover = Utils.isMouseover(mx, my, buttonX, buttonY, buttonWidth, buttonHeight)
    const buttonColor = isButtonHover ? Variables.globalColors.light : Variables.globalColors.primary
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX - insetSpacing, buttonY - insetSpacing, buttonWidth + doubleInsetSpacing, buttonHeight + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX, buttonY, buttonWidth, buttonHeight, 3, ...buttonColor)
    ZRenderLib.drawGUIStringRGBA(drawContext, buttonLabel, buttonTextX, buttonTextY, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

    if (isButtonHover && Utils.isMouseButtonClicked(0)) {
        TryAddNewListValue()
    }

    const textBoxX = x + 1 + buttonWidth + 8
    const textBoxY = buttonY + 1
    const textBoxWidth = Math.min(boxWidth, Math.max(80, Variables.inputs[option.varname].getWidth() + 8))
    const textBoxHeight = 14
    const isTextBoxHover = Utils.isMouseover(mx, my, textBoxX, textBoxY, textBoxWidth, textBoxHeight)

    if (Variables.inputs[option.varname].isActive) {
        if (Utils.isMouseButtonClicked(0, true) && !isTextBoxHover) {
            Variables.inputs[option.varname].callOnExit()
        }
    } else if (isTextBoxHover) {
        if (Utils.isMouseButtonClicked(0)) {
            Variables.inputs[option.varname].isActive = true
        }
    }

    ZRenderLib.drawRoundedRectRGBA(drawContext, textBoxX - insetSpacing, textBoxY - insetSpacing, textBoxWidth + doubleInsetSpacing, textBoxHeight + doubleInsetSpacing, 4, ...Variables.globalColors.primary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, textBoxX, textBoxY, textBoxWidth, textBoxHeight, 3, ...Variables.globalColors.dark)
    Variables.inputs[option.varname].draw(drawContext, textBoxX + 2, textBoxY + 1, boxWidth, 12)
}
export const drawHud = (drawContext, mx, my, x, y, width, option, mouseOver, lastOpenedGUI) => {
    const buttonWidth = Math.min(64, width)

    // Draw button outline
    ZRenderLib.drawRoundedRectRGBA(drawContext, x + 8 - insetSpacing, y - 14 - insetSpacing, buttonWidth + doubleInsetSpacing, 16 + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)

    // Draw main button
    const buttonText = "Edit HUD"
    let buttonColor = null
    if (Utils.isMouseover(mx, my, x + 8, y - 14, buttonWidth, 16)) {
        buttonColor = Variables.globalColors.light
    } else {
        buttonColor = Variables.globalColors.primary
    }
    ZRenderLib.drawRoundedRectRGBA(drawContext, x + 8, y - 14, buttonWidth, 16, 4, ...buttonColor)
    ZRenderLib.drawGUIStringRGBA(drawContext, buttonText, x + buttonWidth / 2 - (ZRenderLib.getStringWidth(buttonText) / 2) + 8, y + 4 - 14, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 2)

    if (mouseOver && Utils.isMouseButtonClicked(0)) {
        Hud.openHudGui(lastOpenedGUI)
    }
}

export const drawCheckbox = (drawContext, mx, my, x, y, option, mouseOver) => {
    const progress = Utils.lerp(option.progress, option.down ? 1 : 0, option.time, 100)
    const w = Math.max(80, Utils.getLongest(option.options.map(([prettyName, _]) => prettyName)).width + 24)

    // Draw option outline
    ZRenderLib.drawRoundedRectRGBA(drawContext, x - insetSpacing, y - insetSpacing, w + doubleInsetSpacing, 16 * (option.down ? option.options.length + 1 : 1) * (progress || 1) + doubleInsetSpacing, 4, ...Variables.globalColors.tertiary)

    // Draw option outline
    const selectedLabel = option.value.length == 0 ? "None"
        : option.value.length > 1 ? "... (" + option.value.length + ")"
        : option.options.find(([_, varName]) => varName === option.value[0])?.[0] ?? option.value[0]
    let mainFlatCorners = (option.down) ? ZRenderLib.BOTTOM_FLAT_CORNERS : []
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, w, 16, 4, ...Variables.globalColors.primary, mainFlatCorners)
    ZRenderLib.drawGUIStringRGBA(drawContext, selectedLabel, x + 4, y + 4, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
    ZRenderLib.drawGUIStringRGBA(drawContext, option.down ? "▲" : "▼", x + w - 8, y + 4, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

    option.hovered = false
    if (option.down || progress) {
        let ii = 1
        option.options.forEach(([prettyName, varName], i) => {
            let mOver = Utils.isMouseover(mx, my, x, y + ii * 16 * progress, w, 16)
            if (mOver && Utils.isMouseButtonClicked(0)) {
                if (option.value.includes(varName)) {
                    option.value = option.value.filter(opt => opt !== varName)
                } else {
                    option.value.push(varName)
                }
                option.time = Date.now()
                option.progress = 1
                option.changed = true
            }
            if (mOver) {
                option.hovered = true
            }

            // Draw option background
            let hoverColor = null
            if (progress > 0.9 && mOver) {
                hoverColor = Variables.globalColors.light
            } else {
                hoverColor = Variables.globalColors.dark
            }

            let itemFlatCorners = (i == option.options.length - 1) ? ZRenderLib.TOP_FLAT_CORNERS : ZRenderLib.ALL_FLAT_CORNERS
            ZRenderLib.drawRoundedRectRGBA(drawContext, x, y + ii * 16 * progress, w, 16, 4, ...hoverColor, itemFlatCorners)

            // Draw divider line
            ZRenderLib.drawRectRGBA(drawContext, x, y + ii * 16 * progress, w, 1, ...Variables.globalColors.primary)

            // Draw currently selected square
            if (option.value.includes(varName)) {
                ZRenderLib.drawRoundedRectRGBA(drawContext, x + 3, y + 3 + ii * 16 * progress, 10, 10, 3, ...Variables.globalColors.primary)
                ZRenderLib.drawGUIStringRGBA(drawContext, "§l✓", x + 6, y + 3 + ii * 16 * progress, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }

            // Draw option text
            if (progress > 0.9) {
                ZRenderLib.drawGUIStringRGBA(drawContext, prettyName, x + 16, y + 5 + ii * 16 * progress, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
            }
            ii++
        })
    }

    if (mouseOver && Utils.isMouseButtonClicked(0)) {
        option.down = !option.down
        option.time = Date.now()
        option.progress = (option.down ? 0 : 1)
    }
}
