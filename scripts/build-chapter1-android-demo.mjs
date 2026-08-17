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
const portableJavaHome = await findPortableJavaHome();
const javaHome = process.env.JAVA_HOME || portableJavaHome || "C:\\Program Files\\Android\\Android Studio\\jbr";
const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || join(process.env.LOCALAPPDATA || "", "Android", "Sdk");

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
};

const apkRelativePath = relative(generatedOutputsRoot, apkRoot);
if (apkRelativePath.startsWith("..") || isAbsolute(apkRelativePath)) {
    throw new Error(`Unsafe APK output path: ${apkRoot}`);
}
await rm(apkRoot, { recursive: true, force: true });

await run(
    process.execPath,
    [tauriCli, "android", "build", "--debug", "--target", "aarch64", "--apk", "--ci"],
    buildEnvironment,
);

const apkFiles = (await collectFiles(apkRoot)).filter((file) => file.toLowerCase().endsWith(".apk"));
if (apkFiles.length === 0) {
    throw new Error(`Android build completed but no APK was found under ${apkRoot}`);
}

const apkStats = await Promise.all(apkFiles.map(async (file) => ({ file, stats: await stat(file) })));
apkStats.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);

const sourceApk = apkStats[0].file;
const artifactDirectory = join(workspace, "artifacts", "android");
const destinationApk = join(artifactDirectory, "Fuutarou-Final-Regret-capitulo-1-extra-arm64-debug.apk");
await mkdir(artifactDirectory, { recursive: true });
await copyFile(sourceApk, destinationApk);

const destinationStats = await stat(destinationApk);
console.log(`APK ready: ${destinationApk}`);
console.log(`APK size: ${(destinationStats.size / 1024 / 1024).toFixed(1)} MB`);

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
