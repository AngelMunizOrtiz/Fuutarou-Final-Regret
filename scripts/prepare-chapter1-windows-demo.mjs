import { copyFile, cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const publicDirectory = join(workspace, "public");
const temporaryRoot = join(workspace, ".codex-tmp");
const outputDirectory = join(temporaryRoot, "windows-chapter1-public");
let ffmpegLookup;

if (relative(temporaryRoot, outputDirectory).startsWith("..")) {
    throw new Error(`Unsafe demo output path: ${outputDirectory}`);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const directories = [
    "fonts",
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
    "robots.txt",
    "images/bg_title.webp",
    "images/logo_game.webp",
    "images/ui/Cajamenu.webp",
    "images/ui/cuaderno_menu_v2.webp",
    "images/ui/dialog_box_v2.webp",
    "images/ui/menu_sticker_base.webp",
    "images/ui/name_box_v2.webp",
    "images/ui/press-any-button-en.svg",
    "images/ui/press-any-button-es.svg",
    "audio/bgm/menu-mobile.m4a",
    "audio/bgm/splash-mobile.m4a",
    "videos/menu/menu.mp4",
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

await optimizeStoryImagesForWindows([
    join(outputDirectory, "images/memories"),
    join(outputDirectory, "images/backgrounds/chapter_01"),
    join(outputDirectory, "images/cg/chapter_01"),
    join(outputDirectory, "images/bg_title.webp"),
]);
await optimizeMenuVideoForWindows(join(outputDirectory, "videos/menu/menu.mp4"));

const stagedFiles = await collectFiles(outputDirectory);
const sizeBytes = (
    await Promise.all(stagedFiles.map(async (file) => (await stat(file)).size))
).reduce((total, size) => total + size, 0);

console.log(`Chapter 1 Windows public assets: ${stagedFiles.length} files, ${(sizeBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(outputDirectory);

async function copyRelativePath(relativePath) {
    const source = join(publicDirectory, relativePath);
    const destination = join(outputDirectory, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, force: true });
}

async function collectFiles(directory) {
    const directoryStats = await stat(directory);
    if (directoryStats.isFile()) return [directory];

    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(
        entries.map((entry) => {
            const fullPath = join(directory, entry.name);
            return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
        }),
    );
    return nestedFiles.flat();
}

async function optimizeStoryImagesForWindows(paths) {
    if (process.env.SKIP_WINDOWS_IMAGE_OPTIMIZATION === "true") {
        console.log("Windows image optimization skipped by environment.");
        return;
    }

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) {
        console.warn("FFmpeg was not found; Windows images keep their original resolution and encoding.");
        return;
    }

    const imageFiles = (await Promise.all(paths.map((path) => collectFiles(path))))
        .flat()
        .filter((file) => [".png", ".webp", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()));
    const beforeBytes = await totalFileSize(imageFiles);
    let optimizedCount = 0;

    for (const file of imageFiles) {
        const extension = extname(file).toLowerCase();
        const convertToWebp = extension === ".png";
        const outputFile = convertToWebp ? `${file.slice(0, -extension.length)}.webp` : file;
        const temporaryFile = `${outputFile}.windows-tmp${convertToWebp ? ".webp" : extension}`;
        const codecArguments = extension === ".webp" || convertToWebp
            ? ["-c:v", "libwebp", "-quality", "92", "-compression_level", "5", "-pix_fmt", "yuva420p"]
            : ["-q:v", "2"];

        try {
            await runQuiet(ffmpeg, [
                "-hide_banner",
                "-loglevel", "error",
                "-y",
                "-i", file,
                "-vf", "scale='min(iw,1920)':'min(ih,1080)':force_original_aspect_ratio=decrease",
                "-frames:v", "1",
                "-map_metadata", "-1",
                ...codecArguments,
                temporaryFile,
            ]);
            await copyFile(temporaryFile, outputFile);
            if (convertToWebp) await rm(file, { force: true });
            optimizedCount += 1;
        } catch (error) {
            console.warn(`Unable to optimize ${relative(outputDirectory, file)}: ${error.message}`);
        } finally {
            await rm(temporaryFile, { force: true });
        }
    }

    const optimizedImageFiles = (await Promise.all(paths.map((path) => collectFiles(path))))
        .flat()
        .filter((file) => [".webp", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()));
    const afterBytes = await totalFileSize(optimizedImageFiles);
    console.log(
        `Windows story images optimized: ${optimizedCount} files, ` +
        `${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ${(afterBytes / 1024 / 1024).toFixed(1)} MB (WebP, max 1920x1080)`,
    );
}

async function optimizeMenuVideoForWindows(videoFile) {
    if (process.env.SKIP_WINDOWS_VIDEO_OPTIMIZATION === "true") return;

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) return;

    const temporaryFile = `${videoFile}.windows-tmp.mp4`;
    const beforeBytes = (await stat(videoFile)).size;

    try {
        await runQuiet(ffmpeg, [
            "-hide_banner",
            "-loglevel", "error",
            "-y",
            "-i", videoFile,
            "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
            "-an",
            "-c:v", "libx264",
            "-preset", "slow",
            "-tune", "animation",
            "-crf", "20",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            temporaryFile,
        ]);
        await copyFile(temporaryFile, videoFile);
        const afterBytes = (await stat(videoFile)).size;
        console.log(
            `Windows menu video optimized: ${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ` +
            `${(afterBytes / 1024 / 1024).toFixed(1)} MB (1920x1080, 30 fps)`,
        );
    } catch (error) {
        console.warn(`Unable to optimize the Windows menu video: ${error.message}`);
    } finally {
        await rm(temporaryFile, { force: true });
    }
}

function findFfmpeg() {
    if (ffmpegLookup) return ffmpegLookup;

    ffmpegLookup = (async () => {
        const candidates = [
            process.env.FFMPEG_PATH,
            process.platform === "win32" ? "C:\\ffmpeg\\bin\\ffmpeg.exe" : undefined,
            process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg",
        ].filter(Boolean);

        for (const candidate of [...new Set(candidates)]) {
            try {
                await runQuiet(candidate, ["-version"]);
                return candidate;
            } catch {
                // Try the next candidate.
            }
        }
        return undefined;
    })();

    return ffmpegLookup;
}

async function totalFileSize(files) {
    return (await Promise.all(files.map(async (file) => (await stat(file)).size)))
        .reduce((total, size) => total + size, 0);
}

function runQuiet(command, args) {
    return new Promise((resolveRun, rejectRun) => {
        const child = spawn(command, args, {
            cwd: workspace,
            stdio: ["ignore", "ignore", "pipe"],
            windowsHide: true,
        });
        let errorOutput = "";

        child.stderr.on("data", (chunk) => {
            errorOutput += chunk.toString();
        });
        child.once("error", rejectRun);
        child.once("exit", (code) => {
            if (code === 0) resolveRun();
            else rejectRun(new Error(errorOutput.trim() || `${command} exited with code ${code ?? "unknown"}`));
        });
    });
}
