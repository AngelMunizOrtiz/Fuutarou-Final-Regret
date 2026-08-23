import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const stagedPublicDirectory = join(workspace, ".codex-tmp", "android-chapter1-public");
const tauriCli = join(workspace, "node_modules", "@tauri-apps", "cli", "tauri.js");
const generatedOutputsRoot = join(workspace, "src-tauri", "gen", "android", "app", "build", "outputs");
const apkRoot = join(generatedOutputsRoot, "apk");
const temporaryRoot = join(workspace, ".codex-tmp");
const debugBuild = process.argv.includes("--debug");
const portableJavaHome = await findPortableJavaHome();
const javaHome = process.env.JAVA_HOME || portableJavaHome || "C:\\Program Files\\Android\\Android Studio\\jbr";
const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
const javaExecutable = join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");
const keytoolExecutable = join(javaHome, "bin", process.platform === "win32" ? "keytool.exe" : "keytool");

await run(process.execPath, [join(scriptDirectory, "prepare-chapter1-android-demo.mjs")], process.env);

const buildEnvironment = {
    ...process.env,
    JAVA_HOME: javaHome,
    ANDROID_HOME: androidHome,
    ANDROID_SDK_ROOT: androidHome,
    CARGO_BUILD_JOBS: process.env.CARGO_BUILD_JOBS || "1",
    VITE_PUBLIC_DIR: stagedPublicDirectory,
    VITE_CHAPTER1_DEMO: "true",
    VITE_DISABLE_PWA: "true",
    VITE_STORY_WEBP: "true",
    VITE_SYSTEM_FONTS: "true",
};

const apkRelativePath = relative(generatedOutputsRoot, apkRoot);
if (apkRelativePath.startsWith("..") || isAbsolute(apkRelativePath)) {
    throw new Error(`Unsafe APK output path: ${apkRoot}`);
}
await rm(apkRoot, { recursive: true, force: true });

const androidBuildArguments = [tauriCli, "android", "build"];
if (debugBuild) androidBuildArguments.push("--debug");
androidBuildArguments.push("--target", "aarch64", "--apk", "--ci");

await run(process.execPath, androidBuildArguments, buildEnvironment);

const apkFiles = (await collectFiles(apkRoot)).filter((file) => file.toLowerCase().endsWith(".apk"));
if (apkFiles.length === 0) {
    throw new Error(`Android build completed but no APK was found under ${apkRoot}`);
}

const apkStats = await Promise.all(apkFiles.map(async (file) => ({ file, stats: await stat(file) })));
apkStats.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);

const sourceApk = apkStats[0].file;
const artifactDirectory = join(workspace, "artifacts", "android");
const destinationApk = join(
    artifactDirectory,
    debugBuild
        ? "Fuutarou-Final-Regret-capitulo-1-extra-arm64-debug.apk"
        : "Fuutarou-Final-Regret-capitulo-1-extra-arm64-release-test.apk",
);
await mkdir(artifactDirectory, { recursive: true });

if (debugBuild) {
    await copyFile(sourceApk, destinationApk);
} else {
    await signReleaseApk(sourceApk, destinationApk);
}

const destinationStats = await stat(destinationApk);
console.log(`APK ready: ${destinationApk}`);
console.log(`APK size: ${(destinationStats.size / 1024 / 1024).toFixed(1)} MB`);

async function signReleaseApk(sourceApk, destinationApk) {
    const apksigner = await findApkSigner();
    const keystore = await resolveTestKeystore();
    const storePassword = process.env.ANDROID_DEMO_KEYSTORE_PASSWORD || "android";
    const keyPassword = process.env.ANDROID_DEMO_KEY_PASSWORD || storePassword;
    const keyAlias = process.env.ANDROID_DEMO_KEY_ALIAS || "androiddebugkey";

    await run(javaExecutable, [
        "-jar", apksigner,
        "sign",
        "--ks", keystore,
        "--ks-key-alias", keyAlias,
        "--ks-pass", `pass:${storePassword}`,
        "--key-pass", `pass:${keyPassword}`,
        "--out", destinationApk,
        sourceApk,
    ], process.env);

    await run(javaExecutable, ["-jar", apksigner, "verify", "--verbose", destinationApk], process.env);
}

async function findApkSigner() {
    const buildToolsRoot = join(androidHome, "build-tools");
    const entries = await readdir(buildToolsRoot, { withFileTypes: true });
    const versions = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));

    for (const version of versions) {
        const candidate = join(buildToolsRoot, version, "lib", "apksigner.jar");
        try {
            await stat(candidate);
            return candidate;
        } catch {
            // Try the next installed Android build-tools version.
        }
    }

    throw new Error(`apksigner.jar was not found under ${buildToolsRoot}`);
}

async function resolveTestKeystore() {
    const defaultKeystore = join(process.env.USERPROFILE || "", ".android", "debug.keystore");
    const requestedKeystore = process.env.ANDROID_DEMO_KEYSTORE || defaultKeystore;

    try {
        await stat(requestedKeystore);
        return requestedKeystore;
    } catch {
        if (process.env.ANDROID_DEMO_KEYSTORE) {
            throw new Error(`ANDROID_DEMO_KEYSTORE does not exist: ${requestedKeystore}`);
        }
    }

    const generatedKeystore = join(temporaryRoot, "android-demo-debug.keystore");
    await mkdir(dirname(generatedKeystore), { recursive: true });
    await run(keytoolExecutable, [
        "-genkeypair",
        "-keystore", generatedKeystore,
        "-storepass", "android",
        "-alias", "androiddebugkey",
        "-keypass", "android",
        "-dname", "CN=Android Debug,O=Android,C=US",
        "-keyalg", "RSA",
        "-keysize", "2048",
        "-validity", "10000",
    ], process.env);
    return generatedKeystore;
}

function run(command, args, env) {
    return new Promise((resolveRun, rejectRun) => {
        const child = spawn(command, args, {
            cwd: workspace,
            env,
            stdio: "inherit",
            windowsHide: true,
        });

        child.once("error", rejectRun);
        child.once("exit", (code) => {
            if (code === 0) resolveRun();
            else rejectRun(new Error(`${command} exited with code ${code ?? "unknown"}`));
        });
    });
}

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(
        entries.map((entry) => {
            const fullPath = join(directory, entry.name);
            return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
        }),
    );
    return nestedFiles.flat();
}

async function findPortableJavaHome() {
    const jdkRoot = join(workspace, ".codex-tmp", "jdk21");
    try {
        const entries = await readdir(jdkRoot, { withFileTypes: true });
        const candidates = entries
            .filter((entry) => entry.isDirectory() && entry.name.startsWith("jdk-21"))
            .map((entry) => join(jdkRoot, entry.name))
            .sort()
            .reverse();

        for (const candidate of candidates) {
            try {
                await stat(join(candidate, "bin", process.platform === "win32" ? "java.exe" : "java"));
                return candidate;
            } catch {
                // Try the next extracted JDK directory.
            }
        }
    } catch {
        return undefined;
    }

    return undefined;
}
