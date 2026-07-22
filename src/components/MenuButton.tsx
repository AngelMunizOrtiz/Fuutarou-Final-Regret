import { Button, ButtonProps, ButtonTypeMap } from "@mui/joy";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface MenuButtonProps
    extends ButtonProps<
        ButtonTypeMap["defaultComponent"],
        {
            component?: React.ElementType;
        }
    > {
    transitionDelay?: number;
    children: string;
}

const sakuraPetals = [
    { left: "-8%", top: "12%", color: "#ffd0dc", rotate: -28, x: -18, y: -18, delay: 0 },
    { left: "8%", top: "-16%", color: "#fff1f4", rotate: 24, x: 10, y: -24, delay: 0.04 },
    { left: "25%", top: "78%", color: "#f6b3cc", rotate: -54, x: -4, y: 22, delay: 0.08 },
    { left: "43%", top: "-12%", color: "#ffe0b8", rotate: 38, x: 14, y: -22, delay: 0.02 },
    { left: "62%", top: "74%", color: "#e9d3ff", rotate: -18, x: 16, y: 18, delay: 0.1 },
    { left: "79%", top: "4%", color: "#ffc0d4", rotate: 50, x: 22, y: -16, delay: 0.06 },
    { left: "96%", top: "48%", color: "#fff7df", rotate: -38, x: 26, y: 6, delay: 0.12 },
    { left: "70%", top: "-22%", color: "#ffb7c8", rotate: 12, x: 10, y: -30, delay: 0.16 },
    { left: "12%", top: "52%", color: "#fbd6ef", rotate: 68, x: -22, y: 10, delay: 0.14 },
    { left: "40%", top: "38%", color: "#ffe9f0", rotate: -8, x: 3, y: -14, delay: 0.18 },
];

export default function MenuButton(props: MenuButtonProps) {
    const { sx, transitionDelay, children, disabled, ...rest } = props;
    const [isPreselected, setIsPreselected] = useState(false);

    const letterVariants = {
        initial: {
            opacity: isPreselected ? 0 : 1,
            y: isPreselected ? 4 : 0,
            filter: isPreselected ? "blur(2px)" : "blur(0px)",
            clipPath: isPreselected ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)",
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0% 0 0)",
        }
    };

    return (
        <Button
            variant="plain"
            color="neutral"
            size='sm'
            onMouseEnter={() => !disabled && setIsPreselected(true)}
            onMouseLeave={() => setIsPreselected(false)}
            onFocus={() => !disabled && setIsPreselected(true)}
            onBlur={() => setIsPreselected(false)}
            disabled={disabled}
            sx={{
                '&.Mui-disabled': { backgroundColor: 'transparent !important' },
                fontSize: { xs: "0.75rem", sm: "0.75rem", md: "1rem", lg: "1.25rem", xl: "1.5rem" },
                zIndex: 1,
                overflow: "visible",
                "& .MuiButton-startDecorator": {
                    position: "relative",
                    zIndex: 2,
                },
                ...sx,
            }}
            component={motion.button}
            {...rest}
        >
            <AnimatePresence>
                {isPreselected && (
                    <motion.span
                        key='menu-button-preselected'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scaleX: 0.5 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0.5 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                                position: "absolute",
                                left: -16,
                                right: -22,
                                top: "18%",
                                bottom: "18%",
                                borderRadius: 999,
                                background:
                                    "radial-gradient(circle at 35% 50%, rgba(205,232,255,0.76), rgba(255,204,229,0.3) 44%, rgba(255,204,91,0) 74%)",
                                filter: "blur(7px)",
                                pointerEvents: "none",
                                transformOrigin: "left center",
                                zIndex: -2,
                            }}
                        />
                        <svg
                            style={{
                                position: 'absolute',
                                inset: "-8px -18px",
                                width: 'calc(100% + 36px)',
                                height: 'calc(100% + 16px)',
                                pointerEvents: 'none',
                                zIndex: -1,
                            }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <motion.path
                                d="M 5,50 C 5,20 20,5 50,5 C 80,5 95,20 95,50 C 95,80 80,95 50,95 C 20,95 5,80 5,50"
                                fill="transparent"
                                stroke="rgba(73, 129, 184, 0.86)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.75, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 9,56 C 18,88 78,92 91,54"
                                fill="transparent"
                                stroke="rgba(154, 190, 219, 0.72)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.58, delay: 0.12, ease: "easeInOut" }}
                            />
                        </svg>

                        {sakuraPetals.map((petal, index) => (
                            <motion.span
                                key={`${petal.left}-${petal.top}`}
                                initial={{
                                    opacity: 0,
                                    x: 0,
                                    y: 0,
                                    rotate: petal.rotate,
                                    scale: 0.45,
                                }}
                                animate={{
                                    opacity: [0, 1, 0.88],
                                    x: petal.x,
                                    y: petal.y,
                                    rotate: petal.rotate + (index % 2 === 0 ? 42 : -46),
                                    scale: [0.55, 1, 0.92],
                                }}
                                exit={{
                                    opacity: 0,
                                    x: petal.x * 1.25,
                                    y: petal.y + 14,
                                    rotate: petal.rotate + 70,
                                    scale: 0.35,
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: petal.delay,
                                    ease: "easeOut",
                                }}
                                style={{
                                    position: "absolute",
                                    left: petal.left,
                                    top: petal.top,
                                    width: index % 3 === 0 ? 12 : 9,
                                    height: index % 3 === 0 ? 17 : 14,
                                    backgroundColor: petal.color,
                                    borderRadius: "80% 12% 72% 18%",
                                    boxShadow: `0 0 8px ${petal.color}`,
                                    transformOrigin: "65% 80%",
                                    pointerEvents: "none",
                                }}
                            />
                        ))}
                    </motion.span>
                )}
            </AnimatePresence>

            <motion.span
                key={isPreselected ? "hover" : "normal"}
                initial="initial"
                animate="animate"
                transition={{
                    staggerChildren: isPreselected ? 0.055 : 0.015,
                    delayChildren: isPreselected ? 0.08 : 0,
                }}
                style={{ display: 'inline-block', position: 'relative', zIndex: 2 }}
            >
                {children.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        variants={letterVariants}
                        transition={{ duration: isPreselected ? 0.32 : 0.16, ease: "easeOut" }}
                        style={{ display: "inline-block" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.span>
        </Button>
    );
}
