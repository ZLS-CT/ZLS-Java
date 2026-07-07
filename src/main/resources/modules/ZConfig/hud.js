import * as ZRenderLib from "../ZRenderLib"
import * as ZKeys from "modules/ZKeys"

import * as Variables from "./variables"
import * as Utils from "./utils"

let huds = []
let lastSelectedHud = null
let lastOpenedGUI = null
const hudGui = new Gui()
const insetSpacing = 1
const doubleInsetSpacing = insetSpacing * 2

function snapToHudPosition(value, targets, threshold) {
    for (let target of targets) {
        if (Math.abs(value - target) < threshold) {
            return target
        }
    }
    return value
}
function snapToGrid(value, gridSpacing, threshold) {
    const nearest = Math.round(value / gridSpacing) * gridSpacing
    if (Math.abs(value - nearest) < threshold) {
        return nearest
    }
    return value
}

function snapHudPosition(hud, huds, screenWidth, screenHeight, backgroundLineSpacing, snapThreshold) {
    let snapX = hud.x
    let snapY = hud.y
    let snapLines = [[], []]

    for (let hud2 of huds) {
        if (hud2 == hud) continue

        const hudEdgesX = [
            hud2.x,
            hud2.x + hud2.width * hud2.scaleX,
            hud2.x + (hud2.width * hud2.scaleX) / 2
        ]
        const hudEdgesY = [
            hud2.y,
            hud2.y + hud2.height * hud2.scaleY,
            hud2.y + (hud2.height * hud2.scaleY) / 2
        ]
        const edgesX = [
            hud.x,
            hud.x + hud.width * hud.scaleX,
            hud.x + (hud.width * hud.scaleX) / 2
        ]
        const edgesY = [
            hud.y,
            hud.y + hud.height * hud.scaleY,
            hud.y + (hud.height * hud.scaleY) / 2
        ]

        for (let i = 0; i < edgesX.length; i++) {
            const snapped = snapToHudPosition(edgesX[i], hudEdgesX, snapThreshold)
            if (snapped != edgesX[i]) {
                snapX += snapped - edgesX[i]
                snapLines[0].push({
                    x: snapped,
                    y: 0,
                    width: 1,
                    height: screenHeight
                })
                break
            }
        }
        for (let i = 0; i < edgesY.length; i++) {
            const snapped = snapToHudPosition(edgesY[i], hudEdgesY, snapThreshold)
            if (snapped != edgesY[i]) {
                snapY += snapped - edgesY[i]
                snapLines[1].push({
                    x: 0,
                    y: snapped,
                    width: screenWidth,
                    height: 1
                })
                break
            }
        }
    }

    const edgesX = [
        snapX,
        snapX + hud.width * hud.scaleX,
        snapX + (hud.width * hud.scaleX) / 2
    ]
    const edgesY = [
        snapY,
        snapY + hud.height * hud.scaleY,
        snapY + (hud.height * hud.scaleY) / 2
    ]

    for (let i = 0; i < edgesX.length; i++) {
        edgesX[i] = snapToGrid(edgesX[i], backgroundLineSpacing, snapThreshold)
        // snapLines[0].push({
        //     x: edgesX[i],
        //     y: 0,
        //     width: 1,
        //     height: screenHeight
        // })
    }
    for (let i = 0; i < edgesY.length; i++) {
        edgesY[i] = snapToGrid(edgesY[i], backgroundLineSpacing, snapThreshold)
        // snapLines[1].push({
        //     x: 0,
        //     y: edgesY[i],
        //     width: screenWidth,
        //     height: 1
        // })
    }

    hud.x = edgesX[0]
    hud.y = edgesY[0]
    return [snapLines[0][0], snapLines[1][0]]
}

function scaleHudWithSnapping(mx, my, hud, huds, screenWidth, screenHeight, backgroundLineSpacing, snapThreshold, isShiftDown) {
    let newScaleX = (mx - hud.x) / hud.width
    let newScaleY = (my - hud.y) / hud.height
    let snapLines = [[], []]

    let newWidth = hud.width * newScaleX
    let newHeight = hud.height * newScaleY
    if (isShiftDown) {
        const uniform = Math.max(newWidth, newHeight)
        newWidth = uniform
        newHeight = uniform
    }

    newWidth = snapToGrid(hud.x + newWidth, backgroundLineSpacing, snapThreshold) - hud.x
    newHeight = snapToGrid(hud.y + newHeight, backgroundLineSpacing, snapThreshold) - hud.y

    for (let hud2 of huds) {
        if (hud2 == hud) continue

        const hudEdgesX = [
            hud2.x,
            hud2.x + hud2.width * hud2.scaleX,
            hud2.x + (hud2.width * hud2.scaleX) / 2
        ]
        const hudEdgesY = [
            hud2.y,
            hud2.y + hud2.height * hud2.scaleY,
            hud2.y + (hud2.height * hud2.scaleY) / 2
        ]

        const right = hud.x + newWidth
        const bottom = hud.y + newHeight
        for (let edge of hudEdgesX) {
            if (Math.abs(right - edge) < snapThreshold) {
                newWidth = edge - hud.x
                snapLines[0].push({
                    x: edge,
                    y: 0,
                    width: 1,
                    height: screenHeight
                })
                break
            }
        }
        for (let edge of hudEdgesY) {
            if (Math.abs(bottom - edge) < snapThreshold) {
                newHeight = edge - hud.y
                snapLines[1].push({
                    x: 0,
                    y: edge,
                    width: screenWidth,
                    height: 1
                })
                break
            }
        }
    }

    hud.scaleX = newWidth / hud.width
    hud.scaleY = newHeight / hud.height
    return [snapLines[0][0], snapLines[1][0]]
}

function clampHudToScreen(hud, screenWidth, screenHeight) {
    if (hud.x < 0) {
        hud.x = 0
    }
    if (hud.y < 0) {
        hud.y = 0
    }
    if (hud.x + hud.width * hud.scaleX > screenWidth) {
        hud.x = screenWidth - hud.width * hud.scaleX
    }
    if (hud.y + hud.height * hud.scaleY > screenHeight) {
        hud.y = screenHeight - hud.height * hud.scaleY
    }

    if (hud.scaleX < 0.1) {
        hud.scaleX = 0.1
    }
    if (hud.scaleY < 0.1) {
        hud.scaleY = 0.1
    }
}

hudGui.registerDraw((drawContext, mx, my, partialTicks) => {
    [drawContext, mx, my, partialTicks] = ZRenderLib.FixGUIRenderValues(drawContext, mx, my, partialTicks)

    if (!Utils.isMouseButtonDown(0)) {
        Variables.shouldClick = true
    }

    const screenSize = ZRenderLib.getScreenSize()
    const screenWidth = screenSize.width
    const screenHeight = screenSize.height
    const backgroundLineSpacing = 16
    const backgroundLineColor = [255, 255, 255, 50]
    const snapThreshold = 5
    const baseNudgeAmount = 2

    ZRenderLib.drawRectRGBA(drawContext, 0, 0, screenWidth, screenHeight, 0, 0, 0, 100)
    for (let i = 0; i < screenWidth / backgroundLineSpacing; i++) {
        ZRenderLib.drawRectRGBA(drawContext, i * backgroundLineSpacing - 1, 0, 1, screenHeight, ...backgroundLineColor)
    }
    for (let i = 0; i < screenHeight / backgroundLineSpacing; i++) {
        ZRenderLib.drawRectRGBA(drawContext, 0, i * backgroundLineSpacing - 1, screenWidth, 1, ...backgroundLineColor)
    }

    let hoveredHud = null
    for (let hud of huds) {
        let isHovered = false
        const hudWidth = hud.width * hud.scaleX
        const hudHeight = hud.height * hud.scaleY

        // Scale handle
        if (Utils.isMouseover(mx, my, hud.x + hudWidth - 4, hud.y + hudHeight - 4, 8, 8)) {
            ZRenderLib.drawRectRGBA(drawContext, hud.x + hudWidth - 4, hud.y + hudHeight - 4, 8, 8, 255, 255, 255, 255)
            if (Utils.isMouseButtonClicked(0)) {
                hud.scaleClicked = true
                hud.scaleTime = Date.now()
            } else if (!Utils.isMouseButtonDown(0)) {
                hud.scaleClicked = false
            }
        } else {
            ZRenderLib.drawRectRGBA(drawContext, hud.x + hudWidth - 4, hud.y + hudHeight - 4, 8, 8, 255, 255, 255, 150)
        }

        if (Utils.isMouseover(mx, my, hud.x, hud.y, hudWidth, hudHeight)) {
            hoveredHud = hud
            isHovered = true
            if (Utils.isMouseButtonClicked(0)) {
                hud.time = Date.now()
                hud.clicked = true
                hud.offsetX = mx - hud.x
                hud.offsetY = my - hud.y
            }
        }

        let snapLines = []
        if (hud.clicked) {
            if (!Utils.isMouseButtonDown(0)) {
                hud.clicked = false
            }

            hud.x = mx - hud.offsetX
            hud.y = my - hud.offsetY

            if (!ZKeys.isShiftDown()) {
                snapLines.push(...snapHudPosition(hud, huds, screenWidth, screenHeight, backgroundLineSpacing, snapThreshold))
            }
        }
        if (hud.scaleClicked) {
            snapLines.push(...scaleHudWithSnapping(mx, my, hud, huds, screenWidth, screenHeight, backgroundLineSpacing, snapThreshold, ZKeys.isShiftDown()))
        }

        let isSelected = false
        if (hud.clicked || hud.scaleClicked) {
            lastSelectedHud = hud
            isSelected = true
        } else if (hud == lastSelectedHud) {
            isSelected = true
        }
        clampHudToScreen(hud, screenWidth, screenHeight)

        // Draw HUD
        if (hud.onDraw) {
            hud.onDraw(drawContext, hud.title, hud.x, hud.y, hudWidth, hudHeight, hud.scaleX, hud.scaleY, isHovered, isSelected)
        } else {
            ZRenderLib.drawRectRGBA(drawContext, hud.x, hud.y, hudWidth, hudHeight, ...Variables.globalColors.primary.slice(0, 3), isHovered ? 150 : 100)
            ZRenderLib.drawGUIStringRGBA(drawContext, hud.title, hud.x, hud.y, ...Variables.globalColors.text, 1, false, Variables.globalConfig.globalTextShadow, 512, 1)
        }

        // Draw snap lines
        for (let line of snapLines) {
            if (!line) continue
            ZRenderLib.drawRect(drawContext, line.x, line.y, line.width, line.height, ZRenderLib.GREEN)
        }

        let info = ""
        if (hud.clicked) {
            info = `PositionX: ${Math.round(hud.x)}, PositionY: ${Math.round(hud.y)}`
        } else if (hud.scaleClicked) {
            info = `ScaleX: ${hud.scaleX.toFixed(2)}, ScaleY: ${hud.scaleY.toFixed(2)}`
        }

        if (info) {
            ZRenderLib.drawGUIStringRGBA(
                drawContext,
                info,
                hud.x + 4,
                hud.y - 15,
                255, 255, 255, 255,
                2, false,
                Variables.globalConfig.globalTextShadow,
                512, 1
            )
        }
    }

    const hudToNudge = hoveredHud || lastSelectedHud
    if (hudToNudge) {
        let nudgeMultiplier = 1
        if (ZKeys.isCtrlDown()) nudgeMultiplier = 0.25
        if (ZKeys.isAltDown()) nudgeMultiplier = 2
        if (ZKeys.isShiftDown()) nudgeMultiplier = 5
        const nudgeAmount = (baseNudgeAmount * partialTicks) * nudgeMultiplier

        if (ZKeys.isKeyNameDown("KEY_W") || ZKeys.isKeyNameDown("KEY_UP")) hudToNudge.y -= nudgeAmount
        if (ZKeys.isKeyNameDown("KEY_S") || ZKeys.isKeyNameDown("KEY_DOWN")) hudToNudge.y += nudgeAmount
        if (ZKeys.isKeyNameDown("KEY_A") || ZKeys.isKeyNameDown("KEY_LEFT")) hudToNudge.x -= nudgeAmount
        if (ZKeys.isKeyNameDown("KEY_D") || ZKeys.isKeyNameDown("KEY_RIGHT")) hudToNudge.x += nudgeAmount
        clampHudToScreen(hudToNudge, screenWidth, screenHeight)
    }

    // X close button
    const buttonSize = 32
    const buttonPadding = 8
    const buttonX = screenWidth - buttonSize - buttonPadding
    const buttonY = buttonPadding
    let buttonColor = Variables.globalColors.primary
    let closeGUI = false
    if (Utils.isMouseover(mx, my, buttonX, buttonY, buttonSize, buttonSize)) {
        buttonColor = Variables.globalColors.bright
        if (Utils.isMouseButtonClicked(0)) {
            closeGUI = true
        }
    }

    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX - insetSpacing, buttonY - insetSpacing, buttonSize + doubleInsetSpacing, buttonSize + doubleInsetSpacing, 8, ...Variables.globalColors.tertiary)
    ZRenderLib.drawRoundedRectRGBA(drawContext, buttonX, buttonY, buttonSize, buttonSize, 7, ...buttonColor)
    ZRenderLib.drawImageRGBA(drawContext, Variables.backIcon, buttonX + 4, buttonY + 4, buttonSize - buttonPadding, buttonSize - buttonPadding, ...Variables.globalColors.text)
    if (ZKeys.isEscapeDown()) {
        closeGUI = true
    }

    if (closeGUI) {
        if (lastOpenedGUI) {
            lastOpenedGUI.open()
        } else {
            hudGui.close()
        }
    }
})

export const openHudGui = (lastGUI) => {
    lastSelectedHud = null
    lastOpenedGUI = lastGUI
    hudGui.open()
}

export const createHud = (title, x, y, width, height, scaleX, scaleY, onDraw) => {
    const obj = {
        title,
        x,
        y,
        width,
        height,
        scaleX,
        scaleY,
        onDraw,
        isOpen: function() {
            return hudGui.isOpen()
        },
        delete: function() {
            huds = huds.filter(hud => hud !== obj)
        },
    }

    huds.push(obj)
    return obj
}
