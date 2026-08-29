package com.zephy.zls;

import net.minecraft.world.item.ItemStack;
import net.minecraft.client.gui.GuiGraphicsExtractor;

public class ItemRenderData {
    public final GuiGraphicsExtractor drawContext;
    public final ItemStack itemStack;
    public final int x, y, z;

    public ItemRenderData(
        GuiGraphicsExtractor drawContext,
        ItemStack itemStack, int x, int y, int z
    ) {
        this.drawContext = drawContext;
        this.itemStack = itemStack;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
