import { Box, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import {
    DIALOGUE_BOX_HEIGHT,
    DIALOGUE_BOX_IMAGE,
    DIALOGUE_BOX_WIDTH,
    DIALOGUE_CONTENT_PADDING_X,
    DIALOGUE_FRAME_BORDER_WIDTH,
    NAME_BOX_FILTER,
    NAME_BOX_IMAGE,
    NAME_BOX_WIDTH,
    dialogueFrameFilter,
} from "../values/dialogueUi";

interface DialogueBoxProps {
    text: string;
    speaker?: string;
    variant: "dream" | "normal";
    isThought?: boolean;
}

export default function DialogueBox({ text, speaker, variant, isThought }: DialogueBoxProps) {
    const [displayedText, setDisplayedText] = useState("");
    const isDream = variant === "dream";

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const speed = 25;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <Box
            sx={{
                "--dialog-box-height": DIALOGUE_BOX_HEIGHT,
                position: "absolute",
                inset: 0,
                zIndex: 100,
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                    ...(isDream
                        ? {
                              bottom: "40px",
                              width: "90vw",
                              maxWidth: "1400px",
                              minHeight: "160px",
                              backgroundColor: "rgba(255, 255, 255, 0.12)",
                              backdropFilter: "blur(15px) saturate(160%)",
                              borderRadius: "20px",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                              px: { xs: 4, md: 10 },
                              py: 4,
                          }
                        : {
                              bottom: 0,
                              width: DIALOGUE_BOX_WIDTH,
                              maxWidth: "1751px",
                              height: "var(--dialog-box-height)",
                              px: DIALOGUE_CONTENT_PADDING_X,
                              pt: { xs: 3, sm: 3.25, md: 4 },
                              pb: { xs: 2.75, sm: 3, md: 3.5 },
                          }),
                }}
            >
                {!isDream && (
                    <Box
                        aria-hidden
                        sx={{
                            position: "absolute",
                            inset: 0,
                            boxSizing: "border-box",
                            borderStyle: "solid",
                            borderWidth: DIALOGUE_FRAME_BORDER_WIDTH,
                            borderImageSource: DIALOGUE_BOX_IMAGE,
                            borderImageSlice: "34 210 fill",
                            borderImageRepeat: "stretch",
                            filter: dialogueFrameFilter(0.9),
                            pointerEvents: "none",
                        }}
                    />
                )}
                <Typography
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        maxWidth: "1300px",
                        maxHeight: isDream ? "none" : "76%",
                        overflowY: isDream ? "visible" : "auto",
                        fontFamily: "'MPLUSRounded', sans-serif",
                        fontSize: isDream
                            ? "2.3rem"
                            : { xs: "0.95rem", sm: "1.1rem", md: "1.3rem", lg: "1.45rem" },
                        color: isDream ? "white" : isThought ? "rgba(60,60,60,0.8)" : "black",
                        fontStyle: !isDream && isThought ? "italic" : "normal",
                        fontWeight: 500,
                        textAlign: "center",
                        lineHeight: isDream ? 1.4 : 1.5,
                        textShadow: isDream
                            ? `
                                -1.5px -1.5px 0 rgba(0,0,0,0.8),
                                 1.5px -1.5px 0 rgba(0,0,0,0.8),
                                -1.5px  1.5px 0 rgba(0,0,0,0.8),
                                 1.5px  1.5px 0 rgba(0,0,0,0.8)
                              `
                            : "0 1px 0 rgba(255,255,255,0.45)",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(160, 92, 122, 0.45) transparent",
                    }}
                >
                    {displayedText}
                </Typography>
            </Box>

            {speaker && (
                <Box
                    sx={{
                        position: "absolute",
                        zIndex: 110,
                        ...(isDream
                            ? {
                                  left: "8%",
                                  bottom: "200px",
                                  px: 4,
                                  py: 0.5,
                                  backgroundColor: "rgba(255, 165, 0, 0.25)",
                                  backdropFilter: "blur(10px)",
                                  borderRadius: "12px",
                                  border: "1px solid rgba(255, 255, 255, 0.3)",
                              }
                            : {
                                  left: { xs: "4%", md: "5%" },
                                  bottom: "calc(var(--dialog-box-height) - 20px)",
                                  width: NAME_BOX_WIDTH,
                                  aspectRatio: "480 / 90",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                              }),
                    }}
                >
                    {!isDream && (
                        <Box
                            aria-hidden
                            sx={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: NAME_BOX_IMAGE,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                filter: NAME_BOX_FILTER,
                                pointerEvents: "none",
                            }}
                        />
                    )}
                    <Typography
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            width: isDream ? "auto" : "82%",
                            mr: isDream ? 0 : "18%",
                            px: isDream ? 0 : { xs: 1, sm: 1.5, md: 2 },
                            overflow: "hidden",
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: isDream ? "'Sawarabi', sans-serif" : "'ConteScript', cursive",
                            fontSize: isDream
                                ? "1.8rem"
                                : { xs: "1.04rem", sm: "1.28rem", md: "1.48rem", lg: "1.58rem" },
                            color: isDream ? "white" : "rgba(20, 18, 24, 0.94)",
                            mt: isDream ? 0 : -1,
                            textShadow: isDream
                                ? "2px 2px 4px rgba(0,0,0,0.8)"
                                : "0 1px 0 rgba(255,255,255,0.7), 0 2px 3px rgba(71,45,82,0.18)",
                        }}
                    >
                        {isThought ? "??" : speaker}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
