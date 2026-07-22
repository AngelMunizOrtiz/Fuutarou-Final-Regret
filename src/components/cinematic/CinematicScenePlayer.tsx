import { Box, Typography } from "@mui/joy";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import BubbleAnimation from "../BubbleAnimation";
import DialogueBox from "../DialogueBox";
import { DreamFragment } from "../../data/dreamSequence";

interface CinematicScenePlayerProps {
    sceneId: string;
    frames: DreamFragment[];
    onComplete: () => void | Promise<void>;
}

export default function CinematicScenePlayer({ sceneId, frames, onComplete }: CinematicScenePlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const currentFrame = frames[currentIndex];

    useEffect(() => {
        setCurrentIndex(0);
        setIsCompleting(false);
    }, [sceneId]);

    const complete = useCallback(async () => {
        if (isCompleting) return;

        setIsCompleting(true);
        await onComplete();
    }, [isCompleting, onComplete]);

    const advance = useCallback(() => {
        if (isCompleting) return;

        if (currentIndex < frames.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return;
        }

        void complete();
    }, [complete, currentIndex, frames.length, isCompleting]);

    useEffect(() => {
        if (!currentFrame?.autoAdvanceMs) return;

        const timer = window.setTimeout(() => {
            void advance();
        }, currentFrame.autoAdvanceMs);

        return () => window.clearTimeout(timer);
    }, [advance, currentFrame?.autoAdvanceMs]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                void advance();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [advance]);

    if (!currentFrame) return null;

    const isAutoAdvance = Boolean(currentFrame.autoAdvanceMs);
    const isAwakeningPhase = currentFrame.autoAdvanceMs || currentFrame.flash;
    const visualKey = `${sceneId}-${currentFrame.mediaType || "image"}-${currentFrame.image}-${currentFrame.filter || ""}`;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                backgroundColor: "black",
                cursor: isAutoAdvance || isCompleting ? "default" : "pointer",
            }}
        >
            {!isAutoAdvance && !isCompleting && (
                <Box
                    onClick={(event) => {
                        event.stopPropagation();
                        void advance();
                    }}
                    sx={{ position: "absolute", inset: 0, zIndex: 9999, backgroundColor: "transparent" }}
                />
            )}

            <AnimatePresence mode='wait'>
                <motion.div
                    key={visualKey}
                    initial={{
                        opacity: 0,
                        scale: isAwakeningPhase ? 1 : 1.05,
                        filter: isAwakeningPhase ? "blur(10px) brightness(0)" : "none",
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: isAwakeningPhase ? "blur(0px) brightness(1)" : currentFrame.filter || "none",
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: isAwakeningPhase ? 0.3 : 1.5,
                        ease: "easeInOut",
                    }}
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                >
                    {currentFrame.mediaType === "video" ? (
                        <video
                            src={currentFrame.image}
                            autoPlay
                            playsInline
                            muted
                            onEnded={() => {
                                if (currentFrame.advanceOnVideoEnd) {
                                    void advance();
                                }
                            }}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <img
                            src={currentFrame.image}
                            alt='Cinematic Scene'
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {currentFrame.isDream && (
                <Box sx={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
                    <BubbleAnimation />
                </Box>
            )}

            <AnimatePresence mode='wait'>
                {currentFrame.layout === "intro" && (
                    <motion.div
                        key={`intro-${sceneId}`}
                        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}
                    >
                        <IntroFrame frame={currentFrame} />
                    </motion.div>
                )}
                {currentFrame.layout === "info" && (
                    <motion.div
                        key={`info-${sceneId}-${currentFrame.id}`}
                        initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
                        transition={{ duration: 0.64, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}
                    >
                        <InfoFrame frame={currentFrame} />
                    </motion.div>
                )}
                {currentFrame.layout === "note" && (
                    <motion.div
                        key={`note-${sceneId}-${currentFrame.id}`}
                        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                        transition={{ duration: 0.58, ease: "easeOut" }}
                        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}
                    >
                        <NoteFrame frame={currentFrame} />
                    </motion.div>
                )}
                {currentFrame.layout !== "intro" && currentFrame.layout !== "info" && currentFrame.layout !== "note" && currentFrame.text && (
                    <motion.div
                        key={`dialog-${sceneId}-${currentFrame.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}
                    >
                        <DialogueBox
                            text={currentFrame.text}
                            speaker={currentFrame.speaker}
                            isThought={currentFrame.isThought}
                            variant={currentFrame.isDream ? "dream" : "normal"}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {currentFrame.flash && (
                <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "white",
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                />
            )}
        </Box>
    );
}

function NoteFrame({ frame }: { frame: DreamFragment }) {
    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                background: "linear-gradient(180deg, rgba(20, 14, 28, 0.06), rgba(20, 14, 28, 0.22))",
            }}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, rotate: -10.5, y: 8 }}
                animate={{ opacity: 1, rotate: -10.5, y: 0 }}
                transition={{ delay: 0.18, duration: 0.62, ease: "easeOut" }}
                sx={{
                    position: "absolute",
                    left: { xs: "17%", sm: "18%", md: "19%" },
                    top: { xs: "34%", sm: "33%", md: "32%" },
                    width: { xs: "36vw", sm: "33vw", md: "30vw" },
                    maxWidth: "560px",
                    color: "rgba(76, 72, 74, 0.76)",
                    fontFamily: "'ConteScript', 'Comic Sans MS', cursive",
                    textShadow: "0 1px 0 rgba(255,255,255,0.52)",
                    transformOrigin: "left top",
                    mixBlendMode: "multiply",
                    userSelect: "none",
                }}
            >
                {frame.title && (
                    <Typography
                        sx={{
                            fontFamily: "inherit",
                            color: "inherit",
                            fontSize: { xs: "1rem", sm: "1.24rem", md: "1.42rem" },
                            lineHeight: 1.08,
                            fontWeight: 700,
                            letterSpacing: 0,
                            mb: 0.8,
                        }}
                    >
                        {frame.title}
                    </Typography>
                )}
                {frame.subtitle && (
                    <Typography
                        sx={{
                            fontFamily: "inherit",
                            color: "inherit",
                            fontSize: { xs: "1.26rem", sm: "1.62rem", md: "1.92rem" },
                            lineHeight: 1.18,
                            fontWeight: 700,
                            letterSpacing: 0,
                        }}
                    >
                        {frame.subtitle}
                    </Typography>
                )}
            </Box>

            {frame.details?.[0] && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.46, ease: "easeOut" }}
                    sx={{
                        position: "absolute",
                        left: "50%",
                        bottom: { xs: "8.5%", md: "9.5%" },
                        transform: "translateX(-50%)",
                        width: "min(780px, 84vw)",
                        px: { xs: 2.4, sm: 3.2 },
                        py: { xs: 1.2, sm: 1.45 },
                        borderRadius: "18px",
                        border: "1px solid rgba(255, 230, 157, 0.34)",
                        backgroundColor: "rgba(255, 249, 242, 0.34)",
                        backdropFilter: "blur(10px) saturate(125%)",
                        boxShadow: "0 14px 42px rgba(42, 25, 48, 0.24)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "rgba(45, 35, 50, 0.9)",
                            fontFamily: "'MPLUSRounded', sans-serif",
                            fontSize: { xs: "0.92rem", sm: "1.04rem", md: "1.15rem" },
                            fontWeight: 700,
                            lineHeight: 1.35,
                            textAlign: "center",
                            letterSpacing: 0,
                            textShadow: "0 1px 0 rgba(255,255,255,0.54)",
                        }}
                    >
                        {frame.details[0]}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

function InfoFrame({ frame }: { frame: DreamFragment }) {
    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                px: { xs: 2.5, sm: 4, md: 7 },
                background: `
                    radial-gradient(circle at 50% 34%, rgba(255, 246, 201, 0.12), transparent 34%),
                    linear-gradient(180deg, rgba(31, 18, 38, 0.1), rgba(35, 19, 35, 0.28))
                `,
                overflow: "hidden",
            }}
        >
            <Box
                component={motion.div}
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                sx={{
                    position: "relative",
                    width: "min(840px, 90vw)",
                    maxHeight: "min(68vh, 560px)",
                    overflow: "auto",
                    borderRadius: { xs: "18px", md: "28px" },
                    border: "2px solid transparent",
                    background: `
                        linear-gradient(135deg, rgba(255, 252, 247, 0.7), rgba(255, 239, 247, 0.56), rgba(255, 249, 224, 0.64)) padding-box,
                        linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255, 212, 92, 0.9), rgba(199, 119, 255, 0.76), rgba(255, 144, 190, 0.84)) border-box
                    `,
                    boxShadow: `
                        0 24px 74px rgba(28, 18, 38, 0.42),
                        0 0 38px rgba(255, 205, 107, 0.18),
                        inset 0 1px 0 rgba(255,255,255,0.82)
                    `,
                    backdropFilter: "blur(14px) saturate(140%)",
                    textAlign: "center",
                    px: { xs: 3.25, sm: 5.5, md: 7 },
                    py: { xs: 3.25, sm: 4.5, md: 5.35 },
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(169, 83, 141, 0.42) transparent",
                    "&::-webkit-scrollbar": {
                        width: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        borderRadius: 999,
                        backgroundColor: "rgba(169, 83, 141, 0.42)",
                    },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 10,
                        borderRadius: { xs: "14px", md: "22px" },
                        border: "1px solid rgba(255, 224, 142, 0.55)",
                        boxShadow: `
                            inset 0 0 24px rgba(255, 245, 206, 0.18),
                            0 0 20px rgba(255, 165, 211, 0.13)
                        `,
                        pointerEvents: "none",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "12%",
                        right: "12%",
                        top: 18,
                        height: 3,
                        borderRadius: 999,
                        background: "linear-gradient(90deg, transparent, rgba(255, 217, 95, 0.9), rgba(195, 110, 255, 0.58), transparent)",
                        boxShadow: "0 0 16px rgba(255, 209, 91, 0.48)",
                        pointerEvents: "none",
                    },
                }}
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    {frame.title && (
                        <Typography
                            component='h2'
                            sx={{
                                color: "#7c3f73",
                                backgroundImage: "linear-gradient(180deg, #fff9cd 0%, #ffd871 38%, #b66e36 72%, #ffe8a8 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontFamily: "'MPLUSRounded', sans-serif",
                                fontSize: { xs: "1.95rem", sm: "2.55rem", md: "3.12rem" },
                                fontWeight: 900,
                                lineHeight: 1.18,
                                pb: 0.35,
                                overflow: "visible",
                                filter: `
                                    drop-shadow(0 3px 0 rgba(111, 53, 86, 0.5))
                                    drop-shadow(0 8px 0 rgba(188, 104, 79, 0.18))
                                    drop-shadow(0 18px 24px rgba(255, 183, 82, 0.25))
                                    drop-shadow(0 0 16px rgba(255, 239, 176, 0.4))
                                `,
                            }}
                        >
                            {frame.title}
                        </Typography>
                    )}
                    {frame.subtitle && (
                        <Typography
                            sx={{
                                mt: { xs: 0.9, md: 1.2 },
                                color: "#89417e",
                                fontFamily: "'MPLUSRounded', sans-serif",
                                fontSize: { xs: "1.15rem", sm: "1.38rem", md: "1.62rem" },
                                fontWeight: 800,
                                letterSpacing: 0,
                                textShadow: `
                                    0 1px 0 rgba(255,255,255,0.9),
                                    0 3px 0 rgba(111, 52, 103, 0.22),
                                    0 9px 18px rgba(196, 92, 151, 0.32),
                                    0 0 14px rgba(255, 224, 142, 0.34)
                                `,
                            }}
                        >
                            {frame.subtitle}
                        </Typography>
                    )}
                    {frame.details && frame.details.length > 0 && (
                        <Box
                            sx={{
                                mt: { xs: 2.2, md: 3 },
                                display: "grid",
                                gap: { xs: 1, md: 1.25 },
                            }}
                        >
                            {frame.details.map((detail) => (
                                <Typography
                                    key={detail}
                                    sx={{
                                        color: "#372b3d",
                                        fontFamily: "'MPLUSRounded', sans-serif",
                                        fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.22rem" },
                                        fontWeight: 650,
                                        lineHeight: 1.52,
                                        textShadow: `
                                            0 1px 0 rgba(255,255,255,0.88),
                                            0 2px 0 rgba(92, 50, 82, 0.14),
                                            0 8px 18px rgba(84, 46, 78, 0.24),
                                            0 0 12px rgba(255, 230, 158, 0.18)
                                        `,
                                    }}
                                >
                                    {detail}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

function IntroFrame({ frame }: { frame: DreamFragment }) {
    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                px: { xs: 2.5, sm: 4, md: 8 },
                overflow: "hidden",
                background: `
                    linear-gradient(90deg, rgba(255, 199, 225, 0.18), transparent 18%, transparent 82%, rgba(255, 218, 134, 0.2)),
                    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 26px),
                    linear-gradient(180deg, rgba(38, 20, 44, 0.2), rgba(42, 20, 36, 0.5))
                `,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: { xs: 12, md: 26 },
                    borderRadius: { xs: "22px", md: "36px" },
                    border: "1px solid rgba(255, 225, 147, 0.44)",
                    boxShadow: `
                        inset 0 0 28px rgba(255, 245, 204, 0.12),
                        0 0 28px rgba(255, 180, 211, 0.14)
                    `,
                    pointerEvents: "none",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    opacity: 0.32,
                    backgroundImage: `
                        linear-gradient(90deg, transparent 0 8%, rgba(255, 235, 169, 0.55) 8.2%, transparent 8.5%, transparent 91.5%, rgba(255, 235, 169, 0.55) 91.8%, transparent 92%),
                        repeating-linear-gradient(0deg, transparent 0 44px, rgba(255, 255, 255, 0.1) 44px 46px)
                    `,
                    mixBlendMode: "screen",
                    pointerEvents: "none",
                },
            }}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                sx={{
                    position: "relative",
                    width: "min(900px, 92vw)",
                    overflow: "hidden",
                    borderRadius: { xs: "20px", md: "30px" },
                    border: "2px solid transparent",
                    background: `
                        linear-gradient(135deg, rgba(255, 250, 253, 0.9), rgba(255, 241, 249, 0.78) 46%, rgba(255, 250, 236, 0.86)) padding-box,
                        linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 205, 97, 0.95), rgba(255, 133, 184, 0.76), rgba(183, 218, 255, 0.9)) border-box
                    `,
                    boxShadow: `
                        0 28px 86px rgba(54, 28, 62, 0.36),
                        0 0 34px rgba(255, 215, 115, 0.16),
                        inset 0 1px 0 rgba(255,255,255,0.82)
                    `,
                    backdropFilter: "blur(14px) saturate(145%)",
                    px: { xs: 3, sm: 5.5, md: 7.5 },
                    py: { xs: 3.75, sm: 5.25, md: 6.25 },
                    textAlign: "center",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: `
                            linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.5) 18%, transparent 34%),
                            repeating-linear-gradient(-45deg, rgba(255, 198, 222, 0.13) 0 1px, transparent 1px 18px)
                        `,
                        opacity: 0.62,
                        pointerEvents: "none",
                    },
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "8%",
                        right: "8%",
                        top: 14,
                        height: 3,
                        borderRadius: 999,
                        background: "linear-gradient(90deg, transparent, rgba(255, 209, 97, 0.95), rgba(255, 142, 190, 0.72), transparent)",
                        boxShadow: "0 0 16px rgba(255, 205, 97, 0.46)",
                        pointerEvents: "none",
                    },
                }}
            >
                <motion.svg
                    viewBox='0 0 100 100'
                    preserveAspectRatio='none'
                    style={{
                        position: "absolute",
                        inset: -4,
                        zIndex: 2,
                        width: "calc(100% + 8px)",
                        height: "calc(100% + 8px)",
                        pointerEvents: "none",
                        overflow: "visible",
                    }}
                >
                    <defs>
                        <linearGradient id='intro-neon-border' x1='0%' y1='0%' x2='100%' y2='100%'>
                            <stop offset='0%' stopColor='rgba(255,255,255,0)' />
                            <stop offset='36%' stopColor='rgba(184,118,255,0.25)' />
                            <stop offset='63%' stopColor='rgba(255,143,196,0.72)' />
                            <stop offset='82%' stopColor='rgba(255,255,255,1)' />
                            <stop offset='100%' stopColor='rgba(255,225,124,0.92)' />
                        </linearGradient>
                        <filter id='intro-neon-glow' x='-40%' y='-40%' width='180%' height='180%'>
                            <feGaussianBlur stdDeviation='1.4' result='softGlow' />
                            <feColorMatrix
                                in='softGlow'
                                type='matrix'
                                values='1 0 0 0 0.78 0 1 0 0 0.34 0 0 1 0 1 0 0 0 1 0'
                            />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in='SourceGraphic' />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect
                        x='1.2'
                        y='1.2'
                        width='97.6'
                        height='97.6'
                        rx='4.6'
                        fill='none'
                        stroke='rgba(126, 66, 164, 0.3)'
                        strokeWidth='0.32'
                    />
                    <motion.rect
                        x='1.2'
                        y='1.2'
                        width='97.6'
                        height='97.6'
                        rx='4.6'
                        fill='none'
                        stroke='url(#intro-neon-border)'
                        strokeWidth='0.72'
                        strokeLinecap='round'
                        pathLength={100}
                        strokeDasharray='18 82'
                        filter='url(#intro-neon-glow)'
                        animate={{ strokeDashoffset: [0, -100] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.rect
                        x='1.2'
                        y='1.2'
                        width='97.6'
                        height='97.6'
                        rx='4.6'
                        fill='none'
                        stroke='rgba(255,255,255,0.92)'
                        strokeWidth='0.24'
                        strokeLinecap='round'
                        pathLength={100}
                        strokeDasharray='3 97'
                        filter='url(#intro-neon-glow)'
                        animate={{ strokeDashoffset: [0, -100] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                    />
                </motion.svg>
                <Box
                    component={motion.div}
                    key={frame.id}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.48, ease: "easeOut" }}
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        overflow: "visible",
                    }}
                >
                    <Typography
                        component='h1'
                        sx={{
                            color: "#7a3b69",
                            backgroundImage: "linear-gradient(180deg, #fff6c9 0%, #ffd86f 34%, #b86f2f 68%, #ffe7a3 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "'MPLUSRounded', sans-serif",
                            fontSize: { xs: "2.15rem", sm: "2.85rem", md: "3.55rem" },
                            fontWeight: 800,
                            lineHeight: 1.24,
                            pb: 0.45,
                            overflow: "visible",
                            filter: `
                                drop-shadow(0 4px 0 rgba(116, 54, 76, 0.58))
                                drop-shadow(0 9px 0 rgba(188, 104, 79, 0.22))
                                drop-shadow(0 20px 28px rgba(255, 183, 82, 0.34))
                                drop-shadow(0 0 18px rgba(255, 238, 172, 0.46))
                            `,
                        }}
                    >
                        {frame.title}
                    </Typography>
                    {frame.subtitle && (
                        <Typography
                            sx={{
                                mt: 1.35,
                                color: "#8f3f86",
                                fontFamily: "'MPLUSRounded', sans-serif",
                                fontSize: { xs: "1.05rem", sm: "1.24rem", md: "1.46rem" },
                                fontWeight: 800,
                                letterSpacing: "0",
                                textShadow: `
                                    0 1px 0 rgba(255,255,255,0.92),
                                    0 3px 0 rgba(105, 47, 101, 0.24),
                                    0 8px 16px rgba(196, 92, 151, 0.32),
                                    0 0 14px rgba(255, 223, 142, 0.32)
                                `,
                            }}
                        >
                            {frame.subtitle}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            mt: { xs: 2.65, md: 3.7 },
                            display: "grid",
                            gap: { xs: 1.35, md: 1.75 },
                        }}
                    >
                        {frame.details?.map((detail) => (
                            <Typography
                                key={detail}
                                sx={{
                                    color: "#392d3e",
                                    fontFamily: "'MPLUSRounded', sans-serif",
                                    fontSize: { xs: "1.04rem", sm: "1.16rem", md: "1.3rem" },
                                    fontWeight: 600,
                                    lineHeight: 1.58,
                                    textShadow: `
                                        0 1px 0 rgba(255,255,255,0.9),
                                        0 2px 0 rgba(92, 50, 82, 0.18),
                                        0 7px 16px rgba(84, 46, 78, 0.24),
                                        0 0 12px rgba(255, 230, 158, 0.22)
                                    `,
                                }}
                            >
                                {detail}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
