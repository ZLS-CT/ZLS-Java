package com.zephy.zls

import com.mojang.blaze3d.pipeline.RenderTarget
import com.mojang.blaze3d.pipeline.TextureTarget
import com.mojang.blaze3d.platform.NativeImage
import com.mojang.blaze3d.systems.RenderSystem
import com.zephy.zls.mixins.AbstractContainerScreenAccessor
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents
import net.fabricmc.fabric.api.client.rendering.v1.hud.HudElementRegistry
import net.minecraft.client.DeltaTracker
import net.minecraft.client.Minecraft
import net.minecraft.client.gui.Font
import net.minecraft.client.gui.GuiGraphicsExtractor
import net.minecraft.client.gui.render.GuiRenderer
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen
import net.minecraft.client.gui.screens.inventory.tooltip.ClientTooltipComponent
import net.minecraft.core.component.DataComponents
import net.minecraft.resources.Identifier
import net.minecraft.world.item.Item
import net.minecraft.world.item.ItemStack
import net.minecraft.world.item.TooltipFlag
import java.awt.Image
import java.awt.Toolkit
import java.awt.datatransfer.DataFlavor
import java.awt.datatransfer.Transferable
import java.awt.datatransfer.UnsupportedFlavorException
import javax.imageio.ImageIO
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.awt.datatransfer.SystemFlavorMap
import net.minecraft.util.Util

//#if MC<26.2
//$$import com.zephy.zls.mixins.GameRendererMixin
//$$import net.minecraft.client.renderer.fog.FogRenderer
//#else
//#if MC<26.3
//$$import com.mojang.blaze3d.GpuFormat
//#else
import com.mojang.renderpearl.api.GpuFormat
//#endif
import org.joml.Vector4f
//#endif

object TooltipScreenshot {
    private const val MOD_ID = "zls"
    private val LAYER_ID = Identifier.fromNamespaceAndPath(MOD_ID, "tooltip_screenshot_capture")
    private const val BASE_PADDING = 4
    private const val TICKS_TO_WAIT = 1
    private const val MAX_TEXTURE_DIM = 8192
    //#if MC<26.2
    //$$private const val CLEAR_VALUE = 0
    //#else
    private val CLEAR_VALUE = Vector4f(0f, 0f, 0f, 0f)
    //#endif

    private var registered = false
    private var pendingItem: ItemStack? = null
    private var lastExtractor: GuiGraphicsExtractor? = null
    private var boundsReady = false
    private var captureBounds: IntArray? = null
    private var ticksWaited = -1
    private var readyToCapture = false
    private var readbackTarget: RenderTarget? = null
    private var readbackTicksWaited = -1
    private var padding = BASE_PADDING
    private var pngNativeFlavorRegistered = false

    @JvmField
    var captureTarget: RenderTarget? = null
    @JvmField
    var lastTooltipItem: ItemStack = ItemStack.EMPTY
    @JvmField
    var pendingTooltipItem: ItemStack = ItemStack.EMPTY

    private var offscreenBacking: TextureTarget? = null
    private var drawFont: Font? = null
    private var drawComponents: List<ClientTooltipComponent>? = null
    private var drawTooltipStyle: Identifier? = null

    fun takeScreenshot(itemStack: ItemStack) {
        reset()
        pendingItem = itemStack
        if (!registered) {
            registered = true
            HudElementRegistry.addLast(LAYER_ID, ::extract)
            ClientTickEvents.END_CLIENT_TICK.register(::onTick)
        }
    }

    fun takeScreenshotOfHoveredItem(): Boolean {
        val hoveredStack = getHoveredItemStack()
        if (hoveredStack != null) {
            takeScreenshot(hoveredStack)
            return true
        }
        return false
    }

    fun getHoveredItemStack(): ItemStack? {
        //#if MC<26.2
        //$$val screen = Minecraft.getInstance().screen
        //#else
        val screen = Minecraft.getInstance().gui.screen()
        //#endif
        if (screen is AbstractContainerScreen<*>) {
            val slot = (screen as AbstractContainerScreenAccessor).hoveredSlot
            val slotStack = slot?.item?.takeIf { !it.isEmpty }
            if (slotStack != null) return slotStack
        }
        return lastTooltipItem.takeIf { !it.isEmpty }
    }

    private fun extract(graphics: GuiGraphicsExtractor, deltaTracker: DeltaTracker) {
        lastExtractor = graphics
        val itemStack = pendingItem ?: return
        if (boundsReady) return

        val mc = Minecraft.getInstance()
        val player = mc.player ?: return
        val font = mc.font

        val tooltipContext = Item.TooltipContext.of(mc.level)
        val tooltipFlag = if (mc.options.advancedItemTooltips) TooltipFlag.Default.ADVANCED else TooltipFlag.Default.NORMAL
        val textLines = itemStack.getTooltipLines(tooltipContext, player, tooltipFlag)

        val components = mutableListOf<ClientTooltipComponent>()
        itemStack.item.getTooltipImage(itemStack).ifPresent { components.add(ClientTooltipComponent.create(it)) }
        textLines.forEach {
            components.add(ClientTooltipComponent.create(it.visualOrderText))
        }

        drawTooltipStyle = itemStack.get(DataComponents.TOOLTIP_STYLE)
        padding = if (drawTooltipStyle != null) BASE_PADDING + 4 else BASE_PADDING

        var textWidth = 0
        var tempHeight = if (components.size == 1) -2 else 0
        for (line in components) {
            val lineWidth = line.getWidth(font)
            if (lineWidth > textWidth) {
                textWidth = lineWidth
            }
            tempHeight += line.getHeight(font)
        }

        val guiScale = mc.window.guiScale.toDouble()
        val styleSlack = if (drawTooltipStyle != null) 24 else 0
        val pw = (kotlin.math.ceil((textWidth + padding * 2) * guiScale).toInt() + 8 + styleSlack).coerceIn(1, MAX_TEXTURE_DIM)
        val ph = (kotlin.math.ceil((tempHeight + padding * 2) * guiScale).toInt() + 8 + styleSlack).coerceIn(1, MAX_TEXTURE_DIM)

        captureBounds = intArrayOf(0, 0, pw, ph)
        drawFont = font
        drawComponents = components
        boundsReady = true
    }

    private fun ensureOffscreenTarget(w: Int, h: Int): TextureTarget {
        offscreenBacking?.let {
            if (it.width == w && it.height == h) return it
            it.destroyBuffers()
        }
        //#if MC<26.2
        //$$return TextureTarget("zls tooltip capture", w, h, true).also { offscreenBacking = it }
        //#elseif MC<26.3
        //$$return TextureTarget("zls tooltip capture", w, h, true, GpuFormat.RGBA8_UNORM).also { offscreenBacking = it }
        //#else
        return TextureTarget("zls tooltip capture", w, h, GpuFormat.RGBA8_UNORM, GpuFormat.D32_FLOAT).also { offscreenBacking = it }
        //#endif
    }

    private fun onTick(minecraft: Minecraft) {
        if (pendingItem == null) return

        if (readbackTarget != null) {
            if (readbackTicksWaited < TICKS_TO_WAIT) {
                readbackTicksWaited++
                return
            }
            finishCapture()
            return
        }

        if (!boundsReady) return
        if (readyToCapture) return

        if (ticksWaited < TICKS_TO_WAIT) {
            ticksWaited++
            return
        }
        readyToCapture = true
    }

    fun maybeCaptureTooltipOffscreen(guiRenderer: GuiRenderer) {
        if (!readyToCapture) return
        readyToCapture = false

        val extractor = lastExtractor ?: return
        val font = drawFont ?: return
        val components = drawComponents ?: return
        val bounds = captureBounds ?: return

        val target = ensureOffscreenTarget(bounds[2], bounds[3])

        val colorTexture = target.colorTextureView!!.texture()
        val depthTexture = target.depthTextureView?.texture()
        val encoder = RenderSystem.getDevice().createCommandEncoder()
        //#if MC<26.3
        //$$if (target.useDepth && depthTexture != null) {
        //#else
        if (target.hasDepth() && depthTexture != null) {
        //#endif
            encoder.clearColorAndDepthTextures(colorTexture, CLEAR_VALUE, depthTexture, 1.0)
        } else {
            encoder.clearColorTexture(colorTexture, CLEAR_VALUE)
        }

        extractor.tooltip(font, components, padding, padding, OffscreenTooltipPositioner, drawTooltipStyle,
            //#if MC>=26.3
            true
            //#endif
        )
        captureTarget = target
        try {
            //#if MC<26.2
            //$$val fogRenderer = (Minecraft.getInstance().gameRenderer as GameRendererMixin).`zls$getFogRenderer`()
            //$$guiRenderer.render(fogRenderer.getBuffer(FogRenderer.FogMode.NONE))
            //#else
            guiRenderer.render()
            //#endif
        } finally {
            captureTarget = null
        }

        readbackTarget = target
        readbackTicksWaited = 0
    }

    private fun finishCapture() {
        val bounds = captureBounds
        val target = readbackTarget
        reset()

        if (bounds == null || target == null) return
        var (x, y, w, h) = bounds

        if (x < 0) {
            w += x
            x = 0
        }
        if (y < 0) {
            h += y
            y = 0
        }
        if (x + w > target.width) {
            w = target.width - x
        }
        if (y + h > target.height) {
            h = target.height - y
        }
        if (w <= 0 || h <= 0) return

        takeScreenshotPreservingAlpha(target) { screenshot ->
            try {
                val cropped = NativeImage(w, h, false)
                cropped.use { cropped ->
                    screenshot.resizeSubRectTo(x, y, w, h, cropped)
                    val imageBounds = findImageBounds(cropped)
                    val finalImage = if (imageBounds != null) {
                        NativeImage(imageBounds[2], imageBounds[3], false).also { trimmed ->
                            cropped.copyRect(trimmed, imageBounds[0], imageBounds[1], 0, 0, imageBounds[2], imageBounds[3], false, false)
                        }
                    } else cropped
                    val pngBytes = nativeImageToPngBytes(finalImage)
                    if (finalImage != cropped) {
                        finalImage.close()
                    }
                    Util.ioPool().execute { setClipboard(pngBytes) }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                screenshot.close()
            }
        }
    }

    private fun findImageBounds(image: NativeImage): IntArray? {
        var minX = image.width
        var minY = image.height
        var maxX = -1
        var maxY = -1
        for (py in 0 until image.height) {
            for (px in 0 until image.width) {
                val alpha = (image.getPixel(px, py) ushr 24) and 0xFF
                if (alpha != 0) {
                    if (px < minX) minX = px
                    if (py < minY) minY = py
                    if (px > maxX) maxX = px
                    if (py > maxY) maxY = py
                }
            }
        }
        return if (maxX < minX || maxY < minY) null else intArrayOf(minX, minY, maxX - minX + 1, maxY - minY + 1)
    }

    private fun takeScreenshotPreservingAlpha(target: RenderTarget, callback: (NativeImage) -> Unit) {
        val sourceTexture = target.colorTexture ?: throw IllegalStateException("Tried to capture screenshot of an incomplete framebuffer.")
        val width = target.width
        val height = target.height

        //#if MC<26.2
        //$$val pixelSize = sourceTexture.format.pixelSize()
        //#else
        val pixelSize = sourceTexture.format.blockSize()
        //#endif

        val buffer = RenderSystem.getDevice().createBuffer(
            { "zls tooltip screenshot buffer" },
            9,
            width.toLong() * height.toLong() * pixelSize,
        )

        //#if MC<26.2
        //$$val commandEncoder = RenderSystem.getDevice().createCommandEncoder()
        //#endif
        RenderSystem.getDevice().createCommandEncoder().copyTextureToBuffer(sourceTexture, buffer, 0L, {
            buffer.use { buffer ->
                //#if MC<26.2
                //$$commandEncoder.mapBuffer(buffer, true, false)
                //#else
                buffer.map(true, false)
                //#endif
                    .use { read ->
                        val image = NativeImage(width, height, false)
                        for (y in 0 until height) {
                            val rowOffset = y * width * pixelSize
                            val destY = height - y - 1
                            for (x in 0 until width) {
                                val abgr = read.data().getInt(rowOffset + x * pixelSize)
                                image.setPixelABGR(x, destY, abgr)
                            }
                        }
                        callback(image)
                    }
            }
        }, 0)
    }

    fun reset() {
        pendingItem = null
        lastExtractor = null
        boundsReady = false
        captureBounds = null
        ticksWaited = -1
        readyToCapture = false
        readbackTarget = null
        readbackTicksWaited = -1
        drawFont = null
        drawComponents = null
        drawTooltipStyle = null
        padding = BASE_PADDING
    }

    private fun nativeImageToPngBytes(image: NativeImage): ByteArray {
        val w = image.width
        val h = image.height
        val argbPixels = image.pixels
        val buffered = BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB)
        buffered.setRGB(0, 0, w, h, argbPixels, 0, w)
        val outputStream = ByteArrayOutputStream()
        ImageIO.write(buffered, "png", outputStream)
        return outputStream.toByteArray()
    }

    private fun registerPngNativeFlavor() {
        if (pngNativeFlavorRegistered) return
        pngNativeFlavorRegistered = true
        try {
            val flavorMap = SystemFlavorMap.getDefaultFlavorMap() as SystemFlavorMap
            flavorMap.addUnencodedNativeForFlavor(ImageSelection.PNG_FLAVOR, "PNG")
            flavorMap.addFlavorForUnencodedNative("PNG", ImageSelection.PNG_FLAVOR)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun setClipboard(pngBytes: ByteArray) {
        val image = ImageIO.read(java.io.ByteArrayInputStream(pngBytes)) ?: return
        registerPngNativeFlavor()
        Toolkit.getDefaultToolkit().systemClipboard.setContents(ImageSelection(image, pngBytes), null)
    }

    private class ImageSelection(
        private val image: Image,
        private val pngBytes: ByteArray
    ) : Transferable {
        companion object {
            val PNG_FLAVOR: DataFlavor = DataFlavor("image/png; class=java.io.InputStream", "PNG Image")
        }

        override fun getTransferDataFlavors(): Array<DataFlavor> =
            arrayOf(PNG_FLAVOR, DataFlavor.imageFlavor)

        override fun isDataFlavorSupported(flavor: DataFlavor) =
            flavor.equals(PNG_FLAVOR) || flavor.equals(DataFlavor.imageFlavor)

        @Throws(UnsupportedFlavorException::class)
        override fun getTransferData(flavor: DataFlavor): Any = when {
            flavor.equals(PNG_FLAVOR) -> java.io.ByteArrayInputStream(pngBytes)
            flavor.equals(DataFlavor.imageFlavor) -> image
            else -> throw UnsupportedFlavorException(flavor)
        }
    }
}
