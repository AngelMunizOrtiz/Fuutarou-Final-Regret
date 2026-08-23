import { mkdir, stat } from "node:fs/promises";
import { dirname, join, parse, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const publicDirectory = join(workspace, "public");
const outputDirectory = join(publicDirectory, "images", "memories", "thumbnails");

const sources = [
    join(publicDirectory, "images", "bg_title.webp"),
    ...[
        "frame1.webp",
        "frame2.webp",
        "frame3.webp",
        "frame4.webp",
        "frame5.webp",
        "frame5_5.webp",
        "frame6.webp",
        "frame7.webp",
        "Arrepentimiento Final.webp",
        "Arrepentimiento Final2.webp",
        "Arrepentimiento Final3.webp",
        "Arrepentimiento Final4.webp",
        "Arrepentimiento Final5.webp",
        "Arrepentimiento Final6.webp",
    ].map((file) => join(publicDirectory, "images", "memories", file)),
];

const ffmpeg = await findFfmpeg();
if (!ffmpeg) {
    throw new Error("FFmpeg is required to generate the gallery thumbnails.");
}

await mkdir(outputDirectory, { recursive: true });

for (const source of sources) {
    const output = join(outputDirectory, `${parse(source).name}.webp`);
    await runQuiet(ffmpeg, [
        "-hide_banner",
        "-loglevel", "error",
        "-y",
        "-i", source,
        "-vf", "scale='min(iw,640)':'min(ih,360)':force_original_aspect_ratio=decrease",
        "-frames:v", "1",
        "-map_metadata", "-1",
        "-c:v", "libwebp",
        "-quality", "84",
        "-compression_level", "5",
        "-pix_fmt", "yuv420p",
        output,
    ]);
}

const outputStats = await Promise.all(
    sources.map((source) => stat(join(outputDirectory, `${parse(source).name}.webp`))),
);
const outputBytes = outputStats.reduce((total, entry) => total + entry.size, 0);

console.log(
    `Gallery thumbnails ready: ${outputStats.length} files, ` +
    `${(outputBytes / 1024 / 1024).toFixed(1)} MB (max 640x360)`,
);
console.log(outputDirectory);

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
