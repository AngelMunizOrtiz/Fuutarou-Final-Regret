import type { AssetsManifest } from "@drincs/pixi-vn";
import { MAIN_MENU_ROUTE, SPLASH_ROUTE } from "../constans";

export const STORY_ASSET_BUNDLES = {
    chapter1: "story-chapter-1",
    chapter2: "story-chapter-2",
    chapter3: "story-chapter-3",
    chapter4: "story-chapter-4",
    chapter5: "story-chapter-5",
    chapter7: "story-chapter-7",
    chapter8: "story-chapter-8",
    chapter9: "story-chapter-9",
    chapter10: "story-chapter-10",
} as const;

export type StoryAssetBundleName = (typeof STORY_ASSET_BUNDLES)[keyof typeof STORY_ASSET_BUNDLES];

const storyBundlesByChapter: Record<number, readonly StoryAssetBundleName[]> = {
    1: [STORY_ASSET_BUNDLES.chapter1],
    2: [STORY_ASSET_BUNDLES.chapter2],
    3: [STORY_ASSET_BUNDLES.chapter3],
    4: [STORY_ASSET_BUNDLES.chapter4],
    5: [STORY_ASSET_BUNDLES.chapter3, STORY_ASSET_BUNDLES.chapter4, STORY_ASSET_BUNDLES.chapter5],
    6: [STORY_ASSET_BUNDLES.chapter5],
    7: [STORY_ASSET_BUNDLES.chapter5, STORY_ASSET_BUNDLES.chapter7],
    8: [STORY_ASSET_BUNDLES.chapter7, STORY_ASSET_BUNDLES.chapter8],
    9: [STORY_ASSET_BUNDLES.chapter7, STORY_ASSET_BUNDLES.chapter9],
    10: [STORY_ASSET_BUNDLES.chapter10],
    11: [STORY_ASSET_BUNDLES.chapter7],
};

function getChapterNumber(labelId: string) {
    if (labelId === "start") {
        return 1;
    }

    const match = /^chapter_(\d+)/.exec(labelId);
    return match ? Number(match[1]) : undefined;
}

export function getStoryAssetBundles(labelId: string) {
    const chapterNumber = getChapterNumber(labelId);
    return chapterNumber ? storyBundlesByChapter[chapterNumber] ?? [] : [];
}

export function getNextStoryAssetBundles(labelId: string) {
    if (labelId === "start") {
        return [];
    }

    const chapterNumber = getChapterNumber(labelId);
    return chapterNumber ? storyBundlesByChapter[chapterNumber + 1] ?? [] : [];
}

const manifest: AssetsManifest = {
    bundles: [
        {
            name: SPLASH_ROUTE,
            assets: [
                { alias: "bg_title", src: "/images/bg_title.webp" },
                { alias: "logo_game", src: "/images/logo_game.webp" },
                { alias: "press_button", src: "/images/pressanybutton.webp" },
            ],
        },
        {
            name: MAIN_MENU_ROUTE,
            assets: [
                { alias: "background_main_menu", src: "/images/bg_title.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter1,
            assets: [
                { alias: "ch01-university-tokyo-establishing", src: "/images/backgrounds/chapter_01/university_tokyo_establishing.webp" },
                { alias: "ch01-university-walkway-afternoon", src: "/images/backgrounds/chapter_01/university_walkway_afternoon.webp" },
                { alias: "ch01-fuutarou-notes-closeup", src: "/images/backgrounds/chapter_01/fuutarou_notes_closeup.webp" },
                { alias: "ch01-takeda-collapse-cg", src: "/images/backgrounds/chapter_01/takeda_collapse_cg.webp" },
                { alias: "ch01-arched-passage-afternoon", src: "/images/backgrounds/chapter_01/arched_passage_afternoon.webp" },
                { alias: "ch01-student-residence-approach", src: "/images/backgrounds/chapter_01/student_residence_approach_afternoon.webp" },
                { alias: "ch01-student-residence-restroom", src: "/images/backgrounds/chapter_01/student_residence_restroom_extra.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter2,
            assets: [
                { alias: "ch02-uesugi-home-exterior-morning-motorcycle", src: "/images/backgrounds/chapter_02/uesugi_home_exterior_morning_motorcycle_v2.webp" },
                { alias: "ch02-uesugi-entryway-inside-morning", src: "/images/backgrounds/chapter_02/uesugi_entryway_inside_hallway_v3.webp" },
                { alias: "ch02-uesugi-main-room-note-table", src: "/images/backgrounds/chapter_02/uesugi_main_room_note_table_v3.webp" },
                { alias: "ch02-raiha-note-closeup", src: "/images/backgrounds/chapter_02/uesugi_raiha_note_radio_table_cg_v4.webp" },
                { alias: "ch02-uesugi-radio-weather", src: "/images/backgrounds/chapter_02/uesugi_radio_weather_table_cg_v4.webp" },
                { alias: "ch02-warlords-gifts-drawer", src: "/images/backgrounds/chapter_02/fuutarou_historical_warlords_gifts_closeup.webp" },
                { alias: "ch02-onsen-arrival-parking", src: "/images/backgrounds/chapter_02/onsen_arrival_parking_bg_001.webp" },
                { alias: "ch02-onsen-ryokan-forest-entrance", src: "/images/backgrounds/chapter_02/onsen_ryokan_forest_entrance_bg_002.webp" },
                { alias: "onsen-cg-001-raiha-reunion", src: "/images/cg/onsen_arc/cg_001_raiha_reunion.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter3,
            assets: [
                { alias: "ch02-onsen-ryokan-forest-entrance-rain", src: "/images/backgrounds/chapter_02/onsen_ryokan_forest_entrance_bg_002_rain.webp" },
                { alias: "ch02-onsen-courtyard-window-corridor", src: "/images/backgrounds/chapter_02/onsen_courtyard_window_corridor_bg_004.webp" },
                { alias: "ch02-onsen-womens-bath-vestibule", src: "/images/backgrounds/chapter_02/onsen_womens_bath_vestibule_bg_006.webp" },
                { alias: "ch02-onsen-destiny-bell-overlook", src: "/images/backgrounds/chapter_02/onsen_destiny_bell_overlook_bg_007.webp" },
                { alias: "ch02-onsen-uesugi-family-tatami-room", src: "/images/backgrounds/chapter_02/onsen_uesugi_family_tatami_room_bg_009.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter4,
            assets: [
                { alias: "ch02-onsen-quintuplets-tatami-room", src: "/images/backgrounds/chapter_02/onsen_quintuplets_tatami_room_bg_008.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter5,
            assets: [
                { alias: "ch02-onsen-reception-staircase", src: "/images/backgrounds/chapter_02/onsen_reception_staircase_bg_003.webp" },
                { alias: "ch02-onsen-stairwell-landing", src: "/images/backgrounds/chapter_02/onsen_stairwell_landing_bg_005.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter7,
            assets: [
                { alias: "ch02-onsen-upper-ryokan-motorcycle-forecourt", src: "/images/backgrounds/chapter_02/onsen_upper_ryokan_motorcycle_forecourt_bg_010.webp" },
                { alias: "bg01-hallway", src: "https://raw.githubusercontent.com/DRincs-Productions/pixi-vn-bucket/refs/heads/main/breakdown/bg01-hallway.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter8,
            assets: [
                { alias: "ch08-mountain-descent-road", src: "/images/backgrounds/chapter_02/onsen_mountain_descent_road_bg_011.webp" },
                { alias: "ch08-yuzine-eien-street", src: "/images/backgrounds/chapter_02/yuzine_eien_street_bg_012.webp" },
                { alias: "ch08-yuzine-eien-street-rain", src: "/images/backgrounds/chapter_02/yuzine_eien_street_bg_012_rain.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter9,
            assets: [
                { alias: "ch09-asahiyama-rooftop-sunset", src: "/images/backgrounds/chapter_09/asahiyama_high_school_rooftop_sunset_bg_013.webp" },
                { alias: "ch09-asahiyama-high-school-exterior", src: "/images/backgrounds/chapter_09/asahiyama_high_school_exterior_bg_014.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter10,
            assets: [
                { alias: "bg02-dorm", src: "https://raw.githubusercontent.com/DRincs-Productions/pixi-vn-bucket/refs/heads/main/breakdown/bg02-dorm.webp" },
            ],
        },
    ],
};

export default manifest;
