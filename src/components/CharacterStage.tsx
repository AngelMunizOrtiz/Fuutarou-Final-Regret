import Box from "@mui/joy/Box";
import type { CSSProperties } from "react";
import { useQueryDialogue } from "../hooks/useQueryInterface";
import useInterfaceStore from "../stores/useInterfaceStore";
import useCharacterStageStore, { type CharacterStageEntry, type CharacterStageSlotName } from "../stores/useCharacterStageStore";

const slotPositions: Record<CharacterStageSlotName, object> = {
    left: {
        left: { xs: "29%", sm: "28%", md: "27%" },
    },
    center: {
        left: "50%",
    },
    right: {
        left: { xs: "71%", sm: "72%", md: "73%" },
    },
};

function getCharacterStyle(entry: CharacterStageEntry) {
    const baseScale = entry.sprite.scale || 1;

    return {
        "--character-scale": `${baseScale}`,
        "--character-flip": entry.mirror ? "-1" : "1",
        "--character-y": `${entry.sprite.yOffset || 0}px`,
    } as CSSProperties;
}

export default function CharacterStage() {
    const slots = useCharacterStageStore((state) => state.slots);
    const hidden = useInterfaceStore((state) => state.hidden);
    const { data: { animatedText, character, text } = {} } = useQueryDialogue();
    const currentSpeakerId = typeof character?.id === "string" ? character.id.toLowerCase() : undefined;
    const hasDialogue = Boolean(animatedText || text);
    const entries = Object.entries(slots) as [CharacterStageSlotName, CharacterStageEntry][];

    if (!entries.length) {
        return null;
    }

    return (
        <Box
            aria-hidden
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 42,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            {entries.map(([slot, entry]) => {
                const isSpeaking = !hidden && hasDialogue && currentSpeakerId === entry.characterId;

                return (
                    <Box
                        key={slot}
                        className="vn-character-slot"
                        sx={{
                            ...slotPositions[slot],
                            position: "absolute",
                            bottom: 0,
                            width: "clamp(250px, 36cqw, 740px)",
                            maxWidth: "72cqw",
                        }}
                    >
                        <Box
                            className={[
                                "vn-character-body",
                                isSpeaking ? "is-active-speaker" : "",
                                !isSpeaking && currentSpeakerId ? "is-listening" : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            style={getCharacterStyle(entry)}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <Box
                                    component="img"
                                    data-game-sprite
                                    src={entry.sprite.src}
                                    alt=""
                                    decoding="async"
                                    draggable={false}
                                    loading="eager"
                                    sx={{
                                        display: "block",
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "94cqh",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
