import { copyFile, cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, extname, join, relative, resolve } from "node:path";
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
    "images/ui",
    "images/memories",
    "images/backgrounds/chapter_01",
    "images/cg/chapter_01",
    "images/characters/fuutarou/chapter_01",
    "audio/sfx_menu_button",
];

const files = [
    "apple-touch-icon.png",
    "favicon.ico",
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

await optimizeStoryImagesForAndroid([
    join(outputDirectory, "images/memories"),
    join(outputDirectory, "images/backgrounds/chapter_01"),
    join(outputDirectory, "images/cg/chapter_01"),
    join(outputDirectory, "images/bg_title.webp"),
]);
await optimizeUiImagesForAndroid([
    { file: join(outputDirectory, "images/ui/Cajamenu.webp"), width: 760, height: 900 },
    { file: join(outputDirectory, "images/ui/cuaderno_menu_v2.webp"), width: 768, height: 1154 },
    { file: join(outputDirectory, "images/ui/game_select_mode_header.webp"), width: 1158, height: 144 },
    { file: join(outputDirectory, "images/ui/menu_sticker_base.webp"), width: 640, height: 180 },
    { file: join(outputDirectory, "images/ui/dialog_box.webp"), width: 1280, height: 204 },
    { file: join(outputDirectory, "images/ui/dialog_box_v2.webp"), width: 1280, height: 204 },
]);
await optimizeMenuVideoForAndroid(join(outputDirectory, "videos/menu/menu-mobile.mp4"));

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

async function optimizeStoryImagesForAndroid(paths) {
    if (process.env.SKIP_ANDROID_IMAGE_OPTIMIZATION === "true") {
        console.log("Android image optimization skipped by environment.");
        return;
    }

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) {
        console.warn("FFmpeg was not found; Android images keep their original resolution.");
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
        const temporaryFile = `${outputFile}.android-tmp${convertToWebp ? ".webp" : extension}`;
        const codecArguments = extension === ".webp" || convertToWebp
            ? ["-c:v", "libwebp", "-quality", "86", "-compression_level", "5", "-pix_fmt", "yuva420p"]
            : ["-q:v", "3"];

        try {
            await runQuiet(ffmpeg, [
                "-hide_banner",
                "-loglevel", "error",
                "-y",
                "-i", file,
                "-vf", "scale='min(iw,1280)':'min(ih,720)':force_original_aspect_ratio=decrease:force_divisible_by=2",
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
        `Android story images optimized: ${optimizedCount} files, ` +
        `${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ${(afterBytes / 1024 / 1024).toFixed(1)} MB (WebP, max 1280x720)`,
    );
}

async function findFfmpeg() {
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
}

async function optimizeUiImagesForAndroid(entries) {
    const ffmpeg = await findFfmpeg();
    if (!ffmpeg || process.env.SKIP_ANDROID_IMAGE_OPTIMIZATION === "true") return;

    for (const { file, width, height } of entries) {
        const temporaryFile = `${file}.android-ui-tmp.webp`;
        try {
            await runQuiet(ffmpeg, [
                "-hide_banner",
                "-loglevel", "error",
                "-y",
                "-i", file,
                "-vf", `scale='min(iw,${width})':'min(ih,${height})':force_original_aspect_ratio=decrease:force_divisible_by=2`,
                "-frames:v", "1",
                "-map_metadata", "-1",
                "-c:v", "libwebp",
                "-quality", "88",
                "-compression_level", "5",
                "-pix_fmt", "yuva420p",
                temporaryFile,
            ]);
            await copyFile(temporaryFile, file);
        } catch (error) {
            console.warn(`Unable to optimize Android UI ${relative(outputDirectory, file)}: ${error.message}`);
        } finally {
            await rm(temporaryFile, { force: true });
        }
    }
}

async function optimizeMenuVideoForAndroid(videoFile) {
    const ffmpeg = await findFfmpeg();
    if (!ffmpeg || process.env.SKIP_ANDROID_VIDEO_OPTIMIZATION === "true") return;

    const temporaryFile = `${videoFile}.android-tmp.mp4`;
    const beforeBytes = (await stat(videoFile)).size;

    try {
        await runQuiet(ffmpeg, [
            "-hide_banner",
            "-loglevel", "error",
            "-y",
            "-i", videoFile,
            "-vf", "scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
            "-an",
            "-c:v", "libx264",
            "-preset", "fast",
            "-tune", "animation",
            "-crf", "25",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            temporaryFile,
        ]);
        await copyFile(temporaryFile, videoFile);
        const afterBytes = (await stat(videoFile)).size;
        console.log(
            `Android menu video optimized: ${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ` +
            `${(afterBytes / 1024 / 1024).toFixed(1)} MB (1280x720, 30 fps)`,
        );
    } catch (error) {
        console.warn(`Unable to optimize the Android menu video: ${error.message}`);
    } finally {
        await rm(temporaryFile, { force: true });
    }
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
