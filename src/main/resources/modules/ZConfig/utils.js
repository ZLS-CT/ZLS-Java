import * as ZRenderLib from "../ZRenderLib"
import * as ZKeys from "modules/ZKeys"
import { ChatMessage, StartDelayedCallback, DeleteDelayedCallback, isLegacy, isZJS, isFork } from "modules/ZCore"
import * as Variables from "./variables"

const colorCache = new Map()
const longestStringCache = new Map()
const soundMappings = {
    "gui.button.press": [
        "gui.button.press",
        "minecraft:ui.button.click",
    ],
}

let currentInventory = null
function OnGUIChanged() {
    currentInventory = null
    StartDelayedCallback("onGUIChangedDelay", 100, () => {
        let newInventoryName = Client.currentGui.getClassName()
        if (newInventoryName == "null") return
        currentInventory = newInventoryName
    })
}
register("guiOpened", () => {
    OnGUIChanged()
})
register("guiClosed", () => {
    OnGUIChanged()
})

export const isMouseButtonClicked = (num, stopClick, reset) => {
    if (isMouseButtonDown(num) && (Variables.shouldClick || stopClick)) {
        if (!stopClick && !reset) {
            PlaySound("gui.button.press", 1, 1)
            Variables.shouldClick = false
        }
        return true
    }
    return false
}

export const RemoveFormatting = (text) => {
    if (text == null) return ""
    const str = String(text)
    if (str.trim() === "") return str
    return ChatLib.removeFormatting(str)
}

export const PlaySound = (name, volume = 1, pitch = 1) => {
    let soundMapping = soundMappings[name] ?? [name, name]
    if (isLegacy) {
        World.playSound(soundMapping[0], volume, pitch)
        return
    }

    if (isZJS) {
        new ZSound({
            source: soundMapping[1],
            volume: volume,
            pitch: pitch,
        }).play()
    } else {
        new CTSound({
            source: soundMapping[1],
            volume: volume,
            pitch: pitch,
        }).play()
    }
}

let mouseButtonClicked = {}
register("clicked", (mx, my, mbtn, state) => {
    mouseButtonClicked[mbtn] = state
})
export const isMouseButtonDown = (num) => {
    if (mouseButtonClicked[num] === undefined) {
        mouseButtonClicked[num] = false
    }
    return mouseButtonClicked[num]
}

export const UpdateColorPickerHexCodeText = (option) => {
    if (!option.value) return
    const hexCode = rgbArrayToHex(option.value)
    UpdateInputFieldText(option, hexCode)
    Variables.inputs[option.varname].setRGBA(option.value)
}
export const UpdateInputFieldText = (option, newValue) => {
    if (option.value == null) return
    if (Variables.inputs[option.varname]) {
        Variables.inputs[option.varname].text = `${newValue}`
    }
}
export const rgbToHex = (r, g, b, a = -1) => {
    let list = [r, g, b]
    if (a != -1) {
        list.push(a)
    }
    return ('#' + list.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase())
}
export const rgbArrayToHex = (arr) => {
    return rgbToHex(Math.floor(arr[0]), Math.floor(arr[1]), Math.floor(arr[2]), Math.floor(arr[3]) || -1)
}
export const hexToRgbArray = (hex) => {
    hex = hex.replaceAll("#", "")
    hex = hex.padEnd(8, '0')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const a = parseInt(hex.slice(6, 8), 16)
    return [r, g, b, a]
}
const openUrl = (url) => {
    if (!Desktop.isDesktopSupported()) return
    try {
        Desktop.getDesktop().browse(new URI(url))
    }
    catch (e) {
        Client.currentGui.close()
        ChatMessage("§cFailed to open link: " + url)
    }
}

export const FixGUIRenderValues = (drawContext, mx, my, partialTicks) => {
    if (isLegacy) {
        return [
            null, // drawContext
            drawContext, // mx
            mx, // my
            my, // partialTicks
        ]
    }

    if (isZJS || isFork) {
        return [
            drawContext, // drawContext
            mx, // mx
            my, // my
            partialTicks, // partialTicks
        ]
    }

    // wont run on normal :(
    return [
        null,
        null,
        null,
    ]
}

const markdownCache = new Map()
export const drawMarkdown = (mx, my, x, y, width, option) => {
    if (!isMouseButtonDown(0)) {
        Variables.shouldClick = true
    }

    const cacheKey = `${option.value}-${width}`
    if (markdownCache.has(cacheKey)) {
        var { height, elements } = markdownCache.get(cacheKey)
    } else {
        const parsed = parseMarkdown(option.value, width)
        markdownCache.set(cacheKey, parsed)
        var { height, elements } = parsed
    }

    return {
        height,
        draw: (drawContext) => {
            const colors = Variables.globalColors
            const textShadow = Variables.globalConfig.globalTextShadow
            const primaryColor = colors.primary
            const tertiaryColor = colors.tertiary
            const darkColor = colors.dark
            const { drawGUIStringRGBA, drawGUIString, drawRectRGBA, drawRoundedRectRGBA, getStringWidth } = ZRenderLib
            elements.forEach(element => {
                switch (element.type) {
                    case 'codeBlock':
                        drawRoundedRectRGBA(drawContext, element.outlineX + x, element.outlineY + y, element.outlineW, element.outlineH, 4, ...primaryColor)
                        drawRoundedRectRGBA(drawContext, element.innerX + x, element.innerY + y, element.innerW, element.innerH, 3, ...tertiaryColor)
                        for (let j = 0; j < element.lines.length; j++) {
                            const line = element.lines[j]
                            drawGUIString(drawContext, line.text, line.x + x, line.y + y, line.color, 1, false, textShadow, 512, 1)
                        }
                        break

                    case 'divider':
                        drawRectRGBA(drawContext, element.x + x, element.y + y, element.w, 1, ...colors.primary)
                        break

                    case 'heading':
                        const headingText = applyInlineFormatting(drawContext, element.text, element.x + x, element.y + y, mx, my, darkColor, getStringWidth)
                        drawGUIStringRGBA(drawContext, headingText, element.x + x, element.y + y, ...colors.text, element.scale, false, textShadow, 512, 1)
                        break

                    case 'blockquote':
                        const bqText = applyInlineFormatting(drawContext, element.text, element.textX + x, element.y + y, mx, my, darkColor, getStringWidth)
                        drawGUIStringRGBA(drawContext, element.prefix + bqText, element.x + x, element.y + y, ...colors.bright, 1, false, textShadow, 512, 1)
                        break

                    case 'list':
                        const listText = applyInlineFormatting(drawContext, element.text, element.x + x, element.y + y, mx, my, darkColor, getStringWidth)
                        drawGUIStringRGBA(drawContext, "§6• §r" + listText, element.x + x, element.y + y, ...colors.text, 1, false, textShadow, 512, 1)
                        break

                    case 'centered':
                    case 'text':
                        const text = applyInlineFormatting(drawContext, element.text, element.x + x, element.y + y, mx, my, darkColor, getStringWidth)
                        drawGUIStringRGBA(drawContext, text, element.x + x, element.y + y, ...colors.text, 1, false, textShadow, 512, 1)
                        break
                }
            })
        }
    }
}

function parseMarkdown(content, width) {
    let currentX = 0
    let currentY = 0
    let insideCodeBlock = false
    let codeBlockLines = []
    const elements = []
    const lines = splitIntoLines(content, width)
    const { getStringWidth, YELLOW, WHITE } = ZRenderLib

    for (const line of lines) {
        currentY += 12

        const trimmedLine = line.trim()
        if (trimmedLine.startsWith("```")) {
            if (trimmedLine === "```") {
                currentY -= 12
            } else {
                const codeText = line.replace("```", "")
                currentY += 4
                codeBlockLines.push({
                    text: codeText,
                    x: currentX + 4,
                    y: currentY,
                    width: getStringWidth(codeText),
                    color: YELLOW
                })
            }

            if (insideCodeBlock && codeBlockLines.length > 0) {
                const maxWidth = Math.max(...codeBlockLines.map(l => l.width))
                const totalHeight = codeBlockLines.length * 12
                const padding = 4
                const fx = codeBlockLines[0].x
                const fy = codeBlockLines[0].y

                elements.push({
                    type: 'codeBlock',
                    outlineX: fx - padding - 1,
                    outlineY: fy - padding - 1,
                    outlineW: maxWidth + 10,
                    outlineH: totalHeight + 6,
                    innerX: fx - padding,
                    innerY: fy - padding,
                    innerW: maxWidth + 8,
                    innerH: totalHeight + 4,
                    lines: codeBlockLines.slice()
                })

                currentY += 4
                codeBlockLines = []
            }

            insideCodeBlock = !insideCodeBlock
            continue
        }

        if (insideCodeBlock) {
            codeBlockLines.push({
                text: line,
                x: currentX + 4,
                y: currentY,
                width: getStringWidth(line),
                color: WHITE
            })
            continue
        }

        const centeredMatch = line.match(/^(?:->(.+)<-|:(.+):)$/)
        const isCentered = !!centeredMatch
        const processLine = isCentered ? (centeredMatch[1] || centeredMatch[2]).trim() : line
        const firstChar = processLine.trim()[0]

        // Dividers
        if ((firstChar === '-' || firstChar === '*') && /^[-*]{3,}$/.test(processLine.trim())) {
            currentY -= 8
            elements.push({
                type: 'divider',
                x: currentX,
                y: currentY + 7,
                w: width - 12
            })
            continue
        }

        // Headings
        if (firstChar === '#') {
            const heading = processLine.match(/^(#{1,3}) (.+)/)
            if (heading) {
                const level = heading[1].length
                const headingText = heading[2]
                const headingX = isCentered ? currentX + (width - getStringWidth(headingText) * (1 + level)) / 2 : currentX
                elements.push({
                    type: 'heading',
                    text: headingText,
                    x: headingX,
                    y: currentY,
                    scale: level + 1
                })
                currentY += 8 * level
                continue
            }
        }

        // Blockquotes
        if (firstChar === '>') {
            const blockquote = processLine.match(/^(>+)\s(.+)/)
            if (blockquote) {
                const depth = blockquote[1].length
                const prefix = ("§l|    §r").repeat(depth)
                const bqText = blockquote[2]
                const totalWidth = getStringWidth(prefix + bqText)
                const bqX = isCentered ? currentX + (width - totalWidth) / 2 : currentX
                elements.push({
                    type: 'blockquote',
                    text: bqText,
                    prefix: prefix,
                    x: bqX,
                    textX: bqX + depth * 10,
                    y: currentY
                })
                continue
            }
        }

        // Lists
        if (processLine[0] === ' ' || firstChar === '*') {
            const list = processLine.match(/^(\s*)\* (.+)/)
            if (list) {
                const listText = list[2]
                const indent = list[1].length * 4
                const totalWidth = getStringWidth("• " + listText)
                const listX = isCentered ? currentX + (width - totalWidth) / 2 + indent : currentX + indent
                elements.push({
                    type: 'list',
                    text: listText,
                    x: listX,
                    y: currentY
                })
                continue
            }
        }

        // Centered text
        if (isCentered) {
            const textWidth = getStringWidth(processLine)
            elements.push({
                type: 'centered',
                text: processLine,
                x: currentX + (width - textWidth) / 2,
                y: currentY
            })
            continue
        }

        // Regular text
        elements.push({
            type: 'text',
            text: line,
            x: currentX,
            y: currentY
        })
    }

    return {
        height: currentY,
        elements
    }
}

function applyInlineFormatting(drawContext, paragraph, x, y, mx, my, darkColor, getStringWidth) {
    // Bold: ** or __
    paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, "§l$1§r")
    paragraph = paragraph.replace(/__(.+?)__/g, "§l$1§r")

    // Italics: * or _ (process after bold to avoid conflicts)
    paragraph = paragraph.replace(/\*(.+?)\*/g, "§o$1§r")
    paragraph = paragraph.replace(/_(.+?)_/g, "§o$1§r")

    // Strikethrough: ~~
    paragraph = paragraph.replace(/~~(.+?)~~/g, "§m$1§r")

    // Inline code
    const codeRegex = /`(.+?)`/g
    let match
    while ((match = codeRegex.exec(paragraph)) !== null) {
        const codeText = match[1]
        const codeX = x + getStringWidth(paragraph.slice(0, match.index))

        ZRenderLib.drawRoundedRectRGBA(drawContext, codeX - 2, y - 2, getStringWidth(codeText) + 3, 12, 4, ...darkColor)
        paragraph = paragraph.replace(match[0], "§7" + codeText + "§r")
        codeRegex.lastIndex = match.index + codeText.length
    }

    // Links
    const linkRegex = /\[([^\[\]]+)\]\(([^)]+)\)/g
    let linkMatch

    while ((linkMatch = linkRegex.exec(paragraph)) !== null) {
        const linkText = linkMatch[1]
        const linkUrl = linkMatch[2]
        const linkX = x + getStringWidth(paragraph.slice(0, linkMatch.index))

        if (isMouseover(mx, my, linkX, y, getStringWidth(linkText), 10)) {
            if (isMouseButtonDown(0) && Variables.shouldClick) {
                Variables.shouldClick = false
                openUrl(linkUrl)
            }
        }

        paragraph = paragraph.replace(linkMatch[0], "§9§n" + linkText + "§r")
    }

    return paragraph
}

export const ResetColorPickerFromRGB = (option, rgb) => {
    const [r, g, b, a = 255] = rgb.map(v => Math.max(0, Math.min(255, v)))

    const R = r / 255
    const G = g / 255
    const B = b / 255
    const max = Math.max(R, G, B)
    const min = Math.min(R, G, B)
    const delta = max - min

    let hue = 0
    if (delta !== 0) {
        if (max === R) hue = ((G - B) / delta) % 6
        else if (max === G) hue = (B - R) / delta + 2
        else hue = (R - G) / delta + 4
    }
    hue = (hue + 6) % 6
    const hueSelection = hue / 6
    const saturation = max === 0 ? 0 : delta / max
    const value = max
    const xDiff = 1 - saturation
    const yDiff = value
    const hueColor = getColorFromHueBar(hueSelection * 128, 128)

    option.extraPersistent.hueSelection = hueSelection
    option.extraPersistent.hueColor = [...hueColor]
    option.extraPersistent.value = [...hueColor, a]
    option.extraPersistent.xDif = xDiff
    option.extraPersistent.yDif = yDiff
    option.value = [
        Math.min(255, Math.max(0, option.extraPersistent.value[0] + (255 - option.extraPersistent.value[0]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
        Math.min(255, Math.max(0, option.extraPersistent.value[1] + (255 - option.extraPersistent.value[1]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
        Math.min(255, Math.max(0, option.extraPersistent.value[2] + (255 - option.extraPersistent.value[2]) * option.extraPersistent.xDif)) * option.extraPersistent.yDif,
        a
    ]

    if (Variables.inputs[option.varname]) {
        UpdateColorPickerHexCodeText(option)
    }
}

export const drawHueBar = (drawContext, x, y, width, height) => {
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x                , y, width / 6, height, 255, 0, 0, 255, 255, 255, 0, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x + width / 6 * 1, y, width / 6, height, 255, 255, 0, 255, 0, 255, 0, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x + width / 6 * 2, y, width / 6, height, 0, 255, 0, 255, 0, 255, 255, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x + width / 6 * 3, y, width / 6, height, 0, 255, 255, 255, 0, 0, 255, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x + width / 6 * 4, y, width / 6, height, 0, 0, 255, 255, 255, 0, 255, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
    ZRenderLib.drawSimpleGradientRGBA(drawContext, x + width / 6 * 5, y, width / 6, height, 255, 0, 255, 255, 255, 0, 0, 255, ZRenderLib.GradientDirection.LEFT_TO_RIGHT)
}
export const getColorFromHueBar = (x, totalWidth) => {
    const segmentWidth = totalWidth / 6
    const segmentIndex = Math.floor((x % totalWidth) / segmentWidth)
    const positionInSegment = ((x % totalWidth) % segmentWidth) / segmentWidth
    const colors = [
        [
            [1, 0, 0],
            [1, 1, 0]
        ], // Red → Yellow
        [
            [1, 1, 0],
            [0, 1, 0]
        ], // Yellow → Green
        [
            [0, 1, 0],
            [0, 1, 1]
        ], // Green → Cyan
        [
            [0, 1, 1],
            [0, 0, 1]
        ], // Cyan → Blue
        [
            [0, 0, 1],
            [1, 0, 1]
        ], // Blue → Magenta
        [
            [1, 0, 1],
            [1, 0, 0]
        ] // Magenta → Red
    ]
    const startColor = colors[segmentIndex][0]
    const endColor = colors[segmentIndex][1]
    return [
        (startColor[0] + (endColor[0] - startColor[0]) * positionInSegment) * 255,
        (startColor[1] + (endColor[1] - startColor[1]) * positionInSegment) * 255,
        (startColor[2] + (endColor[2] - startColor[2]) * positionInSegment) * 255,
    ]
}
export const color = (...colors) => {
    const key = colors.join(",")
    if (colorCache.has(key)) {
        return colorCache.get(key)
    }
    const newColor = new Color(...colors.map(c => c / 255))
    colorCache.set(key, newColor)
    return newColor
}
export const getLongest = (strArr) => {
    const key = JSON.stringify(strArr)
    if (longestStringCache.has(key)) {
        return longestStringCache.get(key)
    }

    let longest = {
        str: "",
        width: 0,
    }
    strArr.forEach(str => {
        const width = ZRenderLib.getStringWidth(str)
        if (width <= longest.width) return
        longest = {
            str: str,
            width: width,
        }
    })
    longestStringCache.set(key, longest)
    return longest
}
export const isMouseover = (mx, my, x, y, w, h) => {
    return mx > x && mx < x + w && my > y && my < y + h
}
export const drawHighlight = (drawContext, x, y, w, h) => {
    ZRenderLib.drawRectRGBA(drawContext, x, y, w, h, 255, 0, 0, 155)
}
export const drawRoundOutline = (drawContext, x, y, w, h, outline, color, radius) => {
    ZRenderLib.drawRoundedRectRGBA(drawContext, x, y, w, h, radius, ...outline) // outline
    ZRenderLib.drawRoundedRectRGBA(drawContext, x + 1, y + 1, w - 2, h - 2, radius - 1, ...color) // inner
}
export const drawOutline = (drawContext, x, y, w, h, color, zOffset = 0) => {
    ZRenderLib.drawRect(drawContext, x, y, 1, h, color, zOffset)
    ZRenderLib.drawRect(drawContext, x, y, w, 1, color, zOffset)
    ZRenderLib.drawRect(drawContext, x, y + h, w, 1, color, zOffset)
    ZRenderLib.drawRect(drawContext, x + w, y, 1, h + 1, color, zOffset)
}
export const splitIntoLines = (string, desiredLength) => {
    const paragraphs = string.toString().split(/\r?\n/)
    const lines = []
    for (let paragraph of paragraphs) {
        if (paragraph.trim() === '') {
            lines.push(" ")
            continue
        }
        let words = paragraph.split(" ")
        let currentLine = []
        for (let word of words) {
            if (!currentLine.length) {
                currentLine.push(word)
            }
            else {
                let testLine = [...currentLine, word]
                if (ZRenderLib.getStringWidth(testLine.join(" ")) <= desiredLength) {
                    currentLine.push(word)
                } else {
                    lines.push(currentLine.join(" "))
                    currentLine = [word]
                }
            }
        }
        if (currentLine.length) {
            lines.push(currentLine.join(" "))
        }
    }
    return lines
}
export const drawTooltip = (drawContext, line, x, y, colorArr, opacity) => {
    const height = 10 + 6
    ZRenderLib.drawRoundedRectRGBA(drawContext, x + 2, y - height / 2, ZRenderLib.getStringWidth(line) + 8, height, 4, ...colorArr.slice(0, 3), opacity)
    ZRenderLib.drawGUIStringRGBA(drawContext, line, x + 6, y - 4, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
}
export const lerp = (current, target, startTime, duration) => {
    const elapsedTime = Date.now() - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    if (progress === 0 || progress === 1) {
        return current + progress * (target - current)
    }
    const middlePhase = progress * (2 - progress)
    return Math.round((current + (middlePhase * (target - current))) * 100) / 100
}
export const interpColor = (arr1, arr2, factor) => {
    let result = []
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(arr1[i] + (arr2[i] - arr1[i]) * factor)
    }
    return result
}
export const setAlpha = (arr, opacity) => {
    let result = [arr[0], arr[1], arr[2], arr[3]]
    result[3] = (result[3] ?? 255) * opacity
    return result
}

const letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+', '[', ']', '{', '}', '\\', '|', ';', ':', "'", '"', ',', '.', '<', '>', '/', '?', '_', ' ',
]
const numbers = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'
]
export class TextInput {
    _onGuiKey = []
    _onExit = []
    _onEnter = []
    pointerIndex = 0
    text = ""
    isActive = false
    rgba = [255, 255, 255, 255]
    cursorTicks = 0
    cursorActive = true

    selectedTextColor = [255, 255, 85, 255]
    cursorColors = [
        [220, 220, 220, 255],
        [180, 180, 180, 255]
    ]
    maxCursorTicks = 100
    constructor(placeholderText, useGlobalTextColor, number, password) {
        this.password = password
        this.placeholderText = placeholderText
        this.useGlobalTextColor = useGlobalTextColor
        this.regs = [
            register("guiKey", (char, keyCode, gui, event) => {
                if (!this.isActive) return
                cancel(event)
                switch (keyCode) {
                    case ZKeys.getKeyCode("KEY_ENTER"):
                        this.callOnEnter()
                        break
                    case ZKeys.getKeyCode("KEY_ESCAPE"):
                        this.callOnExit()
                        break
                    case ZKeys.getKeyCode("KEY_BACKSPACE"):
                        if (this.pointerIndex < this.text.length) {
                            this.text = this.text.slice(0, this.text.length - this.pointerIndex - 1) + this.text.slice(this.text.length - this.pointerIndex, this.text.length)
                        }
                        if (ZKeys.isCtrlDown()) {
                            for (let i = this.text.length - 1; i > -1 && this.text[i] !== " "; i--) {
                                this.text = this.text.slice(0, i)
                            }
                        }
                        this.callOnGuiKey()
                        break
                    case ZKeys.getKeyCode("KEY_DELETE"):
                        if (this.pointerIndex > 0) {
                            this.text = this.text.slice(0, this.text.length - this.pointerIndex) + this.text.slice(this.text.length - this.pointerIndex + 1, this.text.length)
                            this.pointerIndex--
                            this.callOnGuiKey()
                        }
                        break
                    case ZKeys.getKeyCode("KEY_LEFT"):
                        if (this.pointerIndex < this.text.length) {
                            this.pointerIndex++
                        }
                        break
                    case ZKeys.getKeyCode("KEY_RIGHT"):
                        if (this.pointerIndex > 0) {
                            this.pointerIndex--
                        }
                        break
                    case ZKeys.getKeyCode("KEY_V"):
                        if (ZKeys.isCtrlDown()) {
                            const copiedText = Client.paste()
                            if (copiedText) {
                                this.text = this.text.slice(0, this.text.length - this.pointerIndex) + copiedText + this.text.slice(this.text.length - this.pointerIndex, this.text.length)
                                this.callOnGuiKey()
                            }
                            return
                        }
                        break
                    case ZKeys.getKeyCode("KEY_SPACE"):
                        char = " "
                    default:
                        break
                }
                if (!number && !letters.includes(RemoveFormatting(char).toLowerCase())) return
                if (number && !numbers.includes(RemoveFormatting(char))) return
                this.text = this.text.slice(0, this.text.length - this.pointerIndex) + ZKeys.getModifiedCharacter(char) + this.text.slice(this.text.length - this.pointerIndex, this.text.length)
                this.callOnGuiKey()
            }),
            register("guiClosed", () => {
                if (!this.isActive) return
                this.callOnExit()
            })
        ]
    }
    draw(drawContext, x, y, w, h) {
        const mx = Client.getMouseX()
        const my = Client.getMouseY()
        const text = (this.password && !this.isActive) ? ("*").repeat((this.text || this.placeholderText).length) : this.text || this.placeholderText || ""
        const newColor = this.isActive || (mx > x - 2 && mx < x + w + 2 && my > y - 2 && my < y + h + 2) ? this.selectedTextColor : (this.useGlobalTextColor ? Variables.globalColors.text : this.rgba)
        if (this.rgba.length == 3) {
            newColor[3] = 255
        }
        ZRenderLib.drawGUIStringRGBA(drawContext, text, x + 2, y + 2, ...newColor, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)

        if (!this.isActive) return
        this.cursorTicks++
        if (this.cursorTicks >= this.maxCursorTicks) {
            this.cursorTicks = 0
            this.cursorActive = !this.cursorActive
        }
        const width = ZRenderLib.getStringWidth(this.text.slice(0, this.text.length - this.pointerIndex))
        ZRenderLib.drawRectRGBA(drawContext, x + width + 1, y + 1, 1, 10, ...(this.cursorActive ? this.cursorColors[0] : this.cursorColors[1]), 2)
    }
    getWidth() {
        const text = this.text || this.placeholderText || ""
        return ZRenderLib.getStringWidth(text)
    }
    setRGBA(rgba) {
        this.rgba = rgba
    }
    onGuiKey(cb) {
        this._onGuiKey.push(cb)
    }
    callOnGuiKey() {
        if (!this.isActive) return
        this._onGuiKey.forEach(cb => cb(this.text))
    }
    onExit(cb) {
        this._onExit.push(cb)
    }
    callOnExit() {
        if (!this.isActive) return
        this.isActive = false
        this._onExit.forEach(cb => cb(this.text))
    }
    onEnter(cb) {
        this._onEnter.push(cb)
    }
    callOnEnter() {
        if (!this.isActive) return
        this.isActive = false
        this._onEnter.forEach(cb => cb(this.text))
    }
    deconstruct() {
        this.regs.forEach(reg => reg.unregister())
        this._onGuiKey = []
        this._onExit = []
    }
}
export class KeybindInput {
    _onChanged = []
    isActive = false
    ignoreUntilRelease = false
    keyName = "NONE"
    keyCode = null
    modifiers = {
        ctrl: false,
        alt: false,
        shift: false,
    }
    isMouseKey = false
    pendingModifierKey = null
    modifierTimeout = null
    modifierDelayID = `keybind_modifier_${Math.random()}`

    constructor(
        placeholderKeyName,
        keyName,
        isMouseKey,
        modifiers,
        activateInMenus,
        onPressCallback,
    ) {
        this.placeholderKeyName = placeholderKeyName
        this.keyName = keyName
        this.keyCode = ZKeys.getKeyCode(this.keyName)
        this.isMouseKey = isMouseKey
        this.modifiers = modifiers
        this.activateInMenus = activateInMenus
        this.updateText()
        this.keyPressed = false
        this.onPressCallback = onPressCallback
        this.regs = [
            register("guiKey", (_, keyCode, __, event) => {
                if (!this.isActive) return
                if (keyCode == ZKeys.getKeyCode("KEY_ESCAPE")) {
                    this.clearModifierDelay()
                    this.reset("KEY_NONE")
                    cancel(event)
                    PlaySound("gui.button.press", 1, 1)
                    return
                }

                if (ZKeys.isModifierKeyCode(keyCode)) {
                    this.pendingModifierKey = { keyCode }
                    StartDelayedCallback(this.modifierDelayID, 250, () => {
                        if (this.pendingModifierKey && this.isActive) {
                            this.keyCode = this.pendingModifierKey.keyCode
                            this.keyName = ZKeys.getKeyName(this.keyCode)
                            this.isMouseKey = false
                            this.modifiers = { ctrl: false, alt: false, shift: false }
                            this.ignoreUntilRelease = true
                            this.pendingModifierKey = null
                            this.updateText()
                            this.callOnChanged()
                            PlaySound("gui.button.press", 1, 1)
                        }
                    })
                    return
                }

                if (this.pendingModifierKey) {
                    this.clearModifierDelay()
                    this.pendingModifierKey = null
                }

                this.keyCode = keyCode
                this.keyName = ZKeys.getKeyName(this.keyCode)
                this.isMouseKey = false
                this.modifiers = {
                    ctrl: ZKeys.isCtrlDown(),
                    alt: ZKeys.isAltDown(),
                    shift: ZKeys.isShiftDown(),
                }
                this.ignoreUntilRelease = true
                this.updateText()
                this.callOnChanged()
                PlaySound("gui.button.press", 1, 1)
            }),
            register("guiMouseClick", (mx, my, mb, _, event) => {
                if (!this.isActive) return
                if (mb == 0) return

                this.clearModifierDelay()
                this.pendingModifierKey = null
                this.keyCode = mb - 100
                this.keyName = ZKeys.getKeyName(this.keyCode)
                this.isMouseKey = true
                this.modifiers = {
                    ctrl: ZKeys.isCtrlDown(),
                    alt: ZKeys.isAltDown(),
                    shift: ZKeys.isShiftDown(),
                }
                this.ignoreUntilRelease = true
                PlaySound("gui.button.press", 1, 1)
                this.updateText()
                this.callOnChanged()
                if (isLegacy) {
                    cancel(event)
                }
            }),
            register("guiClosed", () => {
                if (this.isActive) {
                    this.clearModifierDelay()
                    this.callOnChanged()
                }
            }),
            register("tick", () => {
                if (this.isActive) return
                if (this.keyName == "KEY_NONE") return
                if (this.onPressCallback == null) return
                if (!this.activateInMenus && currentInventory != null) return

                if (this.ignoreUntilRelease) {
                    const notPressed = (this.isMouseKey) ? (!isMouseButtonDown(this.keyCode + 100)) : (!ZKeys.isKeyCodeDown(this.keyCode))
                    if (notPressed) {
                        this.ignoreUntilRelease = false
                    }
                    return
                }

                const isStandaloneModifier = ZKeys.isModifierKeyCode(this.keyCode)
                const pressed = (this.isMouseKey) ? (isMouseButtonDown(this.keyCode + 100)) : (ZKeys.isKeyCodeDown(this.keyCode))
                const shouldTrigger = isStandaloneModifier ? pressed : pressed && this.checkModifiers()

                if (shouldTrigger) {
                    if (!this.keyPressed) {
                        this.keyPressed = true
                        this.onPressCallback()
                    }
                } else {
                    this.keyPressed = false
                }
            })
        ]
    }
    updateText() {
        this.text = ZKeys.GetKeyComboName(this.keyName, this.modifiers)
    }
    checkModifiers() {
        let ctrlDown = this.modifiers.ctrl == ZKeys.isCtrlDown()
        let altDown = this.modifiers.alt == ZKeys.isAltDown()
        let shiftDown = this.modifiers.shift == ZKeys.isShiftDown()
        return (
            (this.modifiers.ctrl ? ctrlDown : true) &&
            (this.modifiers.alt ? altDown : true) &&
            (this.modifiers.shift ? shiftDown : true)
        )
    }
    clearModifierDelay() {
        DeleteDelayedCallback(this.modifierDelayID)
        this.pendingModifierKey = null
    }
    getWidth() {
        let text = this.text || "NONE"
        if (this.isActive) {
            text = "> " + text + " <"
        }
        return ZRenderLib.getStringWidth(text)
    }
    draw(drawContext, x, y) {
        ZRenderLib.drawGUIStringRGBA(drawContext, this.isActive ? "> " + this.text + " <" : this.text, x + 2, y + 2, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
    }
    onChanged(cb) {
        this._onChanged.push(cb)
    }
    callOnChanged() {
        if (!this.isActive) return
        this.isActive = false
        this._onChanged.forEach(cb => cb(this.keyName, this.isMouseKey, this.modifiers))
    }
    reset(newKeyName = null) {
        this.clearModifierDelay()
        this.keyName = newKeyName ?? this.placeholderKeyName
        this.keyCode = ZKeys.getKeyCode(this.keyName)
        this.isMouseKey = false
        this.modifiers = {
            ctrl: false,
            alt: false,
            shift: false,
        }
        this.ignoreUntilRelease = true
        this.keyPressed = false
        this.pendingModifierKey = null
        this.updateText()
        this.callOnChanged()
    }
}
