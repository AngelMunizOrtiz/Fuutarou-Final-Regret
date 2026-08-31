import { copyFile, cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const targetArgument = process.argv.find((argument) => argument.startsWith("--target="));
const target = targetArgument?.slice("--target=".length);
if (target !== "windows" && target !== "android") {
    throw new Error("Usage: node scripts/prepare-full-public.mjs --target=windows|android");
}

const profile = target === "android"
    ? {
          storyWidth: 1152,
          storyHeight: 648,
          storyQuality: 86,
          spriteWidth: 960,
          spriteHeight: 1440,
          spriteQuality: 88,
          menuVideoWidth: 1280,
          menuVideoHeight: 720,
          menuVideoFps: 24,
          omitMenuVideo: true,
      }
    : {
          storyWidth: 1920,
          storyHeight: 1080,
          storyQuality: 92,
          spriteWidth: 1440,
          spriteHeight: 2160,
          spriteQuality: 92,
          menuVideoWidth: 1920,
          menuVideoHeight: 1080,
          menuVideoFps: 30,
          omitMenuVideo: false,
      };

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const publicDirectory = join(workspace, "public");
const temporaryRoot = join(workspace, ".codex-tmp");
const outputDirectory = join(temporaryRoot, `full-${target}-public`);
let ffmpegLookup;
const excludedPublicFiles = new Set([
    "audio/bgm/menu.wav",
    "audio/bgm/splash.wav",
    ...(profile.omitMenuVideo ? ["videos/menu/menu.mp4"] : []),
]);

if (relative(temporaryRoot, outputDirectory).startsWith("..")) {
    throw new Error(`Unsafe full-build output path: ${outputDirectory}`);
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(publicDirectory, outputDirectory, {
    recursive: true,
    force: true,
    filter(source) {
        const sourceRelativePath = relative(publicDirectory, source).replaceAll("\\", "/");
        return !excludedPublicFiles.has(sourceRelativePath);
    },
});

await optimizeVisualDirectory("images/backgrounds", {
    width: profile.storyWidth,
    height: profile.storyHeight,
    quality: profile.storyQuality,
    convertPngToWebp: true,
});
await optimizeVisualDirectory("images/cg", {
    width: profile.storyWidth,
    height: profile.storyHeight,
    quality: profile.storyQuality,
    convertPngToWebp: true,
});
await optimizeVisualDirectory("images/memories", {
    width: profile.storyWidth,
    height: profile.storyHeight,
    quality: profile.storyQuality,
    convertPngToWebp: false,
});
await optimizeVisualDirectory("images/characters", {
    width: profile.spriteWidth,
    height: profile.spriteHeight,
    quality: profile.spriteQuality,
    convertPngToWebp: false,
});
await optimizeMenuVideo();

const stagedFiles = await collectFiles(outputDirectory);
const sizeBytes = await totalFileSize(stagedFiles);
console.log(`Full ${target} public assets: ${stagedFiles.length} files, ${(sizeBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(outputDirectory);

async function optimizeVisualDirectory(relativeDirectory, { width, height, quality, convertPngToWebp }) {
    const directory = join(outputDirectory, relativeDirectory);
    const files = (await collectFiles(directory)).filter((file) =>
        [".png", ".webp", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()),
    );
    if (files.length === 0) return;

    if (process.env.SKIP_FULL_IMAGE_OPTIMIZATION === "true") {
        console.log(`Full ${target} optimization skipped for ${relativeDirectory}.`);
        return;
    }

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) {
        console.warn(`FFmpeg was not found; ${relativeDirectory} keeps its source encoding.`);
        return;
    }

    const beforeBytes = await totalFileSize(files);
    let optimizedCount = 0;

    for (const file of files) {
        const extension = extname(file).toLowerCase();
        const reencodeAsWebp = convertPngToWebp && extension === ".png";
        const outputFile = reencodeAsWebp ? `${file.slice(0, -extension.length)}.webp` : file;
        const temporaryFile = `${outputFile}.${target}-tmp${reencodeAsWebp ? ".webp" : extension}`;
        const codecArguments = extension === ".webp" || reencodeAsWebp
            ? ["-c:v", "libwebp", "-quality", String(quality), "-compression_level", "5", "-pix_fmt", "yuva420p"]
            : ["-q:v", target === "android" ? "3" : "2"];

        try {
            await runQuiet(ffmpeg, [
                "-hide_banner",
                "-loglevel", "error",
                "-y",
                "-i", file,
                "-vf",
                `scale='min(iw,${width})':'min(ih,${height})':force_original_aspect_ratio=decrease:force_divisible_by=2`,
                "-frames:v",
                "1",
                "-map_metadata",
                "-1",
                ...codecArguments,
                temporaryFile,
            ]);
            await copyFile(temporaryFile, outputFile);
            if (reencodeAsWebp) await rm(file, { force: true });
            optimizedCount += 1;
        } catch (error) {
            console.warn(`Unable to optimize ${relative(outputDirectory, file)}: ${error.message}`);
        } finally {
            await rm(temporaryFile, { force: true });
        }
    }

    const afterFiles = (await collectFiles(directory)).filter((file) =>
        [".png", ".webp", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()),
    );
    const afterBytes = await totalFileSize(afterFiles);
    console.log(
        `Full ${target} ${relativeDirectory}: ${optimizedCount} files, ` +
        `${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ${(afterBytes / 1024 / 1024).toFixed(1)} MB ` +
        `(max ${width}x${height})`,
    );
}

async function optimizeMenuVideo() {
    if (profile.omitMenuVideo || process.env.SKIP_FULL_VIDEO_OPTIMIZATION === "true") return;

    const videoFile = join(outputDirectory, "videos", "menu", "menu.mp4");
    try {
        await stat(videoFile);
    } catch {
        return;
    }

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) return;

    const temporaryFile = `${videoFile}.${target}-tmp.mp4`;
    const beforeBytes = (await stat(videoFile)).size;
    try {
        await runQuiet(ffmpeg, [
            "-hide_banner",
            "-loglevel", "error",
            "-y",
            "-i", videoFile,
            "-vf",
            `scale=${profile.menuVideoWidth}:${profile.menuVideoHeight}:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=${profile.menuVideoFps}`,
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-tune",
            "animation",
            "-crf",
            target === "android" ? "24" : "20",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            temporaryFile,
        ]);
        await copyFile(temporaryFile, videoFile);
        const afterBytes = (await stat(videoFile)).size;
        console.log(
            `Full ${target} menu video: ${(beforeBytes / 1024 / 1024).toFixed(1)} MB -> ` +
            `${(afterBytes / 1024 / 1024).toFixed(1)} MB (${profile.menuVideoWidth}x${profile.menuVideoHeight}, ${profile.menuVideoFps} fps)`,
        );
    } catch (error) {
        console.warn(`Unable to optimize the full ${target} menu video: ${error.message}`);
    } finally {
        await rm(temporaryFile, { force: true });
    }
}

async function collectFiles(directory) {
    try {
        const directoryStats = await stat(directory);
        if (directoryStats.isFile()) return [directory];
    } catch {
        return [];
    }

    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(
        entries.map((entry) => {
            const fullPath = join(directory, entry.name);
            return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
        }),
    );
    return nestedFiles.flat();
}

async function totalFileSize(files) {
    return (await Promise.all(files.map(async (file) => (await stat(file)).size)))
        .reduce((total, size) => total + size, 0);
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
