import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const stagedPublicDirectory = join(workspace, ".codex-tmp", "full-windows-public");
const tauriCli = join(workspace, "node_modules", "@tauri-apps", "cli", "tauri.js");
const fullConfig = join(workspace, "src-tauri", "tauri.full.conf.json");

await run(process.execPath, [join(scriptDirectory, "prepare-full-public.mjs"), "--target=windows"], process.env);

const buildEnvironment = {
    ...process.env,
    VITE_PUBLIC_DIR: stagedPublicDirectory,
    VITE_DISABLE_PWA: "true",
    VITE_STORY_WEBP: await wereStoryPngsConverted(),
};

await run(
    process.execPath,
    [tauriCli, "build", "--bundles", "nsis", "--config", fullConfig, "--ci", "--no-sign"],
    buildEnvironment,
);

const releaseDirectory = join(workspace, "src-tauri", "target", "release");
const sourcePortable = join(releaseDirectory, "my-game.exe");
await stat(sourcePortable);

const nsisDirectory = join(releaseDirectory, "bundle", "nsis");
const installerFiles = (await collectFiles(nsisDirectory)).filter((file) => file.toLowerCase().endsWith(".exe"));
if (installerFiles.length === 0) {
    throw new Error(`Windows build completed but no NSIS installer was found under ${nsisDirectory}`);
}

const installerStats = await Promise.all(installerFiles.map(async (file) => ({ file, stats: await stat(file) })));
installerStats.sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);

const artifactDirectory = join(workspace, "artifacts", "windows");
const destinationPortable = join(artifactDirectory, "Fuutarou-Final-Regret-completo-windows-x64-portable.exe");
const destinationInstaller = join(artifactDirectory, "Fuutarou-Final-Regret-completo-windows-x64-setup.exe");

await mkdir(artifactDirectory, { recursive: true });
await copyFile(sourcePortable, destinationPortable);
await copyFile(installerStats[0].file, destinationInstaller);

const portableStats = await stat(destinationPortable);
const setupStats = await stat(destinationInstaller);
console.log(`Full portable ready: ${destinationPortable}`);
console.log(`Portable size: ${(portableStats.size / 1024 / 1024).toFixed(1)} MB`);
console.log(`Full installer ready: ${destinationInstaller}`);
console.log(`Installer size: ${(setupStats.size / 1024 / 1024).toFixed(1)} MB`);

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
        throw new Error("Full Windows image staging is incomplete: PNG/WebP derivatives are mixed or missing.");
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
    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(entries.map((entry) => {
        const fullPath = join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
    }));
    return nestedFiles.flat();
}
