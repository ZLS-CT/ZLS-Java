import * as ZCoreCore from "../ZCore/core"

const JavaClass = Java.type("java.lang.Class")
const tryGetJavaType = (path) => {
    const javaType = Java.type(path)
    if (!(javaType?.["class"] instanceof JavaClass)) throw new Error(`Java type ${path} not found.`)
    return javaType
}

const ZRenderUtils = tryGetJavaType("com.zephy.zjs.api.render.RenderUtils")
const ZWorldRenderer = tryGetJavaType("com.zephy.zjs.api.render.WorldRenderer").INSTANCE
const ZGUIRenderer = tryGetJavaType("com.zephy.zjs.api.render.GUIRenderer").INSTANCE
const ZImage = tryGetJavaType("com.zephy.zjs.api.render.Image")

const maxImageDrawAttempts = 100
const stringWidthCache = new Map()

export const GetRenderUtils = () => {
    return ZRenderUtils
}
export const GetWorldRenderer = () => {
    return ZWorldRenderer
}
export const GetGUIRenderer = () => {
    return ZGUIRenderer
}
export const GetImage = () => {
    return ZImage
}
export const GetScreen = () => {
    return ZRenderUtils.screen
}

let matrixStackReflectionField = null
let matrixStackReflectionInstance = null
if (!ZCoreCore.isLegacy) {
    try {
        let clazz = null
        let instance = null
        if (ZCoreCore.isZJS) {
            clazz = Class.forName("com.zephy.zjs.api.render.RenderUtils")
            instance = clazz.getField("INSTANCE").get(null)
        } else if (ZCoreCore.isFork) {
            clazz = Class.forName("com.chattriggers.ctjs.api.render.RenderUtils")
            instance = clazz.getField("INSTANCE").get(null)
        } else {
            clazz = Class.forName("com.chattriggers.ctjs.api.render.Renderer")
            instance = clazz.getField("INSTANCE").get(null)
        }

        const field = clazz.getDeclaredField("matrixStack")
        field.setAccessible(true)

        matrixStackReflectionField = field
        matrixStackReflectionInstance = instance
    } catch (e) {
        ChatLib.chat("Couldn't load matrixStack reflection values.")
    }
}

const applyMatrixStack = () => {
    if (ZCoreCore.isLegacy) return
    let matrixStack = null
    try {
        matrixStack = matrixStackReflectionField?.get(matrixStackReflectionInstance)
        if (matrixStack != null) {
            ZRenderUtils.setMatrixStack(matrixStack)
        }
    } catch (e) {
        try {
            if (matrixStack != null) {
                ZRenderUtils.setMatrixStack(matrixStack.toMC())
            }
        } catch (e) {
            ChatLib.chat(`Couldn't set matrixStack values. | ${e} | ${e.stack}`)
        }
    }
}
const CallAndApplyValues = (args, func, type) => {
    if (ZCoreCore.isLegacy && type == RenderType.GUI) {
        args = args.slice(1)
    }

    applyMatrixStack()
    func(args)
}
export const FixGUIRenderValues = (drawContext, event) => {
    if (ZCoreCore.isLegacy) {
        return [
            null, // drawContext,
            drawContext, // event
            drawContext.partialTicks, // partialTicks
        ]
    }

    if (ZCoreCore.isZJS || ZCoreCore.isFork) {
        return [
            drawContext, // drawContext,
            null, // event,
            event, // partialTicks
        ]
    }
    return [
        drawContext, // drawContext,
        null, // event,
        null, // partialTicks
    ]
}

export const GradientDirection = {
    TOP_TO_BOTTOM: ZRenderUtils.GradientDirection.TOP_TO_BOTTOM,
    BOTTOM_TO_TOP: ZRenderUtils.GradientDirection.BOTTOM_TO_TOP,
    LEFT_TO_RIGHT: ZRenderUtils.GradientDirection.LEFT_TO_RIGHT,
    RIGHT_TO_LEFT: ZRenderUtils.GradientDirection.RIGHT_TO_LEFT,
    TOP_LEFT_TO_BOTTOM_RIGHT: ZRenderUtils.GradientDirection.TOP_LEFT_TO_BOTTOM_RIGHT,
    TOP_RIGHT_TO_BOTTOM_LEFT: ZRenderUtils.GradientDirection.TOP_RIGHT_TO_BOTTOM_LEFT,
    BOTTOM_LEFT_TO_TOP_RIGHT: ZRenderUtils.GradientDirection.BOTTOM_LEFT_TO_TOP_RIGHT,
    BOTTOM_RIGHT_TO_TOP_LEFT: ZRenderUtils.GradientDirection.BOTTOM_RIGHT_TO_TOP_LEFT,
}
export const FlattenRoundedRectCorner = {
    TOP_LEFT: ZRenderUtils.FlattenRoundedRectCorner.TOP_LEFT,
    TOP_RIGHT: ZRenderUtils.FlattenRoundedRectCorner.TOP_RIGHT,
    BOTTOM_LEFT: ZRenderUtils.FlattenRoundedRectCorner.BOTTOM_LEFT,
    BOTTOM_RIGHT: ZRenderUtils.FlattenRoundedRectCorner.BOTTOM_RIGHT,
}
export const TOP_FLAT_CORNERS = [
    FlattenRoundedRectCorner.TOP_LEFT,
    FlattenRoundedRectCorner.TOP_RIGHT,
]
export const BOTTOM_FLAT_CORNERS = [
    FlattenRoundedRectCorner.BOTTOM_LEFT,
    FlattenRoundedRectCorner.BOTTOM_RIGHT,
]
export const LEFT_FLAT_CORNERS = [
    FlattenRoundedRectCorner.TOP_LEFT,
    FlattenRoundedRectCorner.BOTTOM_LEFT,
]
export const RIGHT_FLAT_CORNERS = [
    FlattenRoundedRectCorner.TOP_RIGHT,
    FlattenRoundedRectCorner.BOTTOM_RIGHT,
]
export const ALL_FLAT_CORNERS = [
    FlattenRoundedRectCorner.TOP_LEFT,
    FlattenRoundedRectCorner.TOP_RIGHT,
    FlattenRoundedRectCorner.BOTTOM_LEFT,
    FlattenRoundedRectCorner.BOTTOM_RIGHT,
]
export const RenderType = {
    WORLD: 0,
    GUI: 1,
}
export const getScreenSize = () => {
    const screen = GetScreen()
    return {
        width: screen.getWidth(),
        height: screen.getHeight(),
    }
}
export const getGUIScale = () => {
    return GetScreen().getScale()
}

// RenderUtils
export const BLACK = ZRenderUtils.BLACK
export const DARK_BLUE = ZRenderUtils.DARK_BLUE
export const DARK_GREEN = ZRenderUtils.DARK_GREEN
export const DARK_AQUA = ZRenderUtils.DARK_AQUA
export const DARK_RED = ZRenderUtils.DARK_RED
export const DARK_PURPLE = ZRenderUtils.DARK_PURPLE
export const GOLD = ZRenderUtils.GOLD
export const LIGHT_GRAY = ZRenderUtils.GRAY
export const DARK_GRAY = ZRenderUtils.DARK_GRAY
export const BLUE = ZRenderUtils.BLUE
export const GREEN = ZRenderUtils.GREEN
export const AQUA = ZRenderUtils.AQUA
export const RED = ZRenderUtils.RED
export const LIGHT_PURPLE = ZRenderUtils.LIGHT_PURPLE
export const YELLOW = ZRenderUtils.YELLOW
export const WHITE = ZRenderUtils.WHITE
export const getRGBAColorList0_1 = (color) => ZRenderUtils.RGBAColor.fromLongRGBA(color).getRGBA()
export const getRGBAColorList255 = (color) => ZRenderUtils.RGBAColor.fromLongRGBA(color).getIntComponentsRGBA()
export const getRGBAColor = (r, g, b, a) => new ZRenderUtils.RGBAColor(r, g, b, a)
export const getARGBColor = (a, r, g, b) => new ZRenderUtils.ARGBColor(a, r, g, b)
export const getRGBAColorFromHex = (hex) => new ZRenderUtils.RGBAColor.fromHex(hex)
export const getARGBColorFromHex = (hex) => new ZRenderUtils.ARGBColor.fromHex(hex)
export const getStringWidth = (text) => {
    if (text == null) return 0
    if (stringWidthCache.has(text)) return stringWidthCache.get(text)
    const stringWidth = ZRenderUtils.getStringWidth(text)
    stringWidthCache.set(text, stringWidth)
    return stringWidth
}
export const calculateCenter = (x1, y1, z1, x2, y2, z2) => {
    const centerObject = ZRenderUtils.calculateCenter(x1, y1, z1, x2, y2, z2)
    return {
        centerX: centerObject.cx,
        centerY: centerObject.cy,
        centerZ: centerObject.cz,
        sizeX: centerObject.wx,
        sizeY: centerObject.h,
        sizeZ: centerObject.wz,
    }
}
export const isVisible = (x, y, z) => {
    if (ZCoreCore.isLegacy) throw new Error("isVisible is not supported in legacy.")
    return ZRenderUtils.isVisible(x, y, z)
}
export const splitText = (text, maxWidth) => {
    return ZRenderUtils.splitText(text, maxWidth)
}
export const enableScaledScissor = (drawContext, x, y, width, height) => {
    const screen = GetScreen()
    const screenHeight = screen.getHeight()
    const screenScale = 2
    enableScissor(drawContext, x * screenScale, (screenHeight - (y + height)) * screenScale, width * screenScale, height * screenScale)
}
export const enableScissor = (drawContext, x, y, width, height) => {
    let args = [drawContext, x, y, width, height]
    if (ZCoreCore.gameVersion <= 12105) {
        args = args.slice(1)
    }
    ZRenderUtils.enableScissor(...args)
}
export const disableScissor = (drawContext) => {
    let args = [drawContext]
    if (ZCoreCore.gameVersion <= 12105) {
        args = []
    }
    ZRenderUtils.disableScissor(...args)
}

// WorldRenderer
export const drawWorldStringRGBA = (text, x, y, z, r = 255, g = 255, b = 255, a = 255, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    if (!text) return
    const args = [text, x, y, z, r, g, b, a, scale, renderBackground, centered, textShadow, disableDepth, maxWidth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawStringRGBA(...newArgs), RenderType.WORLD)
}
export const drawWorldString = (text, x, y, z, color = WHITE, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [text, x, y, z, color, scale, renderBackground, centered, textShadow, disableDepth, maxWidth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawString(...newArgs), RenderType.WORLD)
}
export const drawWorldTextRGBA = (text, x, y, z, r = 255, g = 255, b = 255, a = 255, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    if (!text) return
    const args = [text, x, y, z, r, g, b, a, scale, renderBackground, centered, textShadow, disableDepth, maxWidth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawTextRGBA(...newArgs), RenderType.WORLD)
}
export const drawWorldText = (text, x, y, z, color = WHITE, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [text, x, y, z, color, scale, renderBackground, centered, textShadow, disableDepth, maxWidth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawText(...newArgs), RenderType.WORLD)
}
export const drawWorldLineRGBA = (startX, startY, startZ, endX, endY, endZ, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [startX, startY, startZ, endX, endY, endZ, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawLineRGBA(...newArgs), RenderType.WORLD)
}
export const drawWorldLine = (startX, startY, startZ, endX, endY, endZ, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [startX, startY, startZ, endX, endY, endZ, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawLine(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeCubeRGBA = (x, y, z, size = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, size, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeCubeRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeCube = (x, y, z, size = 1, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, size, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeCube(...newArgs), RenderType.WORLD)
}
export const drawWireframeBoxRGBA = (x, y, z, width = 1, height = 1, depth = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, width, height, depth, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeBoxRGBA(...newArgs), RenderType.WORLD)
}
export const drawWireframeBox = (x, y, z, width = 1, height = 1, depth = 1, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, width, height, depth, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeBox(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidCubeRGBA = (x, y, z, size = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false) => {
    const args = [x, y, z, size, r, g, b, a, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidCubeRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidCube = (x, y, z, size = 1, color = WHITE, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, size, color, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidCube(...newArgs), RenderType.WORLD)
}
export const drawSolidBoxRGBA = (x, y, z, width = 1, height = 1, depth = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false) => {
    const args = [x, y, z, width, height, depth, r, g, b, a, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidBoxRGBA(...newArgs), RenderType.WORLD)
}
export const drawSolidBox = (x, y, z, width = 1, height = 1, depth = 1, color = WHITE, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, width, height, depth, color, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidBox(...newArgs), RenderType.WORLD)
}
export const drawBoxRGBA = (x, y, z, width = 1, height = 1, depth = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, width, height, depth, r, g, b, a, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawBoxRGBA(...newArgs), RenderType.WORLD)
}
export const drawBox = (x, y, z, width = 1, height = 1, depth = 1, color = WHITE, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, width, height, depth, color, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawBox(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidSphereRGBA = (x, y, z, radius = 1, r = 255, g = 255, b = 255, a = 255, segments = 32, disableDepth = false) => {
    const args = [x, y, z, radius, r, g, b, a, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidSphereRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidSphere = (x, y, z, radius = 1, color = WHITE, segments = 32, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, color, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidSphere(...newArgs), RenderType.WORLD)
}
export const drawSolidSphereRGBA = (x, y, z, xScale = 1, yScale = 1, zScale = 1, r = 255, g = 255, b = 255, a = 255, segments = 32, disableDepth = false) => {
    const args = [x, y, z, xScale, yScale, zScale, r, g, b, a, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidSphereRGBA(...newArgs), RenderType.WORLD)
}
export const drawSolidSphere = (x, y, z, xScale = 1, yScale = 1, zScale = 1, color = WHITE, segments = 32, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xScale, yScale, zScale, color, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidSphere(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeSphereRGBA = (x, y, z, radius = 1, r = 255, g = 255, b = 255, a = 255, segments = 32, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, radius, r, g, b, a, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeSphereRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeSphere = (x, y, z, radius = 1, color = WHITE, segments = 32, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, color, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeSphere(...newArgs), RenderType.WORLD)
}
export const drawWireframeSphereRGBA = (x, y, z, xRadius = 1, yRadius = 1, zRadius = 1, r = 255, g = 255, b = 255, a = 255, segments = 32, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, xRadius, yRadius, zRadius, r, g, b, a, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeSphereRGBA(...newArgs), RenderType.WORLD)
}
export const drawWireframeSphere = (x, y, z, xRadius = 1, yRadius = 1, zRadius = 1, color = WHITE, segments = 32, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xRadius, yRadius, zRadius, color, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeSphere(...newArgs), RenderType.WORLD)
}
export const drawSphereRGBA = (x, y, z, xRadius = 1, yRadius = 1, zRadius = 1, r = 255, g = 255, b = 255, a = 255, segments = 32, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, xRadius, yRadius, zRadius, r, g, b, a, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSphereRGBA(...newArgs), RenderType.WORLD)
}
export const drawSphere = (x, y, z, xRadius = 1, yRadius = 1, zRadius = 1, color = WHITE, segments = 32, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xRadius, yRadius, zRadius, color, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSphere(...newArgs), RenderType.WORLD)
}
export const drawSolidConeRGBA = (x, y, z, radius = 1, height = 1, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidConeRGBA(...newArgs), RenderType.WORLD)
}
export const drawSolidCone = (x, y, z, radius = 1, height = 1, color = WHITE, segments = 64, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidCone(...newArgs), RenderType.WORLD)
}
export const drawWireframeConeRGBA = (x, y, z, radius = 1, height = 1, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeConeRGBA(...newArgs), RenderType.WORLD)
}
export const drawWireframeCone = (x, y, z, radius = 1, height = 1, color = WHITE, segments = 64, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeCone(...newArgs), RenderType.WORLD)
}
export const drawConeRGBA = (x, y, z, radius = 1, height = 1, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawConeRGBA(...newArgs), RenderType.WORLD)
}
export const drawCone = (x, y, z, radius = 1, height = 1, color = WHITE, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawCone(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidCylinderRGBA = (x, y, z, radius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidCylinderRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidCylinder = (x, y, z, radius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidCylinder(...newArgs), RenderType.WORLD)
}
export const drawSolidCylinderRGBA = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false) => {
    const args = [x, y, z, topRadius, bottomRadius, height, r, g, b, a, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidCylinderRGBA(...newArgs), RenderType.WORLD)
}
export const drawSolidCylinder = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, topRadius, bottomRadius, height, color, segments, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidCylinder(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeCylinderRGBA = (x, y, z, radius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeCylinderRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframeCylinder = (x, y, z, radius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframeCylinder(...newArgs), RenderType.WORLD)
}
export const drawWireframeCylinderRGBA = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, topRadius, bottomRadius, height, r, g, b, a, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeCylinderRGBA(...newArgs), RenderType.WORLD)
}
export const drawWireframeCylinder = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, topRadius, bottomRadius, height, color, segments, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframeCylinder(...newArgs), RenderType.WORLD)
}
export const drawSimpleCylinderRGBA = (x, y, z, radius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, radius, height, r, g, b, a, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleCylinder(...newArgs), RenderType.WORLD)
}
export const drawSimpleCylinder = (x, y, z, radius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, radius, height, color, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleCylinder(...newArgs), RenderType.WORLD)
}
export const drawCylinderRGBA = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, r = 255, g = 255, b = 255, a = 255, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, topRadius, bottomRadius, height, r, g, b, a, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawCylinderRGBA(...newArgs), RenderType.WORLD)
}
export const drawCylinder = (x, y, z, topRadius = 1, bottomRadius = 1, height = 2, color = WHITE, segments = 64, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, topRadius, bottomRadius, height, color, segments, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawCylinder(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidPyramidRGBA = (x, y, z, size = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false) => {
    const args = [x, y, z, size, r, g, b, a, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidPyramidRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleSolidPyramid = (x, y, z, size = 1, color = WHITE, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, size, color, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleSolidPyramid(...newArgs), RenderType.WORLD)
}
export const drawSolidPyramidRGBA = (x, y, z, xScale = 1, yScale = 1, zScale = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false) => {
    const args = [x, y, z, xScale, yScale, zScale, r, g, b, a, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidPyramidRGBA(...newArgs), RenderType.WORLD)
}
export const drawSolidPyramid = (x, y, z, xScale = 1, yScale = 1, zScale = 1, color = WHITE, disableDepth = false) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xScale, yScale, zScale, color, disableDepth]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSolidPyramid(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframePyramidRGBA = (x, y, z, size = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, size, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframePyramidRGBA(...newArgs), RenderType.WORLD)
}
export const drawSimpleWireframePyramid = (x, y, z, size = 1, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, size, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawSimpleWireframePyramid(...newArgs), RenderType.WORLD)
}
export const drawWireframePyramidRGBA = (x, y, z, xScale = 1, yScale = 1, zScale = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [x, y, z, xScale, yScale, zScale, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframePyramidRGBA(...newArgs), RenderType.WORLD)
}
export const drawWireframePyramid = (x, y, z, xScale = 1, yScale = 1, zScale = 1, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xScale, yScale, zScale, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawWireframePyramid(...newArgs), RenderType.WORLD)
}
export const drawPyramidRGBA = (x, y, z, xScale = 1, yScale = 1, zScale = 1, r = 255, g = 255, b = 255, a = 255, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const args = [x, y, z, xScale, yScale, zScale, r, g, b, a, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawPyramidRGBA(...newArgs), RenderType.WORLD)
}
export const drawPyramid = (x, y, z, xScale = 1, yScale = 1, zScale = 1, color = WHITE, disableDepth = false, wireframe = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [x, y, z, xScale, yScale, zScale, color, disableDepth, wireframe, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawPyramid(...newArgs), RenderType.WORLD)
}
export const drawTracerRGBA = (partialTicks, x, y, z, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const args = [partialTicks, x, y, z, r, g, b, a, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawTracerRGBA(...newArgs), RenderType.WORLD)
}
export const drawTracer = (partialTicks, x, y, z, color = WHITE, disableDepth = false, lineThickness = 1) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [partialTicks, x, y, z, color, disableDepth, lineThickness]
    CallAndApplyValues(args, (newArgs) => ZWorldRenderer.drawTracer(...newArgs), RenderType.WORLD)
}
export const GetEntityInterpolatedPosition = (partialTicks, entity) => {
    const renderTicks = (ZCoreCore.isLegacy) ? partialTicks : Client.getMinecraft().deltaTracker.getGameTimeDeltaPartialTick(true)
    const lastX = entity.getLastX()
    const lastY = entity.getLastY()
    const lastZ = entity.getLastZ()
    return {
        x: lastX + (entity.getX() - lastX) * renderTicks,
        y: lastY + (entity.getY() - lastY) * renderTicks,
        z: lastZ + (entity.getZ() - lastZ) * renderTicks,
    }
}
export const drawEntityNametagRGBA = (partialTicks, entity, r = 255, g = 255, b = 255, a = 255, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    const color = getRGBAColor(r, g, b, a).getLong()
    drawEntityNametag(partialTicks, entity, color, scale, renderBackground, centered, textShadow, disableDepth, maxWidth)
}
export const drawEntityNametag = (partialTicks, entity, color = WHITE, scale = 1, renderBackground = false, centered = false, textShadow = true, disableDepth = false, maxWidth = 512) => {
    const { x, y, z } = GetEntityInterpolatedPosition(partialTicks, entity)
    drawWorldString(
        entity.getName(),
        x,
        y + entity.getHeight() + 0.5,
        z,
        color,
        scale,
        renderBackground,
        centered,
        textShadow,
        disableDepth,
        maxWidth,
    )
}
export const drawEntityTracerRGBA = (partialTicks, entity, r = 255, g = 255, b = 255, a = 255, disableDepth = false, lineThickness = 1) => {
    const color = getRGBAColor(r, g, b, a).getLong()
    drawEntityTracer(partialTicks, entity, color, disableDepth, lineThickness)
}
export const drawEntityTracer = (partialTicks, entity, color = WHITE, disableDepth = false, lineThickness = 1) => {
    const { x, y, z } = GetEntityInterpolatedPosition(partialTicks, entity)
    const height = entity.getHeight()
    if (!disableDepth && !isVisible(x, y + height, z)) return
    drawTracer(
        partialTicks,
        x,
        y + height / 2,
        z,
        color,
        disableDepth,
        lineThickness,
    )
}
export const drawEntityBoxRGBA = (partialTicks, entity, r = 255, g = 255, b = 255, a = 255, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const color = getRGBAColor(r, g, b, a).getLong()
    drawEntityBox(partialTicks, entity, color, disableDepth, wireframe, lineThickness)
}
export const drawEntityBox = (partialTicks, entity, color = WHITE, disableDepth = false, wireframe = false, lineThickness = 1) => {
    const { x, y, z } = GetEntityInterpolatedPosition(partialTicks, entity)
    let newY = y
    if (ZCoreCore.isLegacy) {
        newY -= 0.4
    }
    const width = entity.getWidth() * 1.25
    const height = entity.getHeight()
    drawBox(
        x,
        newY + height / 2,
        z,
        width,
        height,
        width,
        color,
        disableDepth,
        wireframe,
        lineThickness,
    )
}

// GUIRenderer
export const drawGUIStringWithShadowRGBA = (drawContext, text, x, y, r = 255, g = 255, b = 255, a = 255, textScale = 1, renderBackground = false, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    const args = [drawContext, text, x, y, r, g, b, a, textScale, renderBackground, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawStringWithShadowRGBA(...newArgs), RenderType.GUI)
}
export const drawGUIStringWithShadow = (drawContext, text, x, y, color = WHITE, textScale = 1, renderBackground = false, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, text, x, y, color, textScale, renderBackground, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawStringWithShadow(...newArgs), RenderType.GUI)
}
export const drawGUIStringRGBA = (drawContext, text, x, y, r = 255, g = 255, b = 255, a = 255, textScale = 1, renderBackground = false, textShadow = true, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    const args = [drawContext, text, x, y, r, g, b, a, textScale, renderBackground, textShadow, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawStringRGBA(...newArgs), RenderType.GUI)
}
export const drawGUIString = (drawContext, text, x, y, color = WHITE, textScale = 1, renderBackground = false, textShadow = true, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, text, x, y, color, textScale, renderBackground, textShadow, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawString(...newArgs), RenderType.GUI)
}
export const drawGUITextWithShadowRGBA = (drawContext, text, x, y, r = 255, g = 255, b = 255, a = 255, textScale = 1, renderBackground = false, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    const args = [drawContext, text, x, y, r, g, b, a, textScale, renderBackground, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawTextWithShadowRGBA(...newArgs), RenderType.GUI)
}
export const drawGUITextWithShadow = (drawContext, text, x, y, color = WHITE, textScale = 1, renderBackground = false, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, text, x, y, color, textScale, renderBackground, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawTextWithShadow(...newArgs), RenderType.GUI)
}
export const drawGUITextRGBA = (drawContext, text, x, y, r = 255, g = 255, b = 255, a = 255, textScale = 1, renderBackground = false, textShadow = true, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    const args = [drawContext, text, x, y, r, g, b, a, textScale, renderBackground, textShadow, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawTextRGBA(...newArgs), RenderType.GUI)
}
export const drawGUIText = (drawContext, text, x, y, color = WHITE, textScale = 1, renderBackground = false, textShadow = true, maxWidth = 512, zOffset = 0) => {
    if (!text) return
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, text, x, y, color, textScale, renderBackground, textShadow, maxWidth, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawText(...newArgs), RenderType.GUI)
}
export const drawGUILineRGBA = (drawContext, startX, startY, endX, endY, r = 255, g = 255, b = 255, a = 255, lineThickness = 1, zOffset = 0) => {
    const args = [drawContext, startX, startY, endX, endY, r, g, b, a, lineThickness, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawLineRGBA(...newArgs), RenderType.GUI)
}
export const drawGUILine = (drawContext, startX, startY, endX, endY, color = WHITE, lineThickness = 1, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, startX, startY, endX, endY, color, lineThickness, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawLine(...newArgs), RenderType.GUI)
}
export const drawSquareRGBA = (drawContext, x, y, size, r = 255, g = 255, b = 255, a = 255, zOffset = 0) => {
    const args = [drawContext, x, y, size, r, g, b, a, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSquareRGBA(...newArgs), RenderType.GUI)
}
export const drawSquare = (drawContext, x, y, size, color = WHITE, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, x, y, size, color, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSquare(...newArgs), RenderType.GUI)
}
export const drawRectRGBA = (drawContext, x, y, width, height, r = 255, g = 255, b = 255, a = 255, zOffset = 0) => {
    const args = [drawContext, x, y, width, height, r, g, b, a, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawRectRGBA(...newArgs), RenderType.GUI)
}
export const drawRect = (drawContext, x, y, width, height, color = WHITE, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, x, y, width, height, color, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawRect(...newArgs), RenderType.GUI)
}
export const drawRoundedRectRGBA = (drawContext, x, y, width, height, radius, r = 255, g = 255, b = 255, a = 255, flatCorners = [], segments = 16, zOffset = 0) => {
    const args = [drawContext, x, y, width, height, radius, r, g, b, a, flatCorners, segments, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawRoundedRectRGBA(...newArgs), RenderType.GUI)
}
export const drawRoundedRect = (drawContext, x, y, width, height, radius, color = WHITE, flatCorners = [], segments = 16, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, x, y, width, height, radius, color, flatCorners, segments, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawRoundedRect(...newArgs), RenderType.GUI)
}
export const drawSimpleGradientRGBA = (drawContext, x, y, width, height, startRed = 255, startGreen = 255, startBlue = 255, startAlpha = 255, endRed = 0, endGreen = 0, endBlue = 0, endAlpha = 255, direction = GradientDirection.TOP_LEFT_TO_BOTTOM_RIGHT, zOffset = 0) => {
    const args = [drawContext, x, y, width, height, startRed, startGreen, startBlue, startAlpha, endRed, endGreen, endBlue, endAlpha, direction, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSimpleGradientRGBA(...newArgs), RenderType.GUI)
}
export const drawSimpleGradient = (drawContext, x, y, width, height, startColor = WHITE, endColor = BLACK, direction = GradientDirection.TOP_LEFT_TO_BOTTOM_RIGHT, zOffset = 0) => {
    if (startColor instanceof Array) startColor = getRGBAColor(...startColor)
    if (endColor instanceof Array) endColor = getRGBAColor(...endColor)
    const args = [drawContext, x, y, width, height, startColor, endColor, direction, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSimpleGradient(...newArgs), RenderType.GUI)
}
export const drawGradient = (drawContext, x, y, width, height, topLeftColor = WHITE, topRightColor = WHITE, bottomLeftColor = BLACK, bottomRightColor = BLACK, direction = GradientDirection.TOP_LEFT_TO_BOTTOM_RIGHT, zOffset = 0) => {
    if (topLeftColor instanceof Array) topLeftColor = getRGBAColor(...topLeftColor)
    if (topRightColor instanceof Array) topRightColor = getRGBAColor(...topRightColor)
    if (bottomLeftColor instanceof Array) bottomLeftColor = getRGBAColor(...bottomLeftColor)
    if (bottomRightColor instanceof Array) bottomRightColor = getRGBAColor(...bottomRightColor)
    const args = [drawContext, x, y, width, height, topLeftColor, topRightColor, bottomLeftColor, bottomRightColor, direction, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawGradient(...newArgs), RenderType.GUI)
}
export const drawSimpleCircleRGBA = (drawContext, x, y, radius = 1, r = 255, g = 255, b = 255, a = 255, edges = 32, zOffset = 0) => {
    const args = [drawContext, x, y, radius, r, g, b, a, edges, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSimpleCircleRGBA(...newArgs), RenderType.GUI)
}
export const drawSimpleCircle = (drawContext, x, y, radius = 1, color = WHITE, edges = 32, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, x, y, radius, color, edges, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawSimpleCircle(...newArgs), RenderType.GUI)
}
export const drawCircleRGBA = (drawContext, x, y, xScale = 1, yScale = 1, r = 255, g = 255, b = 255, a = 255, edges = 32, rotationDegrees = 0, xRotationOffset = 0, yRotationOffset = 0, zOffset = 0) => {
    const args = [drawContext, x, y, xScale, yScale, r, g, b, a, edges, rotationDegrees, xRotationOffset, yRotationOffset, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawCircleRGBA(...newArgs), RenderType.GUI)
}
export const drawCircle = (drawContext, x, y, xScale = 1, yScale = 1, color = WHITE, edges = 32, rotationDegrees = 0, xRotationOffset = 0, yRotationOffset = 0, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, x, y, xScale, yScale, color, edges, rotationDegrees, xRotationOffset, yRotationOffset, zOffset]
    CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawCircle(...newArgs), RenderType.GUI)
}
export const drawImageRGBA = (drawContext, image, x, y, width = null, height = null, r = 255, g = 255, b = 255, a = 255, zOffset = 0) => {
    const args = [drawContext, image, x, y, width, height, r, g, b, a, zOffset]
    let attempts = 0
    const tryDraw = () => {
        if (image != null && image.getTexture() != null) {
            CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawImageRGBA(...newArgs), RenderType.GUI)
        } else if (attempts++ < maxImageDrawAttempts) {
            Client.scheduleTask(1, tryDraw)
        }
    }
    tryDraw()
}
export const drawImage = (drawContext, image, x, y, width = null, height = null, color = WHITE, zOffset = 0) => {
    if (color instanceof Array) color = getRGBAColor(...color).getLong()
    const args = [drawContext, image, x, y, width, height, color, zOffset]
    let attempts = 0
    const tryDraw = () => {
        if (image != null && image.getTexture() != null) {
            CallAndApplyValues(args, (newArgs) => ZGUIRenderer.drawImage(...newArgs), RenderType.GUI)
        } else if (attempts++ < maxImageDrawAttempts) {
            Client.scheduleTask(1, tryDraw)
        }
    }
    tryDraw()
}
const loadImage = (image) => {
    if (!ZCoreCore.isLegacy) {
        Client.scheduleTask(0, () => {
            image.setTexture(ZImage.bufferedImageToNativeTexture(image.image))
        })
    }
    return image
}
export const loadImageFromFile = (filePath) => {
    return loadImage(ZImage.fromFile(filePath))
}
export const loadCTImage = (image) => {
    return loadImage(new ZImage(image.image))
}
export const loadZImage = (image) => {
    return loadImage(new ZImage(image.image))
}
