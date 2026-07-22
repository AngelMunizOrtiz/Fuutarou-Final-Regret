export const DIALOGUE_BOX_IMAGE = "url(/images/ui/dialog_box_v2.webp)";
export const NAME_BOX_IMAGE = "url(/images/ui/name_box_v2.webp)";

export const DIALOGUE_BOX_HEIGHT = {
    xs: "clamp(140px, 38vw, 176px)",
    sm: "clamp(150px, 22vw, 220px)",
    md: "clamp(170px, 14.5vw, 278px)",
};

export const DIALOGUE_BOX_WIDTH = "min(94vw, 1751px)";

export const DIALOGUE_FRAME_BORDER_WIDTH = {
    xs: "14px 46px",
    sm: "17px 68px",
    md: "20px 112px",
    lg: "24px 150px",
};

export const DIALOGUE_CONTENT_PADDING_X = {
    xs: 6.5,
    sm: 10,
    md: 17,
    lg: 23,
};

export const NAME_BOX_WIDTH = {
    xs: 198,
    sm: 250,
    md: 304,
    lg: 330,
};

export function dialogueFrameFilter(opacity: number) {
    return `brightness(0.98) contrast(1.1) opacity(${opacity})`;
}

export const NAME_BOX_FILTER = "brightness(1) contrast(1.08) saturate(1.06)";
