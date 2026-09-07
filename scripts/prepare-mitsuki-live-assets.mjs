// Pack the user's stills and ImageGen animation plates. Never modifies the masters.
import { createRequire } from "node:module";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const option = process.argv.indexOf("--sharp");
const sharp = require(option >= 0 ? process.argv[option + 1] : "sharp");
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "public/images/cg/epilogue-mitsuki/background-fixed");
const artwork = path.join(root, "artwork/experiments/ending-lab/mitsuki");
const output = path.join(root, "experiments/ending-lab/assets/mitsuki");
const manifest = JSON.parse(await readFile(path.join(root, "experiments/ending-lab/mitsuki-assets.json"), "utf8"));
await mkdir(output, { recursive: true });
async function pack(name, input) {
    for (const [profile, width, quality] of [["full", 1672, 90], ["lite", 1152, 84]]) {
        await sharp(input).resize(width).webp({ quality, alphaQuality: 100 }).toFile(path.join(output, `${name}-${profile}.webp`));
    }
}
for (const [name, file] of Object.entries(manifest)) {
    if (path.basename(file) !== file) throw new Error("Use a filename inside background-fixed.");
    await pack(name, path.join(source, file));
}
const original = path.join(source, manifest.hero);
const { width, height } = await sharp(original).metadata();
const mask = await sharp(path.join(artwork, "mask.png")).resize(width, height, { fit: "fill" })
    .grayscale().threshold(150).blur(0.65).raw().toBuffer();
const originalRgb = await sharp(original).removeAlpha().raw().toBuffer();
const child = await sharp(originalRgb, { raw: { width, height, channels: 3 } })
    .joinChannel(mask, { raw: { width, height, channels: 1 } }).png().toBuffer();
await pack("child", child);
await pack("room", await sharp(path.join(artwork, "room.png")).resize(width, height, { fit: "fill" }).png().toBuffer());
// Only the two eye regions change during a blink. The face and hair stay original.
const eyeRect = { left: 731, top: 292, width: 257, height: 139 };
const alpha = Buffer.alloc(eyeRect.width * eyeRect.height);
for (let y = 0; y < eyeRect.height; y++) for (let x = 0; x < eyeRect.width; x++) {
    let opacity = 0;
    for (const [cx, cy, rx, ry] of [[784, 330, 46, 33], [930, 378, 48, 37]]) {
        const dx = x + eyeRect.left - cx, dy = y + eyeRect.top - cy;
        const u = dx * Math.cos(0.31) + dy * Math.sin(0.31);
        const v = -dx * Math.sin(0.31) + dy * Math.cos(0.31);
        const radius = Math.hypot(u / rx, v / ry);
        opacity = Math.max(opacity, Math.max(0, Math.min(1, (1 - radius) / 0.17)));
    }
    alpha[y * eyeRect.width + x] = Math.round(opacity * 255);
}
const eyeRgb = await sharp(path.join(artwork, "blink.png")).resize(width, height, { fit: "fill" }).extract(eyeRect).removeAlpha().raw().toBuffer();
await sharp(eyeRgb, { raw: { width: eyeRect.width, height: eyeRect.height, channels: 3 } })
    .joinChannel(alpha, { raw: { width: eyeRect.width, height: eyeRect.height, channels: 1 } })
    .webp({ lossless: true }).toFile(path.join(output, "eyes.webp"));
await writeFile(path.join(output, "registration.json"), JSON.stringify({ width, height, eyeRect }, null, 2) + "\n");
await copyFile(path.join(source, "antent - hope to see you again.mp3"), path.join(output, "reference.mp3"));
for (const name of ["child-full.webp", "child-lite.webp", "eyes.webp"]) {
    if (!(await sharp(path.join(output, name)).metadata()).hasAlpha) throw new Error(`Missing transparency: ${name}`);
}
console.log(`Packed ${Object.keys(manifest).length} CG, room, child and eye patch for full/lite, plus reference music.`);
