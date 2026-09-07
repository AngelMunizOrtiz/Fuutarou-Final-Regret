// Extract seekable animation frames from the user's existing clips. No ending video export.
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const option = process.argv.indexOf("--sharp");
const sharp = createRequire(import.meta.url)(option >= 0 ? process.argv[option + 1] : "sharp");
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const directory = path.join(root, "public/images/cg/epilogue-mitsuki/background-fixed");
const output = path.join(root, "experiments/ending-lab/assets/mitsuki");
const clips = JSON.parse(await readFile(path.join(root, "experiments/ending-lab/mitsuki-motion.json"), "utf8"));
await mkdir(output, { recursive: true });
const columns = 4, inventory = {};
for (const [name, clip] of Object.entries(clips)) {
    if (path.basename(clip.file) !== clip.file || !(clip.to > clip.from) || clip.frames < 2) throw new Error(`Invalid clip: ${name}`);
    const frames = [];
    for (let i = 0; i < clip.frames; i++) {
        const time = clip.from + (clip.to - clip.from) * i / (clip.frames - 1);
        const frame = execFileSync(ffmpeg, ["-v", "error", "-ss", String(time), "-i", path.join(directory, clip.file),
            "-frames:v", "1", "-vf", "scale=768:432:force_original_aspect_ratio=decrease,pad=768:432:(ow-iw)/2:(oh-ih)/2:color=0xfff6ed",
            "-threads", "1", "-f", "image2pipe", "-vcodec", "png", "pipe:1"], { windowsHide: true, maxBuffer: 6000000 });
        frames.push(frame);
    }
    const rows = Math.ceil(clip.frames / columns);
    for (const [profile, width, height, quality] of [["full", 768, 432, 89], ["lite", 512, 288, 84]]) {
        const cells = await Promise.all(frames.map(async (frame, i) => ({
            input: await sharp(frame).resize(width, height).png().toBuffer(), left: i % columns * width, top: Math.floor(i / columns) * height,
        })));
        await sharp({ create: { width: width * columns, height: height * rows, channels: 3, background: "#fff6ed" } })
            .composite(cells).webp({ quality }).toFile(path.join(output, `${name}-motion-${profile}.webp`));
        await sharp(frames[0]).resize(width, height).webp({ quality }).toFile(path.join(output, `${name}-${profile}.webp`));
    }
    inventory[name] = { ...clip, columns, rows };
    console.log(`${name}: ${clip.frames} frames, ${clip.from}-${clip.to} s`);
}
await writeFile(path.join(output, "motion-registration.json"), JSON.stringify(inventory, null, 2) + "\n");
console.log(`${Object.keys(clips).length} frame sequences / ${Object.values(clips).reduce((n, clip) => n + clip.frames, 0)} extracted frames.`);
