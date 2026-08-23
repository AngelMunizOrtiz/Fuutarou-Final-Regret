import { useColorScheme } from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import { useQueryDialogue } from "../hooks/useQueryInterface";
import useInterfaceStore from "../stores/useInterfaceStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import { performanceProfile } from "../utils/performance-profile";
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
import ChoiceMenu from "./ChoiceMenu";

export default function NarrationScreen() {
    const { data: { animatedText, character, text } = {} } = useQueryDialogue();
    const hidden = useInterfaceStore((state) => state.hidden || (animatedText || text ? false : true));
    const dialogueVariants = useMemo(
        () =>
            hidden
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hidden]
    );
    const paragraphRef = useRef<HTMLDivElement>(null);
    const speakerName = [character?.name, character?.surname].filter(Boolean).join(" ");

    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <Box sx={{ position: "absolute", inset: 0, pointerEvents: "auto" }}>
                <ChoiceMenu />
            </Box>
            <Box
                className={`vn-dialogue-shell ${dialogueVariants}`}
                sx={{
                    "--dialog-box-height": DIALOGUE_BOX_HEIGHT,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "var(--dialog-box-height)",
                    pointerEvents: hidden ? "none" : "auto",
                    zIndex: 90,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        bottom: 0,
                        transform: "translateX(-50%)",
                        width: DIALOGUE_BOX_WIDTH,
                        maxWidth: "1751px",
                        height: "var(--dialog-box-height)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: DIALOGUE_CONTENT_PADDING_X,
                        pt: "clamp(1.25rem, 3.7cqh, 2rem)",
                        pb: "clamp(1.1rem, 3.25cqh, 1.75rem)",
                    }}
                >
                    <Box
                        aria-hidden
                        className="vn-dialogue-frame"
                        sx={{
                            position: "absolute",
                            inset: 0,
                            boxSizing: "border-box",
                            borderStyle: "solid",
                            borderWidth: DIALOGUE_FRAME_BORDER_WIDTH,
                            borderImageSource: DIALOGUE_BOX_IMAGE,
                            borderImageSlice: "34 210 fill",
                            borderImageRepeat: "stretch",
                            filter: dialogueFrameFilter(0.94),
                            pointerEvents: "none",
                        }}
                    />
                    <Box
                        ref={paragraphRef}
                        className="vn-dialogue-copy"
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            maxWidth: "1300px",
                            maxHeight: "76%",
                            overflow: "auto",
                            color: "rgba(25, 20, 28, 0.94)",
                            fontFamily: "'MPLUSRounded', sans-serif",
                            fontSize: "clamp(0.82rem, 1.05cqw, 1.14rem)",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: 1.52,
                            textAlign: "center",
                            textShadow: "0 1px 0 rgba(255,255,255,0.35)",
                            pt: 0.75,
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(160, 92, 122, 0.45) transparent",
                            "&::-webkit-scrollbar": {
                                width: 8,
                            },
                            "&::-webkit-scrollbar-thumb": {
                                borderRadius: 999,
                                backgroundColor: "rgba(160, 92, 122, 0.45)",
                            },
                            "& .prose": {
                                color: "inherit",
                            },
                            "& .prose *": {
                                color: "inherit",
                                fontFamily: "inherit",
                            },
                        }}
                    >
                        <NarrationScreenText paragraphRef={paragraphRef} />
                    </Box>
                </Box>
                {speakerName && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: "clamp(4%, 5cqw, 5%)",
                            bottom: "calc(var(--dialog-box-height) - 20px)",
                            width: NAME_BOX_WIDTH,
                            aspectRatio: "480 / 90",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                        }}
                    >
                        <Box
                            aria-hidden
                            className="vn-name-frame"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: NAME_BOX_IMAGE,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                filter: NAME_BOX_FILTER,
                                pointerEvents: "none",
                            }}
                        />
                        <Typography
                            sx={{
                                position: "relative",
                                zIndex: 1,
                                width: "82%",
                                mr: "18%",
                                px: "clamp(0.5rem, 1cqw, 1rem)",
                                overflow: "hidden",
                                color: character?.color || "rgba(20, 18, 24, 0.94)",
                                fontFamily: "'ConteScript', cursive",
                                fontSize: "clamp(1rem, 1.45cqw, 1.58rem)",
                                lineHeight: 1,
                                textAlign: "center",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                textShadow: "0 1px 0 rgba(255,255,255,0.7), 0 2px 3px rgba(71,45,82,0.18)",
                                mt: "clamp(-0.5rem, -0.35cqh, -0.25rem)",
                            }}
                        >
                            {speakerName}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function NarrationScreenText({ paragraphRef }: { paragraphRef: RefObject<HTMLDivElement | null> }) {
    const typewriterDelay = useTypewriterStore(useShallow((state) => state.delay));
    const startTypewriter = useTypewriterStore(useShallow((state) => state.start));
    const endTypewriter = useTypewriterStore(useShallow((state) => state.end));
    const { data: { animatedText, text } = {} } = useQueryDialogue();
    const { mode } = useColorScheme();

    return (
        <p
            className={`prose ${mode === "dark" ? "dark:prose-invert" : ""}`}
            style={{
                margin: 0,
                padding: 0,
                maxWidth: "100%",
                color: "inherit",
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
            }}
        >
            <span>
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: (props) => <span {...props} />,
                    }}
                >
                    {text}
                </Markdown>
            </span>
            <span>
                <span> </span>
                <EfficientTypewriterText
                    text={animatedText || ""}
                    delay={typewriterDelay}
                    paragraphRef={paragraphRef}
                    onStart={startTypewriter}
                    onEnd={endTypewriter}
                />
            </span>
        </p>
    );
}

/**
 * Efficient typewriter for every profile. It keeps one text node and reveals a
 * small batch on each frame instead of mounting and animating one Motion span
 * per character. Reading speed and the shared in-progress state are preserved.
 */
function EfficientTypewriterText({
    text,
    delay,
    paragraphRef,
    onStart,
    onEnd,
}: {
    text: string;
    delay: number;
    paragraphRef: RefObject<HTMLDivElement | null>;
    onStart: () => void;
    onEnd: () => void;
}) {
    const characters = useMemo(() => Array.from(text), [text]);
    const [revealState, setRevealState] = useState(() => ({ source: text, count: 0 }));
    const visibleCount =
        delay <= 0 ? characters.length : revealState.source === text ? revealState.count : 0;
    const lastScrollAtRef = useRef(0);

    useEffect(() => {
        let timer: number | undefined;

        if (characters.length === 0 || delay <= 0) {
            onEnd();
            return undefined;
        }

        onStart();
        const startedAt = performance.now();
        const updateInterval = Math.max(performanceProfile.typewriterFrameMs, delay);

        const revealNextChunk = () => {
            const elapsed = performance.now() - startedAt;
            const nextCount = Math.min(characters.length, Math.max(1, Math.floor(elapsed / delay)));
            setRevealState((current) =>
                current.source === text && current.count === nextCount
                    ? current
                    : { source: text, count: nextCount }
            );

            if (nextCount >= characters.length) {
                onEnd();
                return;
            }

            timer = window.setTimeout(revealNextChunk, updateInterval);
        };

        timer = window.setTimeout(revealNextChunk, Math.min(updateInterval, Math.max(8, delay)));

        return () => {
            if (timer !== undefined) window.clearTimeout(timer);
            onEnd();
        };
    }, [characters, delay, onEnd, onStart, text]);

    useEffect(() => {
        const now = performance.now();
        if (visibleCount < characters.length && now - lastScrollAtRef.current < 120) return;
        lastScrollAtRef.current = now;

        const paragraph = paragraphRef.current;
        if (!paragraph) return;

        const frame = window.requestAnimationFrame(() => {
            if (paragraph.scrollHeight > paragraph.clientHeight) {
                paragraph.scrollTop = paragraph.scrollHeight;
            }
        });
        return () => window.cancelAnimationFrame(frame);
    }, [characters.length, paragraphRef, visibleCount]);

    if (visibleCount >= characters.length) {
        return (
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{ p: (props) => <span {...props} /> }}
            >
                {text}
            </Markdown>
        );
    }

    return <>{characters.slice(0, visibleCount).join("")}</>;
}
