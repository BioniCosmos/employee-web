plugins {
    kotlin("jvm") version "1.9.22"
}

group = "com.moecm"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.javalin:javalin:6.1.3")
    implementation("org.slf4j:slf4j-simple:2.0.12")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.16.1")
}

kotlin {
    jvmToolchain(21)
}
