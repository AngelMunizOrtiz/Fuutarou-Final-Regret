import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const stagedPublicDirectory = join(workspace, ".codex-tmp", "windows-chapter1-public");
const tauriCli = join(workspace, "node_modules", "@tauri-apps", "cli", "tauri.js");
const demoConfig = join(workspace, "src-tauri", "tauri.chapter1-demo.conf.json");

await run(process.execPath, [join(scriptDirectory, "prepare-chapter1-windows-demo.mjs")], process.env);

const buildEnvironment = {
    ...process.env,
    VITE_PUBLIC_DIR: stagedPublicDirectory,
    VITE_CHAPTER1_DEMO: "true",
    VITE_DISABLE_PWA: "true",
    VITE_STORY_WEBP: "true",
};

await run(
    process.execPath,
    [tauriCli, "build", "--bundles", "nsis", "--config", demoConfig, "--ci", "--no-sign"],
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
const destinationPortable = join(
    artifactDirectory,
    "Fuutarou-Final-Regret-demo-capitulo-1-extra-windows-x64-portable.exe",
);
const destinationInstaller = join(
    artifactDirectory,
    "Fuutarou-Final-Regret-demo-capitulo-1-extra-windows-x64-setup.exe",
);

await mkdir(artifactDirectory, { recursive: true });
await copyFile(sourcePortable, destinationPortable);
await copyFile(installerStats[0].file, destinationInstaller);

const portableStats = await stat(destinationPortable);
const setupStats = await stat(destinationInstaller);
console.log(`Portable demo ready: ${destinationPortable}`);
console.log(`Portable size: ${(portableStats.size / 1024 / 1024).toFixed(1)} MB`);
console.log(`Installer ready: ${destinationInstaller}`);
console.log(`Installer size: ${(setupStats.size / 1024 / 1024).toFixed(1)} MB`);

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
