plugins {
    kotlin("jvm")
    id("maven-publish")
    id("gg.essential.multi-version")
    id("gg.essential.defaults")
}

group = "com.zephy.zls"
version = "0.6.0"

tasks {
    processResources {
        val version = project.version
        inputs.property("version", version)
        filesMatching("fabric.mod.json") {
            expand(mapOf(
                "version" to version,
            ))
        }

        val javaVersion = project.java.toolchain.languageVersion.get().asInt()
        inputs.property("compatibilityLevel", javaVersion)
        filesMatching("zls.mixins.json") {
            filter { line -> line.replace("\$compatibilityLevel", "JAVA_$javaVersion") }
        }
    }
}

afterEvaluate {
    val hasRemapJar = tasks.findByName("remapJar") != null
    val outputTaskName = if (hasRemapJar) "remapJar" else "jar"

    tasks.register<Copy>("collectJars") {
        group = "build"
        description = "Copies this version's non-shadowed JARs to main/jars"

        val outputDir = projectDir.resolve("../../jars").normalize()
        dependsOn(outputTaskName)

        from(tasks.named(outputTaskName)) {
            include("*.jar")
            exclude { it.name.contains(" 1.2") && it.name.contains("-all") }
            rename {
                "${rootProject.name}-${version}.jar"
            }
        }
        into(outputDir)
    }

    tasks.named("build") {
        finalizedBy("collectJars")
    }

    configurations.named("default") {
        isCanBeConsumed = true
        isCanBeResolved = false
    }

    artifacts {
        add("default", tasks.named(outputTaskName))
    }
}
