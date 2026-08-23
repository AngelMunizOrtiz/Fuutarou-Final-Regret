export const DIALOGUE_BOX_IMAGE = "url(/images/ui/dialog_box_v2.webp)";
export const NAME_BOX_IMAGE = "url(/images/ui/name_box_v2.webp)";

export const DIALOGUE_BOX_HEIGHT = "clamp(124px, 25.75cqh, 278px)";

export const DIALOGUE_BOX_WIDTH = "min(94cqw, 1751px)";

export const DIALOGUE_FRAME_BORDER_WIDTH =
    "clamp(12px, 2.25cqh, 24px) clamp(42px, 7.8cqw, 150px)";

export const DIALOGUE_CONTENT_PADDING_X = "clamp(2.75rem, 9.5cqw, 11.5rem)";

export const NAME_BOX_WIDTH = "clamp(180px, 17.2cqw, 330px)";

export function dialogueFrameFilter(opacity: number) {
    return `brightness(0.98) contrast(1.1) opacity(${opacity})`;
}

export const NAME_BOX_FILTER = "brightness(1) contrast(1.08) saturate(1.06)";
