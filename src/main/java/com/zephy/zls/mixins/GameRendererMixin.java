package com.zephy.zls.mixins;

import com.zephy.zls.TooltipScreenshot;
import net.minecraft.client.DeltaTracker;
import net.minecraft.client.gui.render.GuiRenderer;
import net.minecraft.client.renderer.GameRenderer;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

//#if MC<26.2
//$$import net.minecraft.client.renderer.fog.FogRenderer;
//$$import org.spongepowered.asm.mixin.gen.Accessor;
//#endif

@Mixin(GameRenderer.class)
public abstract class GameRendererMixin {
    @Shadow
    @Final
    private GuiRenderer guiRenderer;

    //#if MC<26.2
    //$$@Accessor("fogRenderer")
    //$$public abstract FogRenderer zls$getFogRenderer();
    //#endif

    @Inject(
        method = "render(Lnet/minecraft/client/DeltaTracker;Z)V",
        at = @At(
            value = "INVOKE",
            //#if MC<26.2
            //$$target = "Lnet/minecraft/client/gui/render/GuiRenderer;render(Lcom/mojang/blaze3d/buffers/GpuBufferSlice;)V",
            //#else
            target = "Lnet/minecraft/client/gui/render/GuiRenderer;render()V",
            //#endif
            shift = At.Shift.AFTER
        )
    )
    private void afterGuiRender(DeltaTracker deltaTracker, boolean advanceGameTime, CallbackInfo ci) {
        TooltipScreenshot.INSTANCE.maybeCaptureTooltipOffscreen(this.guiRenderer);
    }
}
