import { Game, narration } from "@drincs/pixi-vn";
import { Box } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BubbleAnimation from "../components/BubbleAnimation";
import DialogueBox from "../components/DialogueBox";
import { NARRATION_ROUTE } from "../constans";
import { fuutarouDream } from "../data/dreamSequence";
import useGameProps from "../hooks/useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../hooks/useQueryInterface";

export default function DreamSequence() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStartingInk, setIsStartingInk] = useState(false);
    const isStartingInkRef = useRef(false);
    const navigate = useNavigate();
    const gameProps = useGameProps();
    const queryClient = useQueryClient();
    const currentFragment = fuutarouDream[currentIndex];

    // Fase 3 (Despertar): IDs a partir del 13
    const isAwakeningPhase = currentFragment.id >= 13;

    // Solo avanza automáticamente entre el 13 y el 15. 
    // El 16 requiere clic para que el jugador pueda leer el "...!"
    const isAutoAdvance = isAwakeningPhase && currentFragment.id !== 16;

    const startInkStory = useCallback(async () => {
        if (isStartingInkRef.current) return;

        isStartingInkRef.current = true;
        setIsStartingInk(true);
        try {
            Game.clear();
            await narration.call("start", gameProps);
            await queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
            navigate(NARRATION_ROUTE);
        } catch (error) {
            console.error("No se pudo iniciar la historia de Ink:", error);
            isStartingInkRef.current = false;
            setIsStartingInk(false);
        }
    }, [gameProps, navigate, queryClient]);

    const advance = useCallback(() => {
        if (isStartingInkRef.current) return;

        if (currentIndex < fuutarouDream.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            void startInkStory();
        }
    }, [currentIndex, startInkStory]);

    // Auto-avance SOLO para los frames intermedios del despertar
    useEffect(() => {
        if (isAutoAdvance) {
            const timer = setTimeout(() => {
                void advance();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [advance, isAutoAdvance]);

    // Manejo de teclado (Manual para fases 1, 2 y el frame final 16)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                void advance();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [advance]);

    if (!currentFragment) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                backgroundColor: "black",
                cursor: isAutoAdvance || isStartingInk ? "default" : "pointer"
            }}
        >
            {/* 1. CAPA DE CLIC (Activa siempre, EXCEPTO cuando está avanzando solo) */}
            {!isAutoAdvance && !isStartingInk && (
                <Box
                    onClick={(e) => { e.stopPropagation(); void advance(); }}
                    sx={{ position: "absolute", inset: 0, zIndex: 9999, backgroundColor: "transparent" }}
                />
            )}

            {/* 2. CAPA DE IMÁGENES */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentFragment.id}
                    initial={{
                        opacity: 0,
                        // Restauramos el sutil zoom inicial de los recuerdos (1.05)
                        scale: isAwakeningPhase ? 1 : 1.05,
                        filter: isAwakeningPhase ? "blur(10px) brightness(0)" : "none"
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: isAwakeningPhase ? "blur(0px) brightness(1)" : (currentFragment.filter || "none")
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        // 0.3s para el susto de los ojos, 1.5s para la pesadilla/recuerdos
                        duration: isAwakeningPhase ? 0.3 : 1.5,
                        ease: "easeInOut"
                    }}
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                >
                    <img
                        src={currentFragment.image}
                        alt="Scene"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* 3. BURBUJAS (Con zIndex explícito para evitar que se escondan bajo las imágenes) */}
            {currentFragment.isDream && (
                <Box sx={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
                    <BubbleAnimation />
                </Box>
            )}

            {/* 4. DIÁLOGO (Independiente de la fase, aparece si hay texto) */}
            <AnimatePresence mode="wait">
                {currentFragment.text && (
                    <motion.div
                        key={`dialog-${currentFragment.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        // CORRECCIÓN VITAL: absolute + inset 0 para que DialogueBox no se colapse
                        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}
                    >
                        <DialogueBox
                            text={currentFragment.text}
                            speaker={currentFragment.speaker}
                            isThought={currentFragment.isThought}
                            variant={currentFragment.isDream ? "dream" : "normal"}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. FLASH FINAL DE IMPACTO */}
            {currentFragment.id === 16 && (
                <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ position: "absolute", inset: 0, backgroundColor: "white", zIndex: 10, pointerEvents: "none" }}
                />
            )}
        </Box>
    );
}
