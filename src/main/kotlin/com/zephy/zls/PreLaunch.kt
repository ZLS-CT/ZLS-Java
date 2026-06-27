package com.zephy.zls

import net.fabricmc.loader.api.FabricLoader
import net.fabricmc.loader.api.entrypoint.PreLaunchEntrypoint
import org.slf4j.LoggerFactory
import java.io.IOException
import java.nio.file.FileSystems
import java.nio.file.Files
import java.nio.file.Path

private const val RESOURCE_FOLDER = "modules"
private const val CONFIG_SUB_DIR = "ZJS"

private val LOGGER = LoggerFactory.getLogger("zls")
private val logPrefix = "[ZLS]"
private fun logInfo(message: String) = LOGGER.info("$logPrefix $message")
private fun logWarn(message: String, cause: Throwable? = null) =
    if (cause != null) LOGGER.warn("$logPrefix $message", cause) else LOGGER.warn("$logPrefix $message")

class PreLaunch : PreLaunchEntrypoint {
    override fun onPreLaunch() {
        logInfo("Pre-Launch started.")
        copyDefaultConfigs()
    }

    private fun copyDefaultConfigs() {
        val configDir = FabricLoader.getInstance().configDir
            .resolve(CONFIG_SUB_DIR)
            .resolve(RESOURCE_FOLDER)

        val resourceUri = javaClass.getResource("/$RESOURCE_FOLDER")?.toURI()
            ?: return logWarn("Resource folder '/$RESOURCE_FOLDER' not found, skipping.")

        runCatching {
            if (resourceUri.scheme == "jar") {
                FileSystems.newFileSystem(resourceUri, emptyMap<String, Any>()).use { fs ->
                    copyResources(fs.getPath("/$RESOURCE_FOLDER"), configDir)
                }
            } else {
                copyResources(Path.of(resourceUri), configDir)
            }
        }.onFailure { e ->
            if (e is IOException) logWarn("Failed to copy default configs.", e)
            else throw e
        }.onSuccess { copiedFileCount ->
            if (copiedFileCount > 0) reloadZJSModules()
        }
    }

    private fun copyResources(resourcePath: Path, configDir: Path): Int {
        val copiedCount = Files.walk(resourcePath).use { stream ->
            stream
                .filter(Files::isRegularFile)
                .mapToInt { source ->
                    val destination = configDir.resolve(resourcePath.relativize(source).toString())
                    if (Files.notExists(destination)) {
                        Files.createDirectories(destination.parent)
                        Files.copy(source, destination)
                        1
                    } else 0
                }
                .sum()
        }

        if (copiedCount > 0) logInfo("Install complete. Copied ${copiedCount} file(s) to ${configDir}.")
        return copiedCount
    }

    private fun reloadZJSModules() {
        if (!FabricLoader.getInstance().isModLoaded("zjs")) return
        runCatching {
            val clazz = Class.forName("com.zephy.zjs.internal.engine.module.ModuleManager")
            val instance = clazz.getField("INSTANCE").get(null)
            val method = clazz.getDeclaredMethod("setup")
            method.invoke(instance)
        }.onFailure { e ->
            val cause = (e as? java.lang.reflect.InvocationTargetException)?.cause ?: e
            logWarn("Failed to invoke ModuleManager.setup: ${cause::class.java.name}: ${cause.message}", cause)
        }
    }
}
