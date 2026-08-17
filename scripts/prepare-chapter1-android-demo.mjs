import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const publicDirectory = join(workspace, "public");
const temporaryRoot = join(workspace, ".codex-tmp");
const outputDirectory = join(temporaryRoot, "android-chapter1-public");

if (relative(temporaryRoot, outputDirectory).startsWith("..")) {
    throw new Error(`Unsafe demo output path: ${outputDirectory}`);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const directories = [
    "fonts",
    "images/ui",
    "images/vfx",
    "images/memories",
    "images/backgrounds/chapter_01",
    "images/cg/chapter_01",
    "images/characters/fuutarou/chapter_01",
    "audio/sfx_menu_button",
];

const files = [
    "apple-touch-icon.png",
    "favicon.ico",
    "mask-icon.svg",
    "pwa-192x192.png",
    "pwa-512x512.png",
    "robots.txt",
    "images/bg_title.webp",
    "images/logo_game.webp",
    "images/pressanybutton.webp",
    "audio/bgm/menu-mobile.m4a",
    "audio/bgm/splash-mobile.m4a",
    "videos/menu/menu-mobile.mp4",
];

for (const directory of directories) {
    await copyRelativePath(directory);
}

for (const file of files) {
    await copyRelativePath(file);
}

const takedaDirectory = join(publicDirectory, "images/characters/takeda");
for (const entry of await readdir(takedaDirectory, { withFileTypes: true })) {
    if (entry.isFile()) {
        await copyRelativePath(join("images/characters/takeda", entry.name));
    }
}

const stagedFiles = await collectFiles(outputDirectory);
const sizeBytes = (
    await Promise.all(stagedFiles.map(async (file) => (await stat(file)).size))
).reduce((total, size) => total + size, 0);

console.log(`Chapter 1 Android public assets: ${stagedFiles.length} files, ${(sizeBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(outputDirectory);

async function copyRelativePath(relativePath) {
    const source = join(publicDirectory, relativePath);
    const destination = join(outputDirectory, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, force: true });
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
