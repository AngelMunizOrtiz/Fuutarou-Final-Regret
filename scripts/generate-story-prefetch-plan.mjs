import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const chaptersDirectory = join(workspace, "src", "ink", "chapters");
const outputFile = join(workspace, "src", "assets", "generatedStoryPrefetchPlan.ts");

const chapterFiles = (await readdir(chaptersDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^chapter_\d+\.ink$/i.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name, "en", { numeric: true }));

const assetSequences = {};
const spriteSequences = {};

for (const chapterFile of chapterFiles) {
    const chapterNumber = Number(/chapter_(\d+)/i.exec(chapterFile.name)?.[1]);
    const chapter = await readFile(join(chaptersDirectory, chapterFile.name), "utf8");
    const assets = [];
    const sprites = [];

    for (const line of chapter.split(/\r?\n/)) {
        const assetMatch = /^#\s*show\s+image\s+\S+\s+(\S+)/i.exec(line.trim());
        if (assetMatch) {
            assets.push(assetMatch[1]);
            continue;
        }

        const spriteMatch = /^#\s*sprite\s+(?:left|center|right)\s+(\S+)\s+(\S+)/i.exec(line.trim());
        if (spriteMatch && spriteMatch[1].toLowerCase() !== "hide") {
            sprites.push([spriteMatch[1].toLowerCase(), spriteMatch[2]]);
        }
    }

    assetSequences[chapterNumber] = assets;
    spriteSequences[chapterNumber] = sprites;
}

const output = `// This file is generated from src/ink/chapters by
// scripts/generate-story-prefetch-plan.mjs. Do not edit it by hand.

export type StorySpritePrefetchEntry = readonly [characterId: string, expression: string];

export const storyAssetSequenceByChapter: Readonly<Record<number, readonly string[]>> = ${JSON.stringify(assetSequences, null, 4)};

export const storySpriteSequenceByChapter: Readonly<Record<number, readonly StorySpritePrefetchEntry[]>> = ${JSON.stringify(spriteSequences, null, 4)};
`;

await writeFile(outputFile, output, "utf8");
console.log(`Story prefetch plan ready: ${chapterFiles.length} chapters`);
console.log(outputFile);
