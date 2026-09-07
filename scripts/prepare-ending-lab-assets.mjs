// Deterministic packing of ImageGen plates. Originals are never overwritten.
// Usage: node scripts/prepare-ending-lab-assets.mjs --sharp <sharp package directory>
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharpOption = process.argv.indexOf("--sharp");
const sharp = require(sharpOption >= 0 ? process.argv[sharpOption + 1] : "sharp");
const root = fileURLToPath(new URL("../", import.meta.url));
const sources = path.join(root, "artwork/experiments/ending-lab");
const output = path.join(root, "experiments/ending-lab/assets");
await mkdir(output, { recursive: true });
const original = path.join(root, "public/images/cg/chapter_08/cg_041a_miku_answer_permission.png");
const { width, height } = await sharp(original).metadata();
const mask = await sharp(path.join(sources, "miku-mask.png"))
    .resize(width, height, { fit: "fill" }).grayscale().threshold(150).blur(0.65).raw().toBuffer();
// Join the generated matte to the ORIGINAL CG, preserving the original face and colors.
const originalRgb = await sharp(original).removeAlpha().raw().toBuffer();
const character = await sharp(originalRgb, { raw: { width, height, channels: 3 } })
    .joinChannel(mask, { raw: { width, height, channels: 1 } }).png().toBuffer();
await sharp(character).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(output, "miku.webp"));
await sharp(path.join(sources, "street-clean.png")).resize(width, height, { fit: "fill" })
    .webp({ quality: 88 }).toFile(path.join(output, "street.webp"));
await sharp(original).webp({ quality: 90 }).toFile(path.join(output, "original.webp"));

// Restrict the generated blink to feathered eye patches so the rest of the face
// cannot jump or change color when blinking. Coordinates refer to the original CG.
const eyeRect = { left: 680, top: 135, width: 224, height: 116 };
const alpha = Buffer.alloc(eyeRect.width * eyeRect.height);
for (let y = 0; y < eyeRect.height; y++) {
    for (let x = 0; x < eyeRect.width; x++) {
        let opacity = 0;
        for (const [cx, cy, rx, ry] of [[741, 205, 47, 30], [855, 179, 43, 30]]) {
            const dx = x + eyeRect.left - cx;
            const dy = y + eyeRect.top - cy;
            const angle = -0.22;
            const u = dx * Math.cos(angle) + dy * Math.sin(angle);
            const v = -dx * Math.sin(angle) + dy * Math.cos(angle);
            const distance = Math.sqrt((u / rx) ** 2 + (v / ry) ** 2);
            opacity = Math.max(opacity, Math.max(0, Math.min(1, (1 - distance) / 0.16)));
        }
        alpha[y * eyeRect.width + x] = Math.round(opacity * 255);
    }
}
const eyeRgb = await sharp(path.join(sources, "miku-closed.png")).resize(width, height, { fit: "fill" })
    .extract(eyeRect).removeAlpha().raw().toBuffer();
await sharp(eyeRgb, { raw: { width: eyeRect.width, height: eyeRect.height, channels: 3 } })
    .joinChannel(alpha, { raw: { width: eyeRect.width, height: eyeRect.height, channels: 1 } })
    .webp({ lossless: true }).toFile(path.join(output, "eyes-closed.webp"));

// Android preview loads the smaller copies, not the desktop-size textures.
for (const name of ["street", "miku", "original"]) {
    await sharp(path.join(output, `${name}.webp`)).resize(1152)
        .webp({ quality: 85, alphaQuality: 100 }).toFile(path.join(output, `${name}-lite.webp`));
}
await writeFile(path.join(output, "registration.json"), JSON.stringify({ width, height, eyeRect }, null, 2) + "\n");
for (const name of ["miku.webp", "miku-lite.webp", "eyes-closed.webp"]) {
    if (!(await sharp(path.join(output, name)).metadata()).hasAlpha) throw new Error(`Missing transparency: ${name}`);
}
console.log(`Ending plates packed: ${width} × ${height}; lite width 1152; eyes patch ${eyeRect.width} × ${eyeRect.height}.`);
