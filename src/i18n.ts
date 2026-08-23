import { RegisteredCharacters } from "@drincs/pixi-vn";
import { generateJsonInkTranslation } from "@drincs/pixi-vn-ink";
import i18n from "i18next";
import Backend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { convertInkToJson } from "./utils/ink-utility";
import { isChapterOneDemoBuild } from "./utils/performance-profile";

type LocaleResource = Record<string, unknown> & {
    default?: unknown;
    narration?: Record<string, unknown>;
};

const spanishNarrationModules = import.meta.glob<Record<string, string>>("./locales/narration_es/*.json", {
    import: "default",
});
let spanishNarrationResourcePromise: Promise<Record<string, string>> | undefined;

function getSpanishNarrationResource() {
    if (!spanishNarrationResourcePromise) {
        spanishNarrationResourcePromise = Promise.all(
            Object.entries(spanishNarrationModules)
            .filter(([path]) => !isChapterOneDemoBuild || path.endsWith("/chapter_01.json"))
            .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, "en"))
            .map(([, loadResource]) => loadResource()),
        ).then((resources) => Object.fromEntries(resources.flatMap((resource) => Object.entries(resource))));
    }
    return spanishNarrationResourcePromise;
}

export const GAME_LANGUAGE_STORAGE_KEY = "ffr_game_language";

export const SUPPORTED_GAME_LANGUAGES = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
] as const;

export type GameLanguage = (typeof SUPPORTED_GAME_LANGUAGES)[number]["code"];

export function isGameLanguage(value: string | null | undefined): value is GameLanguage {
    return SUPPORTED_GAME_LANGUAGES.some((language) => language.code === value);
}

export function getInitialGameLanguage(): GameLanguage {
    try {
        const storedLanguage = window.localStorage.getItem(GAME_LANGUAGE_STORAGE_KEY);
        if (isGameLanguage(storedLanguage)) return storedLanguage;
    } catch {
        // Storage can be unavailable in privacy-restricted browsers.
    }

    const browserLanguage = navigator.language?.toLocaleLowerCase().split("-")[0];
    return isGameLanguage(browserLanguage) ? browserLanguage : "en";
}

function applyDocumentLanguage(language: GameLanguage) {
    document.documentElement.lang = language;
}

export async function changeGameLanguage(language: GameLanguage) {
    try {
        window.localStorage.setItem(GAME_LANGUAGE_STORAGE_KEY, language);
    } catch {
        // The active session can still change language without persistence.
    }

    applyDocumentLanguage(language);
    await i18n.changeLanguage(language);
}

function getLocalesResource(lng: string): Promise<LocaleResource> {
    return import(`./locales/strings_${lng}.json`) as Promise<LocaleResource>;
}

async function generateResourceToTranslate(lng: string): Promise<LocaleResource> {
    const res: LocaleResource = { ...(await getLocalesResource(lng)) };
    res.narration = lng === "es" ? await getSpanishNarrationResource() : (res.narration ?? {});
    if (res.default) {
        delete res.default;
    }
    for (const element of await convertInkToJson()) {
        if (element) {
            await generateJsonInkTranslation(element, res.narration);
        }
    }
    return res;
}

export async function downloadResourceToTranslate() {
    const lng = isGameLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : getInitialGameLanguage();
    const data = await generateResourceToTranslate(lng);
    const jsonString = JSON.stringify(data, null, "\t");
    // download the save data as a JSON file
    const blob = new Blob([jsonString], { type: "application/json" });
    // download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strings_${lng}.json`;
    a.click();
}

export async function initializeI18n() {
    if (!i18n.isInitialized) {
        const language = getInitialGameLanguage();
        await i18n
            .use(Backend)
            .use(initReactI18next)
            .init({
                debug: false,
                fallbackLng: "en",
                lng: language,
                supportedLngs: SUPPORTED_GAME_LANGUAGES.map(({ code }) => code),
                interpolation: {
                    escapeValue: false,
                },
                // Ink dialogue keys use the `character: dialogue` format.
                // Treat the colon as content instead of an i18next namespace separator.
                nsSeparator: false,
                load: "languageOnly",
                backend: {
                    backends: [
                        resourcesToBackend(async (lng: string, ns: string) => {
                            if (lng === "es" && ns === "narration") {
                                return getSpanishNarrationResource();
                            }
                            const object = await getLocalesResource(lng);
                            return object[ns];
                        }),
                    ],
                },
                missingInterpolationHandler(_text, value) {
                    const key = value[1];
                    const character = RegisteredCharacters.get(key);
                    if (character) {
                        return character.name;
                    }
                    return `[${key}]`;
                },
            });
        applyDocumentLanguage(language);
    }
}
