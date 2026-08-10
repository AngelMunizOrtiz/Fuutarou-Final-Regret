import type { AssetsManifest } from "@drincs/pixi-vn";
import { MAIN_MENU_ROUTE, SPLASH_ROUTE } from "../constans";

export const STORY_ASSET_BUNDLES = {
    chapter1: "story-chapter-1",
    chapter2: "story-chapter-2",
    chapter3: "story-chapter-3",
    chapter4: "story-chapter-4",
    chapter5: "story-chapter-5",
    chapter6: "story-chapter-6",
    chapter7: "story-chapter-7",
    chapter8: "story-chapter-8",
    chapter9: "story-chapter-9",
    chapter10: "story-chapter-10",
    chapter11: "story-chapter-11",
} as const;

export type StoryAssetBundleName = (typeof STORY_ASSET_BUNDLES)[keyof typeof STORY_ASSET_BUNDLES];

const storyBundlesByChapter: Record<number, readonly StoryAssetBundleName[]> = {
    1: [STORY_ASSET_BUNDLES.chapter1],
    2: [STORY_ASSET_BUNDLES.chapter2],
    3: [STORY_ASSET_BUNDLES.chapter3],
    4: [STORY_ASSET_BUNDLES.chapter4],
    5: [STORY_ASSET_BUNDLES.chapter3, STORY_ASSET_BUNDLES.chapter4, STORY_ASSET_BUNDLES.chapter5],
    6: [STORY_ASSET_BUNDLES.chapter5, STORY_ASSET_BUNDLES.chapter6],
    7: [STORY_ASSET_BUNDLES.chapter5, STORY_ASSET_BUNDLES.chapter7],
    8: [STORY_ASSET_BUNDLES.chapter7, STORY_ASSET_BUNDLES.chapter8],
    9: [STORY_ASSET_BUNDLES.chapter7, STORY_ASSET_BUNDLES.chapter9],
    10: [STORY_ASSET_BUNDLES.chapter10],
    11: [STORY_ASSET_BUNDLES.chapter11],
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
                { alias: "ch01-cg-060-takeda-shower-flashback", src: "/images/cg/chapter_01/cg_060_takeda_shower_flashback.webp" },
                { alias: "ch01-cg-061-fuutarou-nostalgic-smile", src: "/images/cg/chapter_01/cg_061_fuutarou_nostalgic_smile.webp" },
                { alias: "ch01-cg-062-takeda-notices-smile", src: "/images/cg/chapter_01/cg_062_takeda_notices_smile.webp" },
                { alias: "ch01-cg-063-takeda-teases-fuutarou", src: "/images/cg/chapter_01/cg_063_takeda_teases_fuutarou.webp" },
                { alias: "ch01-arched-passage-afternoon", src: "/images/backgrounds/chapter_01/arched_passage_afternoon.webp" },
                { alias: "ch01-student-residence-approach", src: "/images/backgrounds/chapter_01/student_residence_approach_afternoon.webp" },
                { alias: "ch01-student-residence-corridor-reverse-l", src: "/images/backgrounds/chapter_01/student_residence_corridor_reverse_l_afternoon.webp" },
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
                { alias: "onsen-cg-002-bath-door-accident", src: "/images/cg/onsen_arc/cg_002_bath_door_accident.webp" },
                { alias: "onsen-cg-003-grandpa-thanks-fuutarou", src: "/images/cg/onsen_arc/cg_003_grandpa_thanks_fuutarou.webp" },
                { alias: "onsen-cg-004-fuutarou-destiny-bell", src: "/images/cg/onsen_arc/cg_004_fuutarou_destiny_bell.webp" },
                { alias: "onsen-cg-054-grandpa-asks-if-fuutarou-is-happy", src: "/images/cg/onsen_arc/cg_054_grandpa_asks_if_fuutarou_is_happy.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter4,
            assets: [
                { alias: "ch02-onsen-quintuplets-tatami-room", src: "/images/backgrounds/chapter_02/onsen_quintuplets_tatami_room_bg_008.webp" },
                { alias: "onsen-cg-005-kotatsu-love-conversation", src: "/images/cg/onsen_arc/cg_005_kotatsu_love_conversation.webp" },
                { alias: "onsen-cg-006-yotsuba-asks-sisters-help", src: "/images/cg/onsen_arc/cg_006_yotsuba_asks_sisters_help.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter5,
            assets: [
                { alias: "ch02-onsen-reception-staircase", src: "/images/backgrounds/chapter_02/onsen_reception_staircase_bg_003.webp" },
                { alias: "ch02-onsen-stairwell-landing", src: "/images/backgrounds/chapter_02/onsen_stairwell_landing_bg_005.webp" },
                { alias: "onsen-cg-007-four-rena-lineup", src: "/images/cg/onsen_arc/cg_007_four_rena_lineup.webp" },
                { alias: "onsen-cg-008-nino-covers-fuutarou-eyes", src: "/images/cg/onsen_arc/cg_008_nino_covers_fuutarou_eyes.webp" },
                { alias: "onsen-cg-009-ichika-head-pat", src: "/images/cg/onsen_arc/cg_009_ichika_head_pat.webp" },
                { alias: "onsen-cg-010-itsuki-grateful-smile", src: "/images/cg/onsen_arc/cg_010_itsuki_grateful_smile.webp" },
                { alias: "onsen-cg-011-yotsuba-final-rena-reveal", src: "/images/cg/onsen_arc/cg_011_yotsuba_final_rena_reveal.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter6,
            assets: [
                { alias: "onsen-cg-012-fuutarou-approaches-yotsuba", src: "/images/cg/onsen_arc/cg_012_fuutarou_approaches_yotsuba.webp" },
                { alias: "onsen-cg-013-yotsuba-breakup", src: "/images/cg/onsen_arc/cg_013_yotsuba_breakup.webp" },
                { alias: "onsen-cg-014-yotsuba-pushes-fuutarou", src: "/images/cg/onsen_arc/cg_014_yotsuba_pushes_fuutarou.webp" },
                { alias: "onsen-cg-015-fuutarou-yotsuba-farewell-hug", src: "/images/cg/onsen_arc/cg_015_fuutarou_yotsuba_farewell_hug.webp" },
                { alias: "onsen-cg-016-present-childhood-farewell", src: "/images/cg/onsen_arc/cg_016_present_childhood_farewell.webp" },
                { alias: "onsen-cg-017-sisters-hold-crying-yotsuba", src: "/images/cg/onsen_arc/cg_017_sisters_hold_crying_yotsuba.webp" },
                { alias: "onsen-cg-018-maruo-throws-umbrella", src: "/images/cg/onsen_arc/cg_018_maruo_throws_umbrella.webp" },
                { alias: "onsen-cg-053-yotsuba-hears-miku-name", src: "/images/cg/onsen_arc/cg_053_yotsuba_hears_miku_name.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter7,
            assets: [
                { alias: "ch02-onsen-upper-ryokan-motorcycle-forecourt", src: "/images/backgrounds/chapter_02/onsen_upper_ryokan_motorcycle_forecourt_bg_010.webp" },
                { alias: "ch07-asahiyama-high-school-corridor-afternoon", src: "/images/backgrounds/chapter_07/asahiyama_high_school_corridor_afternoon.webp" },
                { alias: "ch07-asahiyama-school-nurse-office-afternoon", src: "/images/backgrounds/chapter_07/asahiyama_school_nurse_office_afternoon.webp" },
                { alias: "ch07-aoi-isanari-bakery-exterior-struggling", src: "/images/backgrounds/chapter_07/aoi_isanari_bakery_exterior_struggling.webp" },
                { alias: "ch07-aoi-isanari-bakery-interior-struggling", src: "/images/backgrounds/chapter_07/aoi_isanari_bakery_interior_struggling.webp" },
                { alias: "ch07-aoi-hospital-room-night", src: "/images/backgrounds/chapter_07/aoi_hospital_room_night.webp" },
                { alias: "ch07-uesugi-main-room-night", src: "/images/backgrounds/chapter_07/uesugi_main_room_night.webp" },
                { alias: "onsen-cg-019-young-isanari-confession", src: "/images/cg/onsen_arc/cg_019_young_isanari_confession.webp" },
                { alias: "onsen-cg-020-aoi-isanari-life-montage", src: "/images/cg/onsen_arc/cg_020_aoi_isanari_life_montage.webp" },
                { alias: "onsen-cg-021-aoi-hospital-farewell", src: "/images/cg/onsen_arc/cg_021_aoi_hospital_farewell.webp" },
                { alias: "onsen-cg-022-isanari-breakdown-at-home", src: "/images/cg/onsen_arc/cg_022_isanari_breakdown_at_home.webp" },
                { alias: "onsen-cg-023-isanari-cries-before-maruo", src: "/images/cg/onsen_arc/cg_023_isanari_cries_before_maruo.webp" },
                { alias: "onsen-cg-024-raiha-motorcycle-farewell", src: "/images/cg/onsen_arc/cg_024_raiha_motorcycle_farewell.webp" },
                { alias: "onsen-cg-025-fuutarou-meets-ren", src: "/images/cg/onsen_arc/cg_025_fuutarou_meets_ren.webp" },
                { alias: "onsen-cg-026-maruo-ren-watch-descent", src: "/images/cg/onsen_arc/cg_026_maruo_ren_watch_descent.webp" },
                { alias: "ch07-cg-051-isanari-proposes-to-aoi", src: "/images/cg/chapter_07/cg_051_isanari_proposes_to_aoi.webp" },
                { alias: "ch07-cg-052-uesugi-family-bakery-memory", src: "/images/cg/chapter_07/cg_052_uesugi_family_bakery_memory.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter8,
            assets: [
                { alias: "ch08-mountain-descent-road", src: "/images/backgrounds/chapter_02/onsen_mountain_descent_road_bg_011.webp" },
                { alias: "ch08-yuzine-eien-street", src: "/images/backgrounds/chapter_02/yuzine_eien_street_bg_012.webp" },
                { alias: "ch08-yuzine-eien-street-rain", src: "/images/backgrounds/chapter_02/yuzine_eien_street_bg_012_rain.webp" },
                { alias: "onsen-cg-027-miku-rainy-bench-reunion", src: "/images/cg/onsen_arc/cg_027_miku_rainy_bench_reunion.webp" },
                { alias: "onsen-cg-028-fuutarou-miku-bell-confession-kiss", src: "/images/cg/onsen_arc/cg_028_fuutarou_miku_bell_confession_kiss.webp" },
                { alias: "onsen-cg-029-fuutarou-miku-umbrella-walk", src: "/images/cg/onsen_arc/cg_029_fuutarou_miku_umbrella_walk.webp" },
                { alias: "onsen-cg-041a-miku-initiates-rain-kiss", src: "/images/cg/onsen_arc/cg_041a_miku_initiates_rain_kiss.webp" },
                { alias: "onsen-cg-041b-fuutarou-returns-rain-kiss", src: "/images/cg/onsen_arc/cg_041b_fuutarou_returns_rain_kiss.webp" },
                { alias: "onsen-cg-042-miku-bell-kiss-flashback", src: "/images/cg/onsen_arc/cg_042_miku_bell_kiss_flashback.webp" },
                { alias: "onsen-cg-043-miku-removes-wig-crying", src: "/images/cg/onsen_arc/cg_043_miku_removes_wig_crying.webp" },
                { alias: "onsen-cg-044-fuutarou-reveals-miku-face", src: "/images/cg/onsen_arc/cg_044_fuutarou_reveals_miku_face.webp" },
                { alias: "onsen-cg-045-fuutarou-initiates-rain-kiss", src: "/images/cg/onsen_arc/cg_045_fuutarou_initiates_rain_kiss.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter9,
            assets: [
                { alias: "ch09-miku-pickup-street-late-morning", src: "/images/backgrounds/chapter_09/miku_pickup_street_late_morning.webp" },
                { alias: "ch09-date-restaurant-interior-late-morning", src: "/images/backgrounds/chapter_09/date_restaurant_interior_late_morning.webp" },
                { alias: "ch09-local-library-interior-afternoon", src: "/images/backgrounds/chapter_09/local_library_interior_afternoon.webp" },
                { alias: "ch09-asahiyama-rooftop-sunset", src: "/images/backgrounds/chapter_09/asahiyama_high_school_rooftop_sunset_bg_013.webp" },
                { alias: "ch09-asahiyama-rooftop-early-night", src: "/images/backgrounds/chapter_09/asahiyama_rooftop_early_night.webp" },
                { alias: "ch09-asahiyama-high-school-exterior", src: "/images/backgrounds/chapter_09/asahiyama_high_school_exterior_bg_014.webp" },
                { alias: "onsen-cg-030-fuutarou-miku-rooftop-dance", src: "/images/cg/onsen_arc/cg_030_fuutarou_miku_rooftop_dance.webp" },
                { alias: "onsen-cg-031-miku-accepts-rooftop-proposal", src: "/images/cg/onsen_arc/cg_031_miku_accepts_rooftop_proposal.webp" },
                { alias: "onsen-cg-046-miku-fuutarou-seven-month-reunion", src: "/images/cg/onsen_arc/cg_046_miku_fuutarou_seven_month_reunion.webp" },
                { alias: "onsen-cg-047-fuutarou-rooftop-proposal-question", src: "/images/cg/onsen_arc/cg_047_fuutarou_rooftop_proposal_question.webp" },
                { alias: "onsen-cg-048-miku-processes-rooftop-proposal", src: "/images/cg/onsen_arc/cg_048_miku_processes_rooftop_proposal.webp" },
                { alias: "onsen-cg-049-miku-fuutarou-rooftop-yes-kiss", src: "/images/cg/onsen_arc/cg_049_miku_fuutarou_rooftop_yes_kiss.webp" },
                { alias: "onsen-cg-050-miku-listens-to-fuutarou-heartbeat", src: "/images/cg/onsen_arc/cg_050_miku_listens_to_fuutarou_heartbeat.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter10,
            assets: [
                { alias: "ch10-sutekina-church-interior-altar", src: "/images/backgrounds/chapter_10/sutekina_church_interior_altar.webp" },
                { alias: "ch10-sutekina-reception-hall-evening", src: "/images/backgrounds/chapter_10/sutekina_reception_hall_evening.webp" },
                { alias: "ch10-sutekina-church-exterior-courtyard-dusk", src: "/images/backgrounds/chapter_10/sutekina_church_exterior_courtyard_dusk.webp" },
                { alias: "ch10-wedding-limousine-interior-eien-street-evening", src: "/images/backgrounds/chapter_10/wedding_limousine_interior_eien_street_evening.webp" },
                { alias: "wedding-cg-032-miku-fuutarou-wedding-kiss", src: "/images/cg/wedding_epilogue/cg_032_miku_fuutarou_wedding_kiss.webp" },
                { alias: "wedding-cg-033-miku-maruo-family-dance", src: "/images/cg/wedding_epilogue/cg_033_miku_maruo_family_dance.webp" },
                { alias: "wedding-cg-034-miku-kisses-frosting-from-fuutarou", src: "/images/cg/wedding_epilogue/cg_034_miku_kisses_frosting_from_fuutarou.webp" },
                { alias: "wedding-cg-035-miku-thanks-her-sisters", src: "/images/cg/wedding_epilogue/cg_035_miku_thanks_her_sisters.webp" },
                { alias: "wedding-cg-036-yotsuba-catches-wedding-bouquet", src: "/images/cg/wedding_epilogue/cg_036_yotsuba_catches_wedding_bouquet.webp" },
                { alias: "wedding-cg-037-sisters-receive-wedding-keepsakes", src: "/images/cg/wedding_epilogue/cg_037_sisters_receive_wedding_keepsakes.webp" },
                { alias: "wedding-cg-055-family-photo", src: "/images/cg/wedding_epilogue/cg_055_wedding_family_photo.webp" },
                { alias: "wedding-cg-056-farewell-to-ryokan", src: "/images/cg/wedding_epilogue/cg_056_miku_fuutarou_farewell_to_ryokan.webp" },
                { alias: "wedding-cg-057-limousine-kiss", src: "/images/cg/wedding_epilogue/cg_057_miku_fuutarou_limousine_kiss.webp" },
            ],
        },
        {
            name: STORY_ASSET_BUNDLES.chapter11,
            assets: [
                { alias: "ch11-uesugi-bakery-exterior-renovated", src: "/images/backgrounds/chapter_11/uesugi_bakery_exterior_renovated.webp" },
                { alias: "ch11-uesugi-bakery-interior-renovated", src: "/images/backgrounds/chapter_11/uesugi_bakery_interior_renovated.webp" },
                { alias: "wedding-cg-038-sisters-career-montage", src: "/images/cg/wedding_epilogue/cg_038_sisters_career_montage.webp" },
                { alias: "wedding-cg-039-family-visits-new-bakery", src: "/images/cg/wedding_epilogue/cg_039_family_visits_new_bakery.webp" },
                { alias: "wedding-cg-040-miku-memory-desk-finale", src: "/images/cg/wedding_epilogue/cg_040_miku_memory_desk_finale.webp" },
                { alias: "wedding-cg-058-miku-ring-new-family-reveal", src: "/images/cg/wedding_epilogue/cg_058_miku_ring_new_family_reveal.webp" },
                { alias: "wedding-cg-059-fuutarou-leads-miku-to-future", src: "/images/cg/wedding_epilogue/cg_059_fuutarou_leads_miku_to_future.webp" },
            ],
        },
    ],
};

export default manifest;
