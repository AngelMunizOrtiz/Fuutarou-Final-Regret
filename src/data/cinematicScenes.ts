import type { TFunction } from "i18next";
import { DreamFragment, fuutarouDream } from "./dreamSequence";

export type CinematicReturnMode = "call" | "jump";

export interface CinematicSceneDefinition {
    id: string;
    title: string;
    frames: DreamFragment[];
    nextSceneId?: string;
    defaultReturnLabel?: string;
    defaultReturnMode?: CinematicReturnMode;
    resetBeforeReturn?: boolean;
}

const productIntroScene: CinematicSceneDefinition = {
    id: "product_intro",
    title: "Project Introduction",
    nextSceneId: "opening_dream",
    frames: [
        {
            id: 1,
            layout: "intro",
            image: "/images/bg_title.webp",
            title: "Fuutarou's Final Regret",
            subtitle: "Adaptacion visual novel fan",
            text: null,
            details: [
                "Historia original por XenoTime39.",
                "Una experiencia creada con fines de entretencion, inspirada en una ruta alternativa despues del capitulo 120.",
                "Ha pasado un ano desde la graduacion. Fuutarou vuelve a las aguas termales, pero algo en sus sentimientos empieza a sentirse fuera de lugar.",
            ],
        },
        {
            id: 2,
            layout: "intro",
            image: "/images/bg_title.webp",
            title: "Contexto",
            subtitle: "Romance, dudas y una decision pendiente",
            text: null,
            details: [
                "Esta version explora que ocurre cuando Fuutarou comienza a cuestionar si sus sentimientos hacia Yotsuba son realmente verdaderos.",
                "A partir de aqui, la historia entra en sus recuerdos y arrepentimientos.",
            ],
        },
    ],
    defaultReturnLabel: "start",
    defaultReturnMode: "call",
};

const openingDreamScene: CinematicSceneDefinition = {
    id: "opening_dream",
    title: "Opening Dream",
    frames: fuutarouDream,
    defaultReturnLabel: "start",
    defaultReturnMode: "call",
};

const chapterOneContextScene: CinematicSceneDefinition = {
    id: "chapter_1_context",
    title: "Chapter 1 Context",
    frames: [
        {
            id: 1,
            layout: "info",
            image: "/images/backgrounds/chapter_01/university_tokyo_establishing.webp",
            title: "1 Year After Graduation",
            subtitle: "Afternoon",
            text: null,
            details: [
                "Tokyo University",
                "Fuutarou returns from afternoon classes while reviewing his notes.",
            ],
        },
    ],
    defaultReturnLabel: "chapter_1_after_context",
    defaultReturnMode: "jump",
};

const chapterOneNotesScene: CinematicSceneDefinition = {
    id: "chapter_1_notes",
    title: "Fuutarou's Notes",
    frames: [
        {
            id: 1,
            layout: "note",
            image: "/images/backgrounds/chapter_01/fuutarou_notes_closeup.webp",
            title: "Problem 7",
            subtitle: "If every choice was correct, why does regret still remain?",
            text: null,
            details: [
                "Fuutarou checks his notes while walking back from afternoon classes.",
            ],
        },
    ],
    defaultReturnLabel: "chapter_1_after_notes",
    defaultReturnMode: "jump",
};

export const cinematicScenes: Record<string, CinematicSceneDefinition> = {
    // Add future interludes here and call them from Ink with:
    // # scene scene_id return_label jump
    product_intro: productIntroScene,
    "product:intro": productIntroScene,
    opening_dream: openingDreamScene,
    "opening:dream": openingDreamScene,
    chapter_1_context: chapterOneContextScene,
    "chapter:1:context": chapterOneContextScene,
    chapter_1_notes: chapterOneNotesScene,
    "chapter:1:notes": chapterOneNotesScene,
};

export function getCinematicScene(sceneId: string) {
    return cinematicScenes[sceneId];
}

export function getLocalizedCinematicScene(sceneId: string, t: TFunction<"cinematic">) {
    const scene = getCinematicScene(sceneId);
    if (!scene) return undefined;

    return {
        ...scene,
        title: t(`${scene.id}.title`, { defaultValue: scene.title }),
        frames: scene.frames.map((frame) => {
            const frameKey = `${scene.id}.frames.${frame.id}`;
            return {
                ...frame,
                title: frame.title ? t(`${frameKey}.title`, { defaultValue: frame.title }) : undefined,
                subtitle: frame.subtitle ? t(`${frameKey}.subtitle`, { defaultValue: frame.subtitle }) : undefined,
                text: frame.text ? t(`${frameKey}.text`, { defaultValue: frame.text }) : frame.text,
                speaker: frame.speaker ? t(`${frameKey}.speaker`, { defaultValue: frame.speaker }) : undefined,
                details: frame.details?.map((detail, index) =>
                    t(`${frameKey}.details.${index}`, { defaultValue: detail }),
                ),
            };
        }),
    };
}
