import { RegisteredCharacters } from "@drincs/pixi-vn";
import {
    HashtagCommands,
    importJson,
    onInkTranslate,
    onReplaceTextBeforeTranslation,
} from "@drincs/pixi-vn-ink";
import compiledInkStory from "virtual:compiled-ink-story";
import { SCENE_ROUTE } from "../constans";
import { preloadCharacterSprite } from "../data/characterSprites";
import useCharacterStageStore, { isCharacterStageSlotName } from "../stores/useCharacterStageStore";
import { performanceProfile } from "./performance-profile";

export const STORY_SCENE_TRANSITION_FLAG = "__pixi_vn_story_scene_transition";
let inkRuntimeInitialized = false;

export function setStorySceneTransition(value: boolean) {
    (window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG] = value;
}

export function isStorySceneTransition() {
    return Boolean((window as Window & { [STORY_SCENE_TRANSITION_FLAG]?: boolean })[STORY_SCENE_TRANSITION_FLAG]);
}

export async function importAllInkLabels() {
    await importJson(compiledInkStory);
}

export async function convertInkToJson() {
    return [compiledInkStory];
}

export function initializeInk(options: { t: (key: string) => string }) {
    const { t } = options;
    if (!inkRuntimeInitialized) {
        HashtagCommands.add(async (script, props) => {
            const optimizedTransitionCommand = getOptimizedTransitionCommand(script);
            if (optimizedTransitionCommand) return optimizedTransitionCommand;

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

function getOptimizedTransitionCommand(script: string[]) {
    const duration = performanceProfile.canvasFadeDurationSeconds;
    if (!duration || script[0] !== "show" || script[1] !== "image") return undefined;

    const transitionIndex = script.indexOf("with");
    if (transitionIndex < 0 || script[transitionIndex + 1] !== "fade") return undefined;

    // Avoid re-processing the command after the Ink adapter receives the
    // rewritten string from this custom handler.
    const transitionProps = script.slice(transitionIndex + 2);
    if (transitionProps.includes("duration")) return undefined;

    return `${script.join(" ")} duration ${duration}`;
}
