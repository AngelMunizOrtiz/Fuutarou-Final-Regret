import { RegisteredCharacters } from "@drincs/pixi-vn";
import {
    convertInkText,
    HashtagCommands,
    importInkText,
    onInkTranslate,
    onReplaceTextBeforeTranslation,
} from "@drincs/pixi-vn-ink";
import { SCENE_ROUTE } from "../constans";
import { preloadCharacterSprite } from "../data/characterSprites";
import useCharacterStageStore, { isCharacterStageSlotName } from "../stores/useCharacterStageStore";
import { isChapterOneDemoBuild } from "./performance-profile";

export const STORY_SCENE_TRANSITION_FLAG = "__pixi_vn_story_scene_transition";
let inkRuntimeInitialized = false;

export function setStorySceneTransition(value: boolean) {
    (window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG] = value;
}

export function isStorySceneTransition() {
    return Boolean((window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG]);
}

async function getInkText() {
    const files = isChapterOneDemoBuild
        ? import.meta.glob<string>(["../ink/start.ink", "../ink/chapters/chapter_01.ink"], {
              eager: true,
              import: "default",
          })
        : import.meta.glob<string>("../ink/**/*.ink", { eager: true, import: "default" });
    const rootPath = "../ink/start.ink";
    const root = files[rootPath];

    if (!root) {
        throw new Error(`Ink root file not found: ${rootPath}`);
    }

    const chapters = Object.entries(files)
        .filter(([path]) => path !== rootPath)
        .filter(([path]) => !isChapterOneDemoBuild || path.endsWith("/chapter_01.ink"))
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, "en"))
        .map(([, content]) => {
            const trimmedContent = content.trim();
            return isChapterOneDemoBuild ? createChapterOneDemoInk(trimmedContent) : trimmedContent;
        });

    return [`${root.trim()}\n\n${chapters.join("\n\n")}\n\n`];
}

function createChapterOneDemoInk(chapter: string) {
    const extraLabel = "=== chapter_1_extra ===";
    const labelIndex = chapter.indexOf(extraLabel);
    if (labelIndex < 0) return chapter;

    const mainChapter = chapter
        .slice(0, labelIndex)
        .replace(/\n\* Continuar al capitulo 2\s*\n-> chapter_2\s*$/u, "")
        .trimEnd();
    const extraChapter = chapter
        .slice(labelIndex)
        .replace(/\n\* Continuar al capitulo 2\s*\n-> chapter_2\s*$/u, "\n-> END")
        .trimEnd();

    return `${mainChapter}\n\n${extraChapter}`;
}

export async function importAllInkLabels() {
    const fileEntries = await getInkText();
    await importInkText(fileEntries);
}

export async function convertInkToJson() {
    const fileEntries = await getInkText();
    return await Promise.all(fileEntries.map((data) => convertInkText(data)));
}

export function initializeInk(options: { t: (key: string) => string }) {
    const { t } = options;
    if (!inkRuntimeInitialized) {
        HashtagCommands.add(async (script, props) => {
            if (script.length === 2) {
                if (script[0] === "navigate") {
                    await props.navigate(script[1]);
                    return true;
                }
            }
            if (script[0] === "scene" && script.length >= 3) {
                const sceneId = script[1];
                const returnLabel = script[2];
                const mode = script[3] || "jump";
                setStorySceneTransition(true);
                await props.navigate(
                    `${SCENE_ROUTE}/${encodeURIComponent(sceneId)}?returnLabel=${encodeURIComponent(returnLabel)}&mode=${encodeURIComponent(mode)}`,
                );
                return true;
            }
            if (script[0] === "sprite" && script.length >= 2) {
                const stage = useCharacterStageStore.getState();

                if (script[1] === "hide") {
                    if (script[2] === "all") {
                        stage.clear();
                        return true;
                    }

                    if (script[2] && isCharacterStageSlotName(script[2])) {
                        stage.hideSlot(script[2]);
                        return true;
                    }
                }

                if (isCharacterStageSlotName(script[1]) && script[2]) {
                    const options = new Set(script.slice(4));

                    await preloadCharacterSprite(script[2], script[3]);
                    stage.showCharacter(script[1], script[2], script[3], {
                        mirror: options.has("flip") || options.has("mirror"),
                    });
                    return true;
                }
            }
            if (script[0] === "rename" && script.length === 3) {
                const character = RegisteredCharacters.get(script[1]);
                if (character) {
                    character.name = script[2];
                }
                return true;
            }
            return false;
        });
        onReplaceTextBeforeTranslation((key) => {
            return `{{${key}}}`;
        });
        inkRuntimeInitialized = true;
    }

    onInkTranslate(t);
}
