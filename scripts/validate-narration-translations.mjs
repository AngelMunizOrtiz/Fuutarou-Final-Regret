import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

globalThis.document = { createElement: () => ({ canPlayType: () => "" }) };
globalThis.window = { AudioContext: undefined, webkitAudioContext: undefined };

const { convertInkText, generateJsonInkTranslation } = await import("@drincs/pixi-vn-ink");
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chaptersDirectory = path.join(repoRoot, "src", "ink", "chapters");
const translationsDirectory = path.join(repoRoot, "src", "locales", "narration_es");
const chapterArgument = process.argv.find((argument) => argument.startsWith("--chapter="))?.split("=")[1];
const chapterFiles = fs
    .readdirSync(chaptersDirectory)
    .filter((name) => /^chapter_\d+\.ink$/.test(name))
    .filter((name) => !chapterArgument || name === `chapter_${chapterArgument.padStart(2, "0")}.ink`)
    .sort();
const englishPattern =
    /\b(the|a|an|and|or|but|is|are|was|were|to|of|in|on|for|with|from|that|this|you|your|he|she|his|her|they|we|what|why|how|chapter|end)\b/i;

let sourceTotal = 0;
let translatedTotal = 0;
let hasErrors = false;

for (const chapterFile of chapterFiles) {
    const source = fs.readFileSync(path.join(chaptersDirectory, chapterFile), "utf8");
    const parsed = await convertInkText(source);
    const sourceTranslations = {};
    await generateJsonInkTranslation(parsed, sourceTranslations);

    const translationFile = chapterFile.replace(".ink", ".json");
    const translationPath = path.join(translationsDirectory, translationFile);
    const translations = fs.existsSync(translationPath)
        ? JSON.parse(fs.readFileSync(translationPath, "utf8"))
        : {};
    const sourceKeys = Object.keys(sourceTranslations);
    const translationKeys = Object.keys(translations);
    const missing = sourceKeys.filter((key) => !(key in translations));
    const extra = translationKeys.filter((key) => !(key in sourceTranslations));
    const unchangedEnglish = sourceKeys.filter(
        (key) => translations[key] === key && englishPattern.test(key.replace(/^[a-z_]+:\s*/i, "")),
    );

    sourceTotal += sourceKeys.length;
    translatedTotal += sourceKeys.length - missing.length - unchangedEnglish.length;
    if (missing.length || extra.length || unchangedEnglish.length) hasErrors = true;

    console.log(
        `${chapterFile}: ${sourceKeys.length - missing.length - unchangedEnglish.length}/${sourceKeys.length}` +
            ` translated, ${missing.length} missing, ${unchangedEnglish.length} unchanged, ${extra.length} extra`,
    );
    if (missing.length) console.log("  Missing:", missing);
    if (unchangedEnglish.length) console.log("  Unchanged:", unchangedEnglish);
    if (extra.length) console.log("  Extra:", extra);
}

console.log(`Total: ${translatedTotal}/${sourceTotal} translated`);
if (hasErrors) process.exitCode = 1;
