package com.zephy.zls.mixins;

import com.mojang.blaze3d.pipeline.RenderTarget;
import com.zephy.zls.TooltipScreenshot;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.render.GuiRenderer;
import net.minecraft.client.renderer.GameRenderer;
import net.minecraft.client.renderer.Projection;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

@Mixin(GuiRenderer.class)
public abstract class GuiRendererMixin {
    @Redirect(
        method = "draw",
        at = @At(
            value = "INVOKE",
            //#if MC<26.2
            //$$target = "Lnet/minecraft/client/Minecraft;getMainRenderTarget()Lcom/mojang/blaze3d/pipeline/RenderTarget;"
            //#else
            target = "Lnet/minecraft/client/renderer/GameRenderer;mainRenderTarget()Lcom/mojang/blaze3d/pipeline/RenderTarget;"
            //#endif
        )
    )
    private RenderTarget redirectTarget(
        //#if MC<26.2
        //$$Minecraft instance
        //#else
        GameRenderer instance
        //#endif
    ) {
        RenderTarget capture = TooltipScreenshot.captureTarget;
        if (capture != null) {
            return capture;
        }
        //#if MC<26.2
        //$$return instance.getMainRenderTarget();
        //#else
        return instance.mainRenderTarget();
        //#endif
    }

    @Redirect(
        method = "draw",
        at = @At(
            value = "INVOKE",
            target = "Lnet/minecraft/client/renderer/Projection;setupOrtho(FFFFZ)V"
        )
    )
    private void redirectOrtho(
        Projection instance,
        float zNear,
        float zFar,
        float width,
        float height,
        boolean invertY
    ) {
        RenderTarget capture = TooltipScreenshot.captureTarget;
        if (capture != null) {
            float guiScale = (float) Minecraft.getInstance().getWindow().getGuiScale();
            instance.setupOrtho(zNear, zFar, capture.width / guiScale, capture.height / guiScale, invertY);
            return;
        }
        instance.setupOrtho(zNear, zFar, width, height, invertY);
    }
}
