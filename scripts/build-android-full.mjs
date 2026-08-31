import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const stagedPublicDirectory = join(workspace, ".codex-tmp", "full-android-public");
const tauriCli = join(workspace, "node_modules", "@tauri-apps", "cli", "tauri.js");
const fullConfig = join(workspace, "src-tauri", "tauri.full.conf.json");

await run(process.execPath, [join(scriptDirectory, "prepare-full-public.mjs"), "--target=android"], process.env);

const buildEnvironment = {
    ...process.env,
    VITE_PUBLIC_DIR: stagedPublicDirectory,
    VITE_DISABLE_PWA: "true",
    VITE_STORY_WEBP: await wereStoryPngsConverted(),
    VITE_SYSTEM_FONTS: "true",
};

await run(
    process.execPath,
    [tauriCli, "android", "build", "--target", "aarch64", "--apk", "--config", fullConfig, "--ci"],
    buildEnvironment,
);

const apkDirectory = join(workspace, "src-tauri", "gen", "android", "app", "build", "outputs", "apk");
const apkFiles = (await collectFiles(apkDirectory)).filter((file) => file.toLowerCase().endsWith(".apk"));
if (apkFiles.length === 0) throw new Error(`Android build completed but no APK was found under ${apkDirectory}`);

const apkStats = await Promise.all(apkFiles.map(async (file) => ({ file, stats: await stat(file) })));
apkStats.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);

const artifactDirectory = join(workspace, "artifacts", "android");
const destinationApk = join(artifactDirectory, "Fuutarou-Final-Regret-completo-arm64-release.apk");
await mkdir(artifactDirectory, { recursive: true });
await copyFile(apkStats[0].file, destinationApk);

const destinationStats = await stat(destinationApk);
console.log(`Full Android APK ready: ${destinationApk}`);
console.log(`APK size: ${(destinationStats.size / 1024 / 1024).toFixed(1)} MB`);

async function wereStoryPngsConverted() {
    const sourcePngFiles = (await Promise.all(
        ["images/backgrounds", "images/cg"].map((directory) => collectFiles(join(workspace, "public", directory))),
    )).flat().filter((file) => file.toLowerCase().endsWith(".png"));

    const statuses = await Promise.all(sourcePngFiles.map(async (sourceFile) => {
        const relativePath = sourceFile.slice(join(workspace, "public").length + 1);
        const stagedPng = join(stagedPublicDirectory, relativePath);
        const stagedWebp = stagedPng.replace(/\.png$/i, ".webp");
        return { png: await exists(stagedPng), webp: await exists(stagedWebp) };
    }));
    const converted = statuses.length > 0 && statuses.every((entry) => entry.webp && !entry.png);
    const unchanged = statuses.every((entry) => entry.png && !entry.webp);
    if (!converted && !unchanged) {
        throw new Error("Full Android image staging is incomplete: PNG/WebP derivatives are mixed or missing.");
    }
    return converted ? "true" : "false";
}

async function exists(path) {
    try {
        await stat(path);
        return true;
    } catch {
        return false;
    }
}

function run(command, args, env) {
    return new Promise((resolveRun, rejectRun) => {
        const child = spawn(command, args, { cwd: workspace, env, stdio: "inherit", windowsHide: true });
        child.once("error", rejectRun);
        child.once("exit", (code) => {
            if (code === 0) resolveRun();
            else rejectRun(new Error(`${command} exited with code ${code ?? "unknown"}`));
        });
    });
}

async function collectFiles(directory) {
    try {
        const entries = await readdir(directory, { withFileTypes: true });
        const nestedFiles = await Promise.all(entries.map((entry) => {
            const fullPath = join(directory, entry.name);
            return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
        }));
        return nestedFiles.flat();
    } catch {
        return [];
    }
}
