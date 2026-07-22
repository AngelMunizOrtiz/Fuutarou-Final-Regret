// src/screens/DreamSequence.tsx
import { Box, Typography } from "@mui/joy";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BubbleAnimation from "../components/BubbleAnimation";
import { NARRATION_ROUTE } from "../constans";
import { fuutarouDream } from "../data/dreamSequence";

export default function DreamSequence() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const currentFragment = fuutarouDream[currentIndex];

    const advance = () => {
        if (currentIndex < fuutarouDream.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            navigate(NARRATION_ROUTE);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                advance();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex]);

    if (!currentFragment) return null;

    const isThought = currentFragment.isThought;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                backgroundColor: "black",
                cursor: "pointer"
            }}
        >
            {/* 1. CAPA DE CLIC GLOBAL */}
            <Box
                onClick={(e) => {
                    e.stopPropagation();
                    advance();
                }}
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: "transparent"
                }}
            />

            {/* 2. CAPA DE IMÁGENES DE FONDO */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentFragment.image}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: currentFragment.filter || "none"
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                >
                    {currentFragment.image !== "black_screen" && (
                        <img
                            src={currentFragment.image}
                            alt="Dream Scene"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* 3. BURBUJAS */}
            {currentFragment.image !== "black_screen" && (
                <BubbleAnimation />
            )}

            {/* 4. INTERFAZ DE DIÁLOGO (zIndex 100) */}
            <AnimatePresence mode="wait">
                {currentFragment.text && (
                    <Box
                        key={`ui-${currentFragment.id}`}
                        component={motion.div}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        sx={{
                            position: "absolute",
                            bottom: "-20px",
                            left: 0,
                            right: 0,
                            height: "380px", // Aumentado un poco para dar aire al nombre arriba
                            zIndex: 100,
                            pointerEvents: "none"
                        }}
                    >
                        {/* LIENZO DE HISTORIA (Abajo y Centrado) */}
                        <Box sx={{
                            position: "absolute",
                            bottom: "20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100vw",
                            maxWidth: "1920px",
                            height: "300px",
                            backgroundImage: "url(/images/ui/dialog_box.webp)",
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            px: { xs: 8, md: 25 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            filter: 'brightness(0.9) contrast(1.3) opacity(0.82)',
                        }}>
                            <Typography sx={{
                                fontFamily: "'ConteScript', cursive",
                                fontSize: "2.4rem",
                                lineHeight: 1.2,
                                fontStyle: isThought ? "italic" : "normal",
                                color: isThought ? "rgba(60,60,60,0.8)" : "black",
                                textAlign: "center",
                                maxWidth: "1300px"
                            }}>
                                {currentFragment.text}
                            </Typography>
                        </Box>

                        {/* LIENZO DE NOMBRE (Superpuesto - Más a la izquierda y más arriba) */}
                        {currentFragment.speaker && (
                            <Box sx={{
                                position: "absolute",
                                left: "3%", // Movido más a la izquierda (antes 15%)
                                bottom: "262px", // Subido más (antes 240px) para que quede sobre la línea
                                width: "480px",
                                height: "90px",
                                backgroundImage: "url(/images/ui/name_box.webp)",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 110,
                                filter: 'brightness(0.9) contrast(1.3)',
                            }}>
                                <Typography sx={{
                                    fontFamily: "'ConteScript', cursive",
                                    fontSize: "2.1rem",
                                    color: "rgba(0,0,0,0.9)",
                                    mt: -1
                                }}>
                                    {isThought ? "??" : currentFragment.speaker}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </AnimatePresence>
        </Box>
    );
}