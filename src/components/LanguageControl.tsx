import { Box, Button, IconButton, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    changeGameLanguage,
    getInitialGameLanguage,
    isGameLanguage,
    SUPPORTED_GAME_LANGUAGES,
    type GameLanguage,
} from "../i18n";
import { floatingControlButtonSx } from "./floatingControlStyles";

function FlagIcon({ language }: { language: GameLanguage }) {
    return (
        <Box
            component="svg"
            viewBox="0 0 60 36"
            aria-hidden="true"
            sx={{
                display: "block",
                width: 20,
                height: 14,
                overflow: "hidden",
                borderRadius: "2px",
                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.42), 0 2px 5px rgba(0, 0, 0, 0.26)",
            }}
        >
            {language === "es" ? (
                <>
                    <rect width="60" height="36" fill="#aa151b" />
                    <rect y="9" width="60" height="18" fill="#f1bf00" />
                    <rect x="18" y="14" width="5" height="9" rx="1" fill="#aa151b" opacity="0.9" />
                    <circle cx="20.5" cy="13" r="1.5" fill="#f8d46a" />
                </>
            ) : (
                <>
                    <rect width="60" height="36" fill="#012169" />
                    <path d="M0 0 60 36M60 0 0 36" stroke="#fff" strokeWidth="8" />
                    <path d="M0 0 60 36M60 0 0 36" stroke="#c8102e" strokeWidth="4" />
                    <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="12" />
                    <path d="M30 0v36M0 18h60" stroke="#c8102e" strokeWidth="7" />
                </>
            )}
        </Box>
    );
}

export function LanguageFlagPair({ activeLanguage }: { activeLanguage: GameLanguage }) {
    return (
        <Box aria-hidden="true" sx={{ position: "relative", width: 28, height: 24 }}>
            {SUPPORTED_GAME_LANGUAGES.map((language, index) => {
                const active = language.code === activeLanguage;
                return (
                    <Box
                        component="span"
                        key={language.code}
                        sx={{
                            position: "absolute",
                            top: index === 0 ? 0 : 7,
                            left: index === 0 ? 0 : 11,
                            zIndex: active ? 2 : 1,
                            display: "grid",
                            width: 18,
                            height: 15,
                            placeItems: "center",
                            opacity: active ? 1 : 0.64,
                            filter: active ? "none" : "saturate(0.72)",
                            transform: active ? "scale(1.08)" : "scale(0.94)",
                            boxShadow: active ? "0 2px 7px rgba(0, 0, 0, 0.34)" : "none",
                            transition: "opacity 160ms ease, transform 160ms ease, filter 160ms ease",
                        }}
                    >
                        <FlagIcon language={language.code} />
                    </Box>
                );
            })}
        </Box>
    );
}

export function LanguagePicker({
    compact = false,
    onSelected,
}: {
    compact?: boolean;
    onSelected?: () => void;
}) {
    const { t, i18n } = useTranslation(["ui"]);
    const activeLanguage = isGameLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : getInitialGameLanguage();
    const [changingTo, setChangingTo] = useState<GameLanguage | null>(null);

    const selectLanguage = async (language: GameLanguage) => {
        if (language === activeLanguage) {
            onSelected?.();
            return;
        }

        setChangingTo(language);
        try {
            await changeGameLanguage(language);
            onSelected?.();
        } finally {
            setChangingTo(null);
        }
    };

    return (
        <Box sx={{ display: "grid", gap: compact ? 0.75 : 1.1 }}>
            <Box>
                <Typography level={compact ? "body-sm" : "title-sm"} sx={{ color: "inherit" }}>
                    {t("language")}
                </Typography>
                <Typography level="body-xs" sx={{ mt: 0.2, color: "rgba(255, 244, 235, 0.66)" }}>
                    {t("language_change_hint")}
                </Typography>
            </Box>
            <Stack direction="row" spacing={0.75}>
                {SUPPORTED_GAME_LANGUAGES.map((language) => {
                    const selected = language.code === activeLanguage;
                    return (
                        <Button
                            key={language.code}
                            size="sm"
                            variant="plain"
                            aria-pressed={selected}
                            loading={changingTo === language.code}
                            onClick={() => void selectLanguage(language.code)}
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                justifyContent: "flex-start",
                                borderRadius: "7px",
                                border: "1px solid",
                                borderColor: selected
                                    ? "rgba(255, 194, 139, 0.82)"
                                    : "rgba(255, 255, 255, 0.1)",
                                color: selected ? "#2e1e29" : "rgba(255, 248, 242, 0.86)",
                                backgroundColor: selected ? "#f3ad84" : "rgba(255, 255, 255, 0.04)",
                                "&:hover": {
                                    color: selected ? "#2e1e29" : "#fff8f1",
                                    backgroundColor: selected ? "#ffc092" : "rgba(243, 173, 132, 0.16)",
                                },
                            }}
                            startDecorator={<FlagIcon language={language.code} />}
                        >
                            {language.label}
                        </Button>
                    );
                })}
            </Stack>
            {activeLanguage === "es" && (
                <Typography level="body-xs" sx={{ color: "rgba(255, 218, 171, 0.8)" }}>
                    {t("story_translation_status")}
                </Typography>
            )}
        </Box>
    );
}

export default function FloatingLanguageControl() {
    const { t, i18n } = useTranslation(["ui"]);
    const activeLanguage = isGameLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : getInitialGameLanguage();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [open]);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "absolute",
                top: "clamp(8px, 1.1cqw, 16px)",
                right: "clamp(58px, 4.6cqw, 66px)",
                zIndex: 9500,
            }}
        >
            <Tooltip title={t("language")} placement="bottom">
                <IconButton
                    aria-label={t("language")}
                    aria-expanded={open}
                    onClick={() => setOpen((current) => !current)}
                    sx={floatingControlButtonSx}
                >
                    <LanguageFlagPair activeLanguage={activeLanguage} />
                </IconButton>
            </Tooltip>
            {open && (
                <Sheet
                    component="section"
                    aria-label={t("language")}
                    sx={{
                        position: "absolute",
                        top: 50,
                        right: 0,
                        width: "min(286px, calc(100cqw - 24px))",
                        p: 1.5,
                        color: "#fff8f1",
                        borderRadius: "9px",
                        border: "1px solid rgba(244, 163, 125, 0.68)",
                        backgroundColor: "rgba(31, 24, 34, 0.94)",
                        boxShadow: "0 16px 38px rgba(20, 12, 24, 0.42)",
                        backdropFilter: "blur(18px) saturate(145%)",
                    }}
                >
                    <LanguagePicker compact onSelected={() => setOpen(false)} />
                </Sheet>
            )}
        </Box>
    );
}
