package com.zephy.zls

import net.minecraft.client.gui.screens.inventory.tooltip.ClientTooltipPositioner
import org.joml.Vector2i
import org.joml.Vector2ic

object OffscreenTooltipPositioner : ClientTooltipPositioner {
    override fun positionTooltip(
        screenWidth: Int,
        screenHeight: Int,
        x: Int,
        y: Int,
        tooltipWidth: Int,
        tooltipHeight: Int,
    ): Vector2ic = Vector2i(x, y)
}
