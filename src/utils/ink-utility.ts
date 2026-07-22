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

export const STORY_SCENE_TRANSITION_FLAG = "__pixi_vn_story_scene_transition";

export function setStorySceneTransition(value: boolean) {
    (window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG] = value;
}

export function isStorySceneTransition() {
    return Boolean((window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG]);
}

async function getInkText() {
    const files = import.meta.glob<string>("../ink/**/*.ink", { eager: true, import: "default" });
    const rootPath = "../ink/start.ink";
    const root = files[rootPath];

    if (!root) {
        throw new Error(`Ink root file not found: ${rootPath}`);
    }

    const chapters = Object.entries(files)
        .filter(([path]) => path !== rootPath)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, "en"))
        .map(([, content]) => content.trim());

    return [`${root.trim()}\n\n${chapters.join("\n\n")}\n\n`];
}

export async function importAllInkLabels() {
    let fileEntries = await getInkText();
    await importInkText(fileEntries);
}

export async function convertInkToJson() {
    let fileEntries = await getInkText();
    return await Promise.all(fileEntries.map((data) => convertInkText(data)));
}

export function initializeInk(options: { t: (key: string) => string }) {
    const { t } = options;
    HashtagCommands.add(async (script, props, _convertListStringToObj) => {
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
            let character = RegisteredCharacters.get(script[1]);
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
    onInkTranslate(t);
}
