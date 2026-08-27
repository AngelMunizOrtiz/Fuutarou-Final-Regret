// src/components/BubbleAnimation.tsx
import { Box } from "@mui/joy";
import { motion, Variants } from "motion/react";
import { performanceProfile } from "../utils/performance-profile";

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

// Android keeps the dream atmosphere with one transform/opacity-only bubble.
// Filter interpolation and two oversized blend-mode layers are much more
// expensive in a WebView than the movement itself.
const liteBubbleVariants: Variants = {
    animate: (custom: { duration: number; xRange: number[]; rotationRange: number[] }) => ({
        y: [0, -90, 8, -150, 0],
        x: custom.xRange,
        rotate: custom.rotationRange,
        opacity: [0.12, 0.46, 0.26, 0.5, 0.12],
        scale: [0.9, 1.04, 0.96, 1.08, 0.9],
        transition: {
            duration: custom.duration,
            repeat: Infinity,
            ease: "linear",
        },
    }),
};

export default function BubbleAnimation() {
    const bubbles: BubbleConfig[] = performanceProfile.lite
        ? [
              {
                  id: "white-lite",
                  src: "/images/vfx/bubble_white_1.webp",
                  x: "-8%",
                  duration: 14,
                  xRange: [-24, 28, -12, 20, -24],
                  rotationRange: [0, 4, -3, 2, 0],
              },
          ]
        : [
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
                variants={performanceProfile.lite ? liteBubbleVariants : bubbleVariants}
                animate="animate"
                    style={{
                        position: "absolute",
                        left: b.x,
                        top: "10%",
                        width: performanceProfile.lite ? "76cqw" : "120cqw",
                        height: "auto",
                        maxWidth: "none",
                        mixBlendMode: performanceProfile.lite ? "normal" : "screen",
                        // Keep the mobile layer transform-only; desktop keeps
                        // the brighter filtered treatment.
                        filter: performanceProfile.lite ? "none" : "brightness(1.5) contrast(1.2)",
                    }}
                />
            ))}
        </Box>
    );
}
