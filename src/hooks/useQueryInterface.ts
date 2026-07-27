import { CharacterInterface, narration, stepHistory } from "@drincs/pixi-vn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export const INTERFACE_DATA_USE_QUEY_KEY = "interface_data_use_quey_key";

function translateDialogueText(
    t: TFunction<"narration">,
    text: string,
    character?: CharacterInterface | string,
) {
    const characterId = typeof character === "string" ? character : character?.id;
    if (!characterId) return t(text);

    const prefix = `${characterId}:`;
    const translated = t(`${prefix} ${text}`, { defaultValue: text });
    return translated.startsWith(prefix) ? translated.slice(prefix.length).trimStart() : translated;
}

const CAN_GO_BACK_USE_QUEY_KEY = "can_go_back_use_quey_key";
export function useQueryCanGoBack() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_BACK_USE_QUEY_KEY],
        queryFn: async () => stepHistory.canGoBack,
    });
}

const CHOICE_MENU_OPTIONS_USE_QUEY_KEY = "choice_menu_options_use_quey_key";
export function useQueryChoiceMenuOptions() {
    const { t, i18n } = useTranslation(["narration"]);
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CHOICE_MENU_OPTIONS_USE_QUEY_KEY, i18n.resolvedLanguage],
        queryFn: async () =>
            narration.choices?.map((option) => ({
                ...option,
                text: typeof option.text === "string" ? t(option.text) : option.text.map((text) => t(text)).join(" "),
            })) || [],
    });
}

const INPUT_VALUE_USE_QUEY_KEY = "input_value_use_quey_key";
export function useQueryInputValue<T>() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, INPUT_VALUE_USE_QUEY_KEY],
        queryFn: async () => ({
            isRequired: narration.isRequiredInput,
            type: narration.inputType,
            currentValue: narration.inputValue as T | undefined,
        }),
    });
}

type DialogueModel = {
    animatedText?: string;
    text?: string;
    character?: CharacterInterface;
};
const DIALOGUE_USE_QUEY_KEY = "dialogue_use_quey_key";
export function useQueryDialogue() {
    const { t, i18n } = useTranslation(["narration"]);
    const queryClient = useQueryClient();

    return useQuery<DialogueModel>({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, DIALOGUE_USE_QUEY_KEY, i18n.resolvedLanguage],
        queryFn: async ({ queryKey }) => {
            let dialogue = narration.dialogue;
            let text = dialogue?.text;
            if (Array.isArray(text)) {
                text = text.map((part) => translateDialogueText(t, part, dialogue?.character)).join(" ");
            } else if (typeof text === "string") {
                text = translateDialogueText(t, text, dialogue?.character);
            }
            let character = dialogue?.character;
            if (typeof character === "string") {
                character = {
                    id: character,
                    name: t(character),
                } as CharacterInterface;
            }

            let prevData = queryClient.getQueryData<DialogueModel>(queryKey) || {};
            let oldText = (prevData.text || "") + (prevData.animatedText || "");
            if (text && character?.id === prevData?.character?.id && text.startsWith(oldText)) {
                let newText = text.slice(oldText.length);
                if (!newText && oldText && character === prevData?.character) {
                    return prevData;
                }
                return {
                    animatedText: newText,
                    text: oldText,
                    character: character,
                };
            }

            return {
                animatedText: text,
                character: character,
            };
        },
    });
}

const CAN_GO_NEXT_USE_QUEY_KEY = "can_go_next_use_quey_key";
export function useQueryCanGoNext() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_NEXT_USE_QUEY_KEY],
        queryFn: async () => narration.canContinue && !narration.isRequiredInput,
    });
}

const NARRATIVE_HISTORY_USE_QUEY_KEY = "narrative_history_use_quey_key";
export function useQueryNarrativeHistory({ searchString }: { searchString?: string }) {
    const { t, i18n } = useTranslation(["narration"]);

    return useQuery({
        queryKey: [
            INTERFACE_DATA_USE_QUEY_KEY,
            NARRATIVE_HISTORY_USE_QUEY_KEY,
            searchString,
            i18n.resolvedLanguage,
        ],
        queryFn: async () => {
            const promises = stepHistory.narrativeHistory.map(async (step) => {
                let character = step.dialogue?.character;
                let icon: string | undefined;
                let characterName: string | undefined;
                if (typeof character === "string") {
                    characterName = t(character);
                } else {
                    characterName = character?.name
                        ? character.name + (character.surname ? " " + character.surname : "")
                        : undefined;
                    icon = character?.icon;
                }
                let text = step.dialogue?.text;
                if (Array.isArray(text)) {
                    text = text.map((part) => translateDialogueText(t, part, step.dialogue?.character)).join(" ");
                } else if (typeof text === "string") {
                    text = translateDialogueText(t, text, step.dialogue?.character);
                }
                return {
                    character: characterName,
                    text: text || "",
                    icon: icon,
                    choices: step.choices,
                    inputValue: step.inputValue,
                };
            });
            const data = await Promise.all(promises);
            return data.filter((data) => {
                if (!searchString) return true;
                return (
                    data.character?.toLowerCase().includes(searchString.toLowerCase()) ||
                    data.text?.toLowerCase().includes(searchString.toLowerCase())
                );
            });
        },
    });
}
