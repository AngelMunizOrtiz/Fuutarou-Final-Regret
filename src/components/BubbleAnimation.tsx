// src/components/BubbleAnimation.tsx
import { Box } from "@mui/joy";
import { motion, Variants } from "motion/react";

interface BubbleConfig {
    id: string;
    src: string;
    x: string;
    duration: number;
    xRange: number[];
    rotationRange: number[];
}

const bubbleVariants: Variants = {
    animate: (custom: { duration: number; xRange: number[]; rotationRange: number[] }) => ({
        y: [0, -150, 50, -250, 0],
        x: custom.xRange,
        rotate: custom.rotationRange,
        opacity: [0.7, 1, 0.8, 1, 0.7],
        scale: [1.1, 1.25, 1.15, 1.3, 1.1],
        filter: [
            "blur(2px) brightness(1.8) contrast(1.5) drop-shadow(0px 0px 15px #fff)",
            "blur(1px) brightness(2.5) contrast(1.8) drop-shadow(0px 0px 35px #fff)",
            "blur(2px) brightness(2.0) contrast(1.5) drop-shadow(0px 0px 20px #fff)",
        ],
        transition: {
            duration: custom.duration,
            repeat: Infinity,
            ease: "linear",
        }
    })
};

export default function BubbleAnimation() {
    const bubbles: BubbleConfig[] = [
        {
            id: 'white1',
            src: '/images/vfx/bubble_white_1.webp',
            x: '-20%',
            duration: 25,
            xRange: [-60, 60, -20, 40, -60],
            rotationRange: [0, 10, -10, 5, 0]
        },
        {
            id: 'white2',
            src: '/images/vfx/bubble_white_2.webp',
            x: '10%',
            duration: 35,
            xRange: [40, -40, 20, -20, 40],
            rotationRange: [0, -15, 15, -5, 0]
        }
    ];

    return (
        <Box sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 5,
        }}>
            {bubbles.map((b) => (
                <motion.img
                    key={b.id}
                    src={b.src}
                    custom={{
                        duration: b.duration,
                        xRange: b.xRange,
                        rotationRange: b.rotationRange
                    }}
                    variants={bubbleVariants}
                    animate="animate"
                    style={{
                        position: "absolute",
                        left: b.x,
                        top: "10%",
                        width: "120cqw",
                        height: "auto",
                        maxWidth: "none",
                        mixBlendMode: "screen",
                        // Mantenemos un contraste base alto
                        filter: "brightness(1.5) contrast(1.2)",
                    }}
                />
            ))}
        </Box>
    );
}
