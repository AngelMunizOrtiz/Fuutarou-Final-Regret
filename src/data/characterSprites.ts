import type { StorySpritePrefetchEntry } from "../assets/generatedStoryPrefetchPlan";
import { performanceProfile } from "../utils/performance-profile";

export type CharacterSpriteDefinition = {
    src: string;
    scale?: number;
    yOffset?: number;
};

const spritePreloadCache = new Map<string, Promise<HTMLImageElement | void>>();
let activeSpriteSequence: readonly StorySpritePrefetchEntry[] = [];
let spriteSequenceCursor = 0;
let spritePrefetchHandle: number | undefined;

export const characterSprites = {
    fuutarou: {
        chapter_01_neutral: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_neutral.webp",
            scale: 1.04,
        },
        chapter_01_annoyed: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_annoyed.webp",
            scale: 1.04,
        },
        chapter_01_surprised: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_surprised.webp",
            scale: 1.04,
        },
        chapter_01_hand_cover: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_hand_cover.webp",
            scale: 1.04,
        },
        chapter_01_neck_scratch: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_neck_scratch.webp",
            scale: 1.04,
        },
        chapter_01_worried: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_worried.webp",
            scale: 1.04,
        },
        chapter_01_determined: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_determined.webp",
            scale: 1.04,
        },
        chapter_01_soft_smile: {
            src: "/images/characters/fuutarou/chapter_01/fuutarou_soft_smile.webp",
            scale: 1.04,
        },
        chapter_08_neutral: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_neutral.webp",
            scale: 1.04,
        },
        chapter_08_annoyed: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_annoyed.webp",
            scale: 1.04,
        },
        chapter_08_surprised: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_surprised.webp",
            scale: 1.04,
        },
        chapter_08_hand_cover: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_hand_cover.webp",
            scale: 1.04,
        },
        chapter_08_neck_scratch: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_neck_scratch.webp",
            scale: 1.04,
        },
        chapter_08_worried: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_worried.webp",
            scale: 1.04,
        },
        chapter_08_determined: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_determined.webp",
            scale: 1.04,
        },
        chapter_08_soft_smile: {
            src: "/images/characters/fuutarou/chapter_08/fuutarou_soft_smile.webp",
            scale: 1.04,
        },
        chapter_09_teacher_neutral: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_teacher_neutral.webp",
            scale: 1.04,
        },
        chapter_09_annoyed: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_annoyed.webp",
            scale: 1.04,
        },
        chapter_09_embarrassed: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_embarrassed.webp",
            scale: 1.04,
        },
        chapter_09_hand_cover: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_hand_cover.webp",
            scale: 1.04,
        },
        chapter_09_neck_scratch: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_neck_scratch.webp",
            scale: 1.04,
        },
        chapter_09_soft_smile: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_soft_smile.webp",
            scale: 1.04,
        },
        chapter_09_surprised: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_surprised.webp",
            scale: 1.04,
        },
        chapter_09_worried: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_worried.webp",
            scale: 1.04,
        },
        chapter_09_determined: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_determined.webp",
            scale: 1.04,
        },
        chapter_09_teary_relief: {
            src: "/images/characters/fuutarou/chapter_09/fuutarou_teary_relief.webp",
            scale: 1.04,
        },
        chapter_10_soft_smile: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_soft_smile.webp",
            scale: 1.04,
        },
        chapter_10_formal_gratitude: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_formal_gratitude.webp",
            scale: 1.04,
        },
        chapter_10_surprised: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_surprised.webp",
            scale: 1.04,
        },
        chapter_10_embarrassed: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_embarrassed.webp",
            scale: 1.04,
        },
        chapter_10_flustered: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_flustered.webp",
            scale: 1.04,
        },
        chapter_10_tender_relief: {
            src: "/images/characters/fuutarou/chapter_10/fuutarou_tender_relief.webp",
            scale: 1.04,
        },
        chapter_11_soft_welcome: {
            src: "/images/characters/fuutarou/chapter_11/fuutarou_soft_welcome.webp",
            scale: 1.04,
        },
        chapter_11_awkward_explain: {
            src: "/images/characters/fuutarou/chapter_11/fuutarou_awkward_explain.webp",
            scale: 1.04,
        },
        chapter_11_earnest_pitch: {
            src: "/images/characters/fuutarou/chapter_11/fuutarou_earnest_pitch.webp",
            scale: 1.04,
        },
        chapter_11_startled_protest: {
            src: "/images/characters/fuutarou/chapter_11/fuutarou_startled_protest.webp",
            scale: 1.04,
        },
        neutral: {
            src: "/images/characters/fuutarou/fuutarou_neutral.webp",
            scale: 1.04,
        },
        annoyed: {
            src: "/images/characters/fuutarou/fuutarou_annoyed.webp",
            scale: 1.04,
        },
        surprised: {
            src: "/images/characters/fuutarou/fuutarou_surprised.webp",
            scale: 1.04,
        },
        hand_cover: {
            src: "/images/characters/fuutarou/fuutarou_hand_cover.webp",
            scale: 1.04,
        },
        neck_scratch: {
            src: "/images/characters/fuutarou/fuutarou_neck_scratch.webp",
            scale: 1.04,
        },
        soft_smile: {
            src: "/images/characters/fuutarou/fuutarou_soft_smile.webp",
            scale: 1.04,
        },
        worried: {
            src: "/images/characters/fuutarou/fuutarou_worried.webp",
            scale: 1.04,
        },
        sad: {
            src: "/images/characters/fuutarou/fuutarou_sad.webp",
            scale: 1.04,
        },
        embarrassed: {
            src: "/images/characters/fuutarou/fuutarou_embarrassed.webp",
            scale: 1.04,
        },
    },
    fuutarou_child: {
        neutral: {
            src: "/images/characters/fuutarou_child/fuutarou_child_neutral.webp",
            scale: 0.74,
        },
        cheerful: {
            src: "/images/characters/fuutarou_child/fuutarou_child_cheerful.webp",
            scale: 0.74,
        },
        worried: {
            src: "/images/characters/fuutarou_child/fuutarou_child_worried.webp",
            scale: 0.74,
        },
    },
    takeda: {
        smile: {
            src: "/images/characters/takeda/takeda_smile.webp",
            scale: 1,
        },
        sparkle: {
            src: "/images/characters/takeda/takeda_sparkle.webp",
            scale: 1.02,
        },
        exhausted: {
            src: "/images/characters/takeda/takeda_exhausted.webp",
            scale: 1,
        },
        arms_crossed: {
            src: "/images/characters/takeda/takeda_arms_crossed.webp",
            scale: 1,
        },
        enthusiastic: {
            src: "/images/characters/takeda/takeda_enthusiastic.webp",
            scale: 1,
        },
        surprised: {
            src: "/images/characters/takeda/takeda_surprised.webp",
            scale: 1,
        },
        sheepish: {
            src: "/images/characters/takeda/takeda_sheepish.webp",
            scale: 1,
        },
        supportive: {
            src: "/images/characters/takeda/takeda_supportive.webp",
            scale: 1,
        },
        chapter_10_solemn: {
            src: "/images/characters/takeda/chapter_10/takeda_solemn.webp",
            scale: 1,
        },
        chapter_10_enthusiastic: {
            src: "/images/characters/takeda/chapter_10/takeda_enthusiastic.webp",
            scale: 1,
        },
    },
    tsubaki: {
        chapter_10_amused: {
            src: "/images/characters/tsubaki/chapter_10/tsubaki_amused.webp",
            scale: 1,
        },
        chapter_10_supportive: {
            src: "/images/characters/tsubaki/chapter_10/tsubaki_supportive.webp",
            scale: 1,
        },
    },
    matsui: {
        chapter_10_playful: {
            src: "/images/characters/matsui/chapter_10/matsui_playful.webp",
            scale: 1,
        },
    },
    raiha: {
        chapter_10_bright_laugh: {
            src: "/images/characters/raiha/chapter_10/raiha_bright_laugh.webp",
            scale: 0.92,
        },
        chapter_10_surprised_shy: {
            src: "/images/characters/raiha/chapter_10/raiha_surprised_shy.webp",
            scale: 0.92,
        },
        chapter_10_exasperated: {
            src: "/images/characters/raiha/chapter_10/raiha_exasperated.webp",
            scale: 0.92,
        },
        chapter_10_cheerful_wave: {
            src: "/images/characters/raiha/chapter_10/raiha_cheerful_wave.webp",
            scale: 0.92,
        },
        chapter_09_neutral: {
            src: "/images/characters/raiha/chapter_09/raiha_neutral.webp",
            scale: 0.92,
        },
        chapter_09_cheerful_wave: {
            src: "/images/characters/raiha/chapter_09/raiha_cheerful_wave.webp",
            scale: 0.92,
        },
        chapter_09_surprised_shy: {
            src: "/images/characters/raiha/chapter_09/raiha_surprised_shy.webp",
            scale: 0.92,
        },
        neutral: {
            src: "/images/characters/raiha/raiha_neutral.webp",
            scale: 0.92,
        },
        cheerful_wave: {
            src: "/images/characters/raiha/raiha_cheerful_wave.webp",
            scale: 0.92,
        },
        concerned_scold: {
            src: "/images/characters/raiha/raiha_concerned_scold.webp",
            scale: 0.92,
        },
        surprised_shy: {
            src: "/images/characters/raiha/raiha_surprised_shy.webp",
            scale: 0.92,
        },
        bright_laugh: {
            src: "/images/characters/raiha/raiha_bright_laugh.webp",
            scale: 0.92,
        },
        gentle_worry: {
            src: "/images/characters/raiha/raiha_gentle_worry.webp",
            scale: 0.92,
        },
        exasperated: {
            src: "/images/characters/raiha/raiha_exasperated.webp",
            scale: 0.92,
        },
        determined: {
            src: "/images/characters/raiha/raiha_determined.webp",
            scale: 0.92,
        },
    },
    isanari: {
        chapter_10_protective_alarm: {
            src: "/images/characters/isanari/chapter_10/isanari_protective_alarm.webp",
            scale: 1,
        },
        chapter_10_boisterous_laugh: {
            src: "/images/characters/isanari/chapter_10/isanari_boisterous_laugh.webp",
            scale: 1,
        },
        chapter_10_proud_emotional: {
            src: "/images/characters/isanari/chapter_10/isanari_proud_emotional.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/isanari/isanari_neutral.webp",
            scale: 1,
        },
        cheerful: {
            src: "/images/characters/isanari/isanari_cheerful.webp",
            scale: 1,
        },
        awkward: {
            src: "/images/characters/isanari/isanari_awkward.webp",
            scale: 1,
        },
        thoughtful: {
            src: "/images/characters/isanari/isanari_thoughtful.webp",
            scale: 1,
        },
        boisterous_laugh: {
            src: "/images/characters/isanari/isanari_boisterous_laugh.webp",
            scale: 1,
        },
        proud_emotional: {
            src: "/images/characters/isanari/isanari_proud_emotional.webp",
            scale: 1,
        },
        hungover: {
            src: "/images/characters/isanari/isanari_hungover.webp",
            scale: 1,
        },
        protective_alarm: {
            src: "/images/characters/isanari/isanari_protective_alarm.webp",
            scale: 1,
        },
    },
    isanari_young: {
        neutral: {
            src: "/images/characters/isanari_young/isanari_young_neutral.webp",
            scale: 0.96,
        },
        flustered: {
            src: "/images/characters/isanari_young/isanari_young_flustered.webp",
            scale: 0.96,
        },
        shocked: {
            src: "/images/characters/isanari_young/isanari_young_shocked.webp",
            scale: 0.96,
        },
        determined: {
            src: "/images/characters/isanari_young/isanari_young_determined.webp",
            scale: 0.96,
        },
        warm_smile: {
            src: "/images/characters/isanari_young/isanari_young_warm_smile.webp",
            scale: 0.96,
        },
    },
    maruo_young: {
        neutral: {
            src: "/images/characters/maruo_young/maruo_young_neutral.webp",
            scale: 0.96,
        },
        stern: {
            src: "/images/characters/maruo_young/maruo_young_stern.webp",
            scale: 0.96,
        },
        awkward: {
            src: "/images/characters/maruo_young/maruo_young_awkward.webp",
            scale: 0.96,
        },
    },
    shimoda_young: {
        frantic_warning: {
            src: "/images/characters/shimoda_young/shimoda_young_frantic_warning.webp",
            scale: 0.96,
        },
        exasperated_scolding: {
            src: "/images/characters/shimoda_young/shimoda_young_exasperated_scolding.webp",
            scale: 0.96,
        },
    },
    maruo: {
        chapter_10_composed: {
            src: "/images/characters/maruo/chapter_10/maruo_composed.webp",
            scale: 1,
        },
        chapter_10_pained_reflection: {
            src: "/images/characters/maruo/chapter_10/maruo_pained_reflection.webp",
            scale: 1,
        },
        chapter_10_soft_smile: {
            src: "/images/characters/maruo/chapter_10/maruo_soft_smile.webp",
            scale: 1,
        },
        onsen_travel_neutral: {
            src: "/images/characters/maruo/onsen_travel/maruo_neutral.webp",
            scale: 1,
        },
        onsen_travel_stern: {
            src: "/images/characters/maruo/onsen_travel/maruo_stern.webp",
            scale: 1,
        },
        onsen_travel_composed: {
            src: "/images/characters/maruo/onsen_travel/maruo_composed.webp",
            scale: 1,
        },
        onsen_travel_concerned: {
            src: "/images/characters/maruo/onsen_travel/maruo_concerned.webp",
            scale: 1,
        },
        onsen_travel_soft_smile: {
            src: "/images/characters/maruo/onsen_travel/maruo_soft_smile.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/maruo/maruo_neutral.webp",
            scale: 1,
        },
        stern: {
            src: "/images/characters/maruo/maruo_stern.webp",
            scale: 1,
        },
        composed: {
            src: "/images/characters/maruo/maruo_composed.webp",
            scale: 1,
        },
        concerned: {
            src: "/images/characters/maruo/maruo_concerned.webp",
            scale: 1,
        },
        soft_smile: {
            src: "/images/characters/maruo/maruo_soft_smile.webp",
            scale: 1,
        },
        surprised: {
            src: "/images/characters/maruo/maruo_surprised.webp",
            scale: 1,
        },
        pained_reflection: {
            src: "/images/characters/maruo/maruo_pained_reflection.webp",
            scale: 1,
        },
        awkward_warmth: {
            src: "/images/characters/maruo/maruo_awkward_warmth.webp",
            scale: 1,
        },
    },
    ebata: {
        polite_greeting: {
            src: "/images/characters/ebata/ebata_polite_greeting.webp",
            scale: 1,
        },
        service_bow: {
            src: "/images/characters/ebata/ebata_service_bow.webp",
            scale: 1,
        },
    },
    grandpa: {
        neutral: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_neutral.webp",
            scale: 1,
        },
        authoritative: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_authoritative.webp",
            scale: 1,
        },
        gentle: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_gentle.webp",
            scale: 1,
        },
        concerned: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_concerned.webp",
            scale: 1,
        },
        grateful: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_grateful.webp",
            scale: 1,
        },
        regretful: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_regretful.webp",
            scale: 1,
        },
        relieved_smile: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_relieved_smile.webp",
            scale: 1,
        },
        frail_tired: {
            src: "/images/characters/grandpa_nakano/grandpa_nakano_frail_tired.webp",
            scale: 1,
        },
    },
    aoi: {
        bakery_cheerful_peace: {
            src: "/images/characters/aoi/bakery/aoi_cheerful_peace.webp",
            scale: 1,
        },
        bakery_determined: {
            src: "/images/characters/aoi/bakery/aoi_determined.webp",
            scale: 1,
        },
        bakery_maternal: {
            src: "/images/characters/aoi/bakery/aoi_maternal.webp",
            scale: 1,
        },
        bakery_ill: {
            src: "/images/characters/aoi/bakery/aoi_ill.webp",
            scale: 1,
        },
        cheerful_peace: {
            src: "/images/characters/aoi/aoi_cheerful_peace.webp",
            scale: 1,
        },
        curious: {
            src: "/images/characters/aoi/aoi_curious.webp",
            scale: 1,
        },
        bashful: {
            src: "/images/characters/aoi/aoi_bashful.webp",
            scale: 1,
        },
        determined: {
            src: "/images/characters/aoi/aoi_determined.webp",
            scale: 1,
        },
        maternal: {
            src: "/images/characters/aoi/aoi_maternal.webp",
            scale: 1,
        },
        pregnancy_joy: {
            src: "/images/characters/aoi/aoi_pregnancy_joy.webp",
            scale: 1,
        },
        ill: {
            src: "/images/characters/aoi/aoi_ill.webp",
            scale: 1,
        },
        tearful: {
            src: "/images/characters/aoi/aoi_tearful.webp",
            scale: 1,
        },
    },
    rena: {
        hidden: {
            src: "/images/characters/rena/rena_hidden.webp",
            scale: 1,
        },
    },
    ichika: {
        chapter_10_warm_smile: {
            src: "/images/characters/ichika/chapter_10/ichika_warm_smile.webp",
            scale: 1,
        },
        chapter_10_teasing: {
            src: "/images/characters/ichika/chapter_10/ichika_teasing.webp",
            scale: 1,
        },
        chapter_10_embarrassed: {
            src: "/images/characters/ichika/chapter_10/ichika_embarrassed.webp",
            scale: 1,
        },
        chapter_10_laughing: {
            src: "/images/characters/ichika/chapter_10/ichika_laughing.webp",
            scale: 1,
        },
        chapter_11_actress_award_surprise: {
            src: "/images/characters/ichika/chapter_11/ichika_actress_award_surprise.webp",
            scale: 1,
        },
        chapter_11_actress_determined: {
            src: "/images/characters/ichika/chapter_11/ichika_actress_determined.webp",
            scale: 1,
        },
        chapter_11_warm_explain: {
            src: "/images/characters/ichika/chapter_11/ichika_warm_explain.webp",
            scale: 1,
        },
        chapter_11_awkward_reaction: {
            src: "/images/characters/ichika/chapter_11/ichika_awkward_reaction.webp",
            scale: 1,
        },
        rena_disguise_neutral: {
            src: "/images/characters/ichika/rena_disguise/ichika_neutral.webp",
            scale: 1,
        },
        rena_disguise_teasing: {
            src: "/images/characters/ichika/rena_disguise/ichika_teasing.webp",
            scale: 1,
        },
        rena_disguise_sad_reflective: {
            src: "/images/characters/ichika/rena_disguise/ichika_sad_reflective.webp",
            scale: 1,
        },
        rena_disguise_warm_smile: {
            src: "/images/characters/ichika/rena_disguise/ichika_warm_smile.webp",
            scale: 1,
        },
        rena_disguise_embarrassed: {
            src: "/images/characters/ichika/rena_disguise/ichika_embarrassed.webp",
            scale: 1,
        },
        rena_disguise_laughing: {
            src: "/images/characters/ichika/rena_disguise/ichika_laughing.webp",
            scale: 1,
        },
        onsen_yukata_neutral: {
            src: "/images/characters/ichika/onsen_yukata/ichika_neutral.webp",
            scale: 1,
        },
        onsen_yukata_concerned: {
            src: "/images/characters/ichika/onsen_yukata/ichika_concerned.webp",
            scale: 1,
        },
        onsen_yukata_sad_reflective: {
            src: "/images/characters/ichika/onsen_yukata/ichika_sad_reflective.webp",
            scale: 1,
        },
        onsen_yukata_teasing: {
            src: "/images/characters/ichika/onsen_yukata/ichika_teasing.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/ichika/ichika_neutral.webp",
            scale: 1,
        },
        teasing: {
            src: "/images/characters/ichika/ichika_teasing.webp",
            scale: 1,
        },
        concerned: {
            src: "/images/characters/ichika/ichika_concerned.webp",
            scale: 1,
        },
        confident: {
            src: "/images/characters/ichika/ichika_confident.webp",
            scale: 1,
        },
        warm_smile: {
            src: "/images/characters/ichika/ichika_warm_smile.webp",
            scale: 1,
        },
        laughing: {
            src: "/images/characters/ichika/ichika_laughing.webp",
            scale: 1,
        },
        embarrassed: {
            src: "/images/characters/ichika/ichika_embarrassed.webp",
            scale: 1,
        },
        sad_reflective: {
            src: "/images/characters/ichika/ichika_sad_reflective.webp",
            scale: 1,
        },
    },
    nino: {
        chapter_10_neutral: {
            src: "/images/characters/nino/chapter_10/nino_neutral.webp",
            scale: 1,
        },
        chapter_10_annoyed: {
            src: "/images/characters/nino/chapter_10/nino_annoyed.webp",
            scale: 1,
        },
        chapter_10_angry: {
            src: "/images/characters/nino/chapter_10/nino_angry.webp",
            scale: 1,
        },
        chapter_10_soft: {
            src: "/images/characters/nino/chapter_10/nino_soft.webp",
            scale: 1,
        },
        chapter_10_emotional: {
            src: "/images/characters/nino/chapter_10/nino_emotional.webp",
            scale: 1,
        },
        chapter_11_teasing: {
            src: "/images/characters/nino/chapter_11/nino_teasing.webp",
            scale: 1,
        },
        chapter_11_annoyed: {
            src: "/images/characters/nino/chapter_11/nino_annoyed.webp",
            scale: 1,
        },
        chapter_11_commanding: {
            src: "/images/characters/nino/chapter_11/nino_commanding.webp",
            scale: 1,
        },
        chapter_11_chef_unfazed: {
            src: "/images/characters/nino/chapter_11/nino_chef_unfazed.webp",
            scale: 1,
        },
        chapter_11_chef_rallying: {
            src: "/images/characters/nino/chapter_11/nino_chef_rallying.webp",
            scale: 1,
        },
        rena_disguise_neutral: {
            src: "/images/characters/nino/rena_disguise/nino_neutral.webp",
            scale: 1,
        },
        rena_disguise_proud: {
            src: "/images/characters/nino/rena_disguise/nino_proud.webp",
            scale: 1,
        },
        rena_disguise_annoyed: {
            src: "/images/characters/nino/rena_disguise/nino_annoyed.webp",
            scale: 1,
        },
        rena_disguise_happy: {
            src: "/images/characters/nino/rena_disguise/nino_happy.webp",
            scale: 1,
        },
        rena_disguise_soft: {
            src: "/images/characters/nino/rena_disguise/nino_soft.webp",
            scale: 1,
        },
        rena_disguise_embarrassed: {
            src: "/images/characters/nino/rena_disguise/nino_embarrassed.webp",
            scale: 1,
        },
        onsen_yukata_neutral: {
            src: "/images/characters/nino/onsen_yukata/nino_neutral.webp",
            scale: 1,
        },
        onsen_yukata_annoyed: {
            src: "/images/characters/nino/onsen_yukata/nino_annoyed.webp",
            scale: 1,
        },
        onsen_yukata_soft: {
            src: "/images/characters/nino/onsen_yukata/nino_soft.webp",
            scale: 1,
        },
        onsen_yukata_proud: {
            src: "/images/characters/nino/onsen_yukata/nino_proud.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/nino/nino_neutral.webp",
            scale: 1,
        },
        annoyed: {
            src: "/images/characters/nino/nino_annoyed.webp",
            scale: 1,
        },
        proud: {
            src: "/images/characters/nino/nino_proud.webp",
            scale: 1,
        },
        soft: {
            src: "/images/characters/nino/nino_soft.webp",
            scale: 1,
        },
        happy: {
            src: "/images/characters/nino/nino_happy.webp",
            scale: 1,
        },
        embarrassed: {
            src: "/images/characters/nino/nino_embarrassed.webp",
            scale: 1,
        },
        worried: {
            src: "/images/characters/nino/nino_worried.webp",
            scale: 1,
        },
        angry: {
            src: "/images/characters/nino/nino_angry.webp",
            scale: 1,
        },
    },
    miku: {
        neutral: {
            src: "/images/characters/miku/miku_neutral.webp",
            scale: 1,
        },
        gentle: {
            src: "/images/characters/miku/miku_gentle.webp",
            scale: 1,
        },
        serious: {
            src: "/images/characters/miku/miku_serious.webp",
            scale: 1,
        },
        embarrassed: {
            src: "/images/characters/miku/miku_embarrassed.webp",
            scale: 1,
        },
        warm_laugh: {
            src: "/images/characters/miku/miku_warm_laugh.webp",
            scale: 1,
        },
        thoughtful: {
            src: "/images/characters/miku/miku_thoughtful.webp",
            scale: 1,
        },
        hurt: {
            src: "/images/characters/miku/miku_hurt.webp",
            scale: 1,
        },
        teary_smile: {
            src: "/images/characters/miku/miku_teary_smile.webp",
            scale: 1,
        },
        chapter_08_gentle: {
            src: "/images/characters/miku/chapter_08/miku_gentle.webp",
            scale: 1,
        },
        chapter_08_serious: {
            src: "/images/characters/miku/chapter_08/miku_serious.webp",
            scale: 1,
        },
        chapter_08_embarrassed: {
            src: "/images/characters/miku/chapter_08/miku_embarrassed.webp",
            scale: 1,
        },
        chapter_08_warm_laugh: {
            src: "/images/characters/miku/chapter_08/miku_warm_laugh.webp",
            scale: 1,
        },
        chapter_08_thoughtful: {
            src: "/images/characters/miku/chapter_08/miku_thoughtful.webp",
            scale: 1,
        },
        chapter_08_hurt: {
            src: "/images/characters/miku/chapter_08/miku_hurt.webp",
            scale: 1,
        },
        chapter_08_teary_smile: {
            src: "/images/characters/miku/chapter_08/miku_teary_smile.webp",
            scale: 1,
        },
        chapter_08_startled_retreat: {
            src: "/images/characters/miku/chapter_08/miku_startled_retreat.webp",
            scale: 1,
        },
        chapter_08_crying_guarded: {
            src: "/images/characters/miku/chapter_08/miku_crying_guarded.webp",
            scale: 1,
        },
        chapter_08_playful_resolved: {
            src: "/images/characters/miku/chapter_08/miku_playful_resolved.webp",
            scale: 1,
        },
        chapter_09_neutral: {
            src: "/images/characters/miku/chapter_09/miku_neutral.webp",
            scale: 1,
        },
        chapter_09_gentle: {
            src: "/images/characters/miku/chapter_09/miku_gentle.webp",
            scale: 1,
        },
        chapter_09_pout: {
            src: "/images/characters/miku/chapter_09/miku_pout.webp",
            scale: 1,
        },
        chapter_09_embarrassed: {
            src: "/images/characters/miku/chapter_09/miku_embarrassed.webp",
            scale: 1,
        },
        chapter_09_bright_reunion: {
            src: "/images/characters/miku/chapter_09/miku_bright_reunion.webp",
            scale: 1,
        },
        chapter_09_thoughtful: {
            src: "/images/characters/miku/chapter_09/miku_thoughtful.webp",
            scale: 1,
        },
        chapter_09_vulnerable: {
            src: "/images/characters/miku/chapter_09/miku_vulnerable.webp",
            scale: 1,
        },
        chapter_09_teary_smile: {
            src: "/images/characters/miku/chapter_09/miku_teary_smile.webp",
            scale: 1,
        },
        chapter_09_startled: {
            src: "/images/characters/miku/chapter_09/miku_startled.webp",
            scale: 1,
        },
        chapter_09_playful: {
            src: "/images/characters/miku/chapter_09/miku_playful.webp",
            scale: 1,
        },
        chapter_09_crying_guarded: {
            src: "/images/characters/miku/chapter_09/miku_crying_guarded.webp",
            scale: 1,
        },
        chapter_09_teacher_enthusiastic: {
            src: "/images/characters/miku/chapter_09/miku_teacher_enthusiastic.webp",
            scale: 1,
        },
        chapter_10_gentle: {
            src: "/images/characters/miku/chapter_10/miku_gentle.webp",
            scale: 1,
        },
        chapter_10_joyful: {
            src: "/images/characters/miku/chapter_10/miku_joyful.webp",
            scale: 1,
        },
        chapter_10_playful: {
            src: "/images/characters/miku/chapter_10/miku_playful.webp",
            scale: 1,
        },
        chapter_10_embarrassed: {
            src: "/images/characters/miku/chapter_10/miku_embarrassed.webp",
            scale: 1,
        },
        chapter_10_teary_smile: {
            src: "/images/characters/miku/chapter_10/miku_teary_smile.webp",
            scale: 1,
        },
        chapter_10_proud: {
            src: "/images/characters/miku/chapter_10/miku_proud.webp",
            scale: 1,
        },
        chapter_11_gentle_welcome: {
            src: "/images/characters/miku/chapter_11/miku_gentle_welcome.webp",
            scale: 1,
        },
        chapter_11_ring_proud: {
            src: "/images/characters/miku/chapter_11/miku_ring_proud.webp",
            scale: 1,
        },
        chapter_11_family_reveal: {
            src: "/images/characters/miku/chapter_11/miku_family_reveal.webp",
            scale: 1,
        },
        chapter_11_playful_fufu: {
            src: "/images/characters/miku/chapter_11/miku_playful_fufu.webp",
            scale: 1,
        },
        chapter_11_teary_memory: {
            src: "/images/characters/miku/chapter_11/miku_teary_memory.webp",
            scale: 1,
        },
        chapter_11_bright_call: {
            src: "/images/characters/miku/chapter_11/miku_bright_call.webp",
            scale: 1,
        },
    },
    yotsuba: {
        chapter_10_cheerful: {
            src: "/images/characters/yotsuba/chapter_10/yotsuba_cheerful.webp",
            scale: 1,
        },
        chapter_10_nervous: {
            src: "/images/characters/yotsuba/chapter_10/yotsuba_nervous.webp",
            scale: 1,
        },
        chapter_10_shocked: {
            src: "/images/characters/yotsuba/chapter_10/yotsuba_shocked.webp",
            scale: 1,
        },
        chapter_10_determined: {
            src: "/images/characters/yotsuba/chapter_10/yotsuba_determined.webp",
            scale: 1,
        },
        chapter_11_athlete_focused: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_athlete_focused.webp",
            scale: 1,
        },
        chapter_11_athlete_medal_victory: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_athlete_medal_victory.webp",
            scale: 1,
        },
        chapter_11_cheerful_wave: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_cheerful_wave.webp",
            scale: 1,
        },
        chapter_11_curious_notice: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_curious_notice.webp",
            scale: 1,
        },
        chapter_11_shocked_reveal: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_shocked_reveal.webp",
            scale: 1,
        },
        chapter_11_playful_pout: {
            src: "/images/characters/yotsuba/chapter_11/yotsuba_playful_pout.webp",
            scale: 1,
        },
        rena_disguise_neutral: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_neutral.webp",
            scale: 1,
        },
        rena_disguise_cheerful: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_cheerful.webp",
            scale: 1,
        },
        rena_disguise_nervous: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_nervous.webp",
            scale: 1,
        },
        rena_disguise_determined: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_determined.webp",
            scale: 1,
        },
        rena_disguise_sad_smile: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_sad_smile.webp",
            scale: 1,
        },
        rena_disguise_shocked: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_shocked.webp",
            scale: 1,
        },
        rena_disguise_crying: {
            src: "/images/characters/yotsuba/rena_disguise/yotsuba_crying.webp",
            scale: 1,
        },
        onsen_yukata_neutral: {
            src: "/images/characters/yotsuba/onsen_yukata/yotsuba_neutral.webp",
            scale: 1,
        },
        onsen_yukata_nervous: {
            src: "/images/characters/yotsuba/onsen_yukata/yotsuba_nervous.webp",
            scale: 1,
        },
        onsen_yukata_sad_smile: {
            src: "/images/characters/yotsuba/onsen_yukata/yotsuba_sad_smile.webp",
            scale: 1,
        },
        onsen_yukata_determined: {
            src: "/images/characters/yotsuba/onsen_yukata/yotsuba_determined.webp",
            scale: 1,
        },
        onsen_yukata_wave: {
            src: "/images/characters/yotsuba/onsen_yukata/yotsuba_wave.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/yotsuba/yotsuba_neutral.webp",
            scale: 1,
        },
        wave: {
            src: "/images/characters/yotsuba/yotsuba_wave.webp",
            scale: 1,
        },
        nervous: {
            src: "/images/characters/yotsuba/yotsuba_nervous.webp",
            scale: 1,
        },
        determined: {
            src: "/images/characters/yotsuba/yotsuba_determined.webp",
            scale: 1,
        },
        cheerful: {
            src: "/images/characters/yotsuba/yotsuba_cheerful.webp",
            scale: 1,
        },
        shocked: {
            src: "/images/characters/yotsuba/yotsuba_shocked.webp",
            scale: 1,
        },
        sad_smile: {
            src: "/images/characters/yotsuba/yotsuba_sad_smile.webp",
            scale: 1,
        },
        crying: {
            src: "/images/characters/yotsuba/yotsuba_crying.webp",
            scale: 1,
        },
    },
    itsuki: {
        chapter_10_warm: {
            src: "/images/characters/itsuki/chapter_10/itsuki_warm.webp",
            scale: 1,
        },
        chapter_10_serious: {
            src: "/images/characters/itsuki/chapter_10/itsuki_serious.webp",
            scale: 1,
        },
        chapter_10_surprised: {
            src: "/images/characters/itsuki/chapter_10/itsuki_surprised.webp",
            scale: 1,
        },
        chapter_10_thoughtful: {
            src: "/images/characters/itsuki/chapter_10/itsuki_thoughtful.webp",
            scale: 1,
        },
        chapter_11_teacher_attentive: {
            src: "/images/characters/itsuki/chapter_11/itsuki_teacher_attentive.webp",
            scale: 1,
        },
        chapter_11_teacher_eager_help: {
            src: "/images/characters/itsuki/chapter_11/itsuki_teacher_eager_help.webp",
            scale: 1,
        },
        chapter_11_hopeful_wish: {
            src: "/images/characters/itsuki/chapter_11/itsuki_hopeful_wish.webp",
            scale: 1,
        },
        chapter_11_baffled_reaction: {
            src: "/images/characters/itsuki/chapter_11/itsuki_baffled_reaction.webp",
            scale: 1,
        },
        rena_disguise_neutral: {
            src: "/images/characters/itsuki/rena_disguise/itsuki_neutral.webp",
            scale: 1,
        },
        rena_disguise_indignant: {
            src: "/images/characters/itsuki/rena_disguise/itsuki_indignant.webp",
            scale: 1,
        },
        rena_disguise_flustered: {
            src: "/images/characters/itsuki/rena_disguise/itsuki_flustered.webp",
            scale: 1,
        },
        rena_disguise_warm: {
            src: "/images/characters/itsuki/rena_disguise/itsuki_warm.webp",
            scale: 1,
        },
        rena_disguise_thoughtful: {
            src: "/images/characters/itsuki/rena_disguise/itsuki_thoughtful.webp",
            scale: 1,
        },
        onsen_yukata_neutral: {
            src: "/images/characters/itsuki/onsen_yukata/itsuki_neutral.webp",
            scale: 1,
        },
        onsen_yukata_joyful: {
            src: "/images/characters/itsuki/onsen_yukata/itsuki_joyful.webp",
            scale: 1,
        },
        onsen_yukata_surprised: {
            src: "/images/characters/itsuki/onsen_yukata/itsuki_surprised.webp",
            scale: 1,
        },
        onsen_yukata_thoughtful: {
            src: "/images/characters/itsuki/onsen_yukata/itsuki_thoughtful.webp",
            scale: 1,
        },
        onsen_yukata_flustered: {
            src: "/images/characters/itsuki/onsen_yukata/itsuki_flustered.webp",
            scale: 1,
        },
        neutral: {
            src: "/images/characters/itsuki/itsuki_neutral.webp",
            scale: 1,
        },
        surprised: {
            src: "/images/characters/itsuki/itsuki_surprised.webp",
            scale: 1,
        },
        warm: {
            src: "/images/characters/itsuki/itsuki_warm.webp",
            scale: 1,
        },
        serious: {
            src: "/images/characters/itsuki/itsuki_serious.webp",
            scale: 1,
        },
        thoughtful: {
            src: "/images/characters/itsuki/itsuki_thoughtful.webp",
            scale: 1,
        },
        joyful: {
            src: "/images/characters/itsuki/itsuki_joyful.webp",
            scale: 1,
        },
        indignant: {
            src: "/images/characters/itsuki/itsuki_indignant.webp",
            scale: 1,
        },
        flustered: {
            src: "/images/characters/itsuki/itsuki_flustered.webp",
            scale: 1,
        },
    },
} as const;

export type CharacterSpriteId = keyof typeof characterSprites;

export function getCharacterSprite(characterId: string, expression = "neutral") {
    const character = characterSprites[characterId.toLowerCase() as CharacterSpriteId];

    if (!character) {
        return undefined;
    }

    const expressions = character as Record<string, CharacterSpriteDefinition>;
    return expressions[expression] || expressions.neutral || expressions.smile || Object.values(expressions)[0];
}

export function setCharacterSpritePreloadSequence(sequence: readonly StorySpritePrefetchEntry[]) {
    if (activeSpriteSequence === sequence) return;

    cancelSpritePrefetch();
    activeSpriteSequence = sequence;
    spriteSequenceCursor = 0;
    scheduleSpritePrefetch();
}

export function clearCharacterSpritePreloadSequence() {
    cancelSpritePrefetch();
    activeSpriteSequence = [];
    spriteSequenceCursor = 0;
}

export async function preloadCharacterSprite(characterId: string, expression = "neutral") {
    const sprite = getCharacterSprite(characterId, expression);

    if (!sprite || typeof Image === "undefined") {
        return sprite;
    }

    await loadCharacterSpriteResource(sprite.src);
    advanceSpriteSequence(characterId, expression);
    scheduleSpritePrefetch();
    return sprite;
}

async function loadCharacterSpriteResource(source: string) {
    let preload = spritePreloadCache.get(source);
    if (preload) {
        spritePreloadCache.delete(source);
        spritePreloadCache.set(source, preload);
    }
    if (!preload) {
        preload = new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = async () => {
                try {
                    await image.decode();
                } catch {
                    // onload already guarantees that the browser can display it.
                }
                resolve(image);
            };
            image.onerror = () => reject(new Error(`Unable to load character sprite: ${source}`));
            image.src = source;
        }).catch((error) => {
            spritePreloadCache.delete(source);
            console.warn(error);
        });
        spritePreloadCache.set(source, preload);
        while (spritePreloadCache.size > performanceProfile.spritePreloadCacheLimit) {
            const oldestSource = spritePreloadCache.keys().next().value;
            if (typeof oldestSource !== "string") break;
            spritePreloadCache.delete(oldestSource);
        }
    }

    await preload;
}

function advanceSpriteSequence(characterId: string, expression: string) {
    const normalizedCharacterId = characterId.toLowerCase();
    const matchIndex = activeSpriteSequence.findIndex(
        ([sequenceCharacterId, sequenceExpression], index) =>
            index >= spriteSequenceCursor &&
            sequenceCharacterId.toLowerCase() === normalizedCharacterId &&
            sequenceExpression === expression,
    );

    if (matchIndex >= 0) spriteSequenceCursor = matchIndex + 1;
}

function scheduleSpritePrefetch() {
    if (
        spritePrefetchHandle !== undefined ||
        spriteSequenceCursor >= activeSpriteSequence.length ||
        typeof window === "undefined"
    ) {
        return;
    }

    spritePrefetchHandle = scheduleIdleTask(async () => {
        spritePrefetchHandle = undefined;
        const nextEntries = activeSpriteSequence.slice(
            spriteSequenceCursor,
            spriteSequenceCursor + performanceProfile.spritePrefetchCount,
        );

        for (const [characterId, expression] of nextEntries) {
            const sprite = getCharacterSprite(characterId, expression);
            if (sprite) await loadCharacterSpriteResource(sprite.src);
        }
    });
}

function cancelSpritePrefetch() {
    if (spritePrefetchHandle === undefined || typeof window === "undefined") return;

    const idleWindow = window as Window & { cancelIdleCallback?: (handle: number) => void };
    if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(spritePrefetchHandle);
    else window.clearTimeout(spritePrefetchHandle);
    spritePrefetchHandle = undefined;
}

function scheduleIdleTask(callback: () => void | Promise<void>) {
    const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };

    if (idleWindow.requestIdleCallback) {
        return idleWindow.requestIdleCallback(() => void callback(), {
            timeout: performanceProfile.spriteAssetIdleTimeoutMs,
        });
    }
    return window.setTimeout(
        () => void callback(),
        performanceProfile.spritePrefetchFallbackMs,
    );
}
