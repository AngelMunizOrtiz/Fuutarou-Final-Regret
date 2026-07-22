import { create } from "zustand";
import { getCharacterSprite, type CharacterSpriteDefinition } from "../data/characterSprites";

export const characterStageSlots = ["left", "center", "right"] as const;

export type CharacterStageSlotName = (typeof characterStageSlots)[number];

export type CharacterStageEntry = {
    characterId: string;
    expression: string;
    sprite: CharacterSpriteDefinition;
    mirror?: boolean;
};

type CharacterStageState = {
    slots: Partial<Record<CharacterStageSlotName, CharacterStageEntry>>;
    showCharacter: (
        slot: CharacterStageSlotName,
        characterId: string,
        expression?: string,
        options?: { mirror?: boolean },
    ) => void;
    hideSlot: (slot: CharacterStageSlotName) => void;
    clear: () => void;
};

export function isCharacterStageSlotName(value: string): value is CharacterStageSlotName {
    return characterStageSlots.includes(value as CharacterStageSlotName);
}

const useCharacterStageStore = create<CharacterStageState>((set) => ({
    slots: {},
    showCharacter: (slot, characterId, expression = "neutral", options) => {
        const normalizedCharacterId = characterId.toLowerCase();
        const sprite = getCharacterSprite(normalizedCharacterId, expression);

        if (!sprite) {
            console.warn(`Character sprite not found: ${characterId}.${expression}`);
            return;
        }

        set((state) => {
            const nextSlots = { ...state.slots };

            for (const existingSlot of characterStageSlots) {
                if (existingSlot !== slot && nextSlots[existingSlot]?.characterId === normalizedCharacterId) {
                    delete nextSlots[existingSlot];
                }
            }

            nextSlots[slot] = {
                characterId: normalizedCharacterId,
                expression,
                sprite,
                mirror: options?.mirror,
            };

            return { slots: nextSlots };
        });
    },
    hideSlot: (slot) => {
        set((state) => {
            const nextSlots = { ...state.slots };
            delete nextSlots[slot];
            return { slots: nextSlots };
        });
    },
    clear: () => set({ slots: {} }),
}));

export default useCharacterStageStore;
