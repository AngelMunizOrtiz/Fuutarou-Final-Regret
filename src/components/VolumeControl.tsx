import VolumeDownRoundedIcon from "@mui/icons-material/VolumeDownRounded";
import VolumeMuteRoundedIcon from "@mui/icons-material/VolumeMuteRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { Box, IconButton, Sheet, Slider, Tooltip, Typography } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import useAudioSettingsStore from "../stores/useAudioSettingsStore";

const floatingButtonSx = {
    width: 42,
    height: 42,
    borderRadius: "9px",
    border: "1px solid rgba(244, 163, 125, 0.72)",
    color: "#fff8f1",
    backgroundColor: "rgba(34, 27, 37, 0.82)",
    boxShadow: "0 6px 18px rgba(24, 15, 29, 0.28), inset 0 1px rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(12px) saturate(135%)",
    "&:hover": {
        backgroundColor: "rgba(73, 46, 61, 0.94)",
        borderColor: "rgba(255, 188, 139, 0.92)",
    },
};

export function MasterVolumeIcon({ volume }: { volume: number }) {
    if (volume <= 0) return <VolumeOffRoundedIcon />;
    if (volume < 0.4) return <VolumeMuteRoundedIcon />;
    if (volume < 0.72) return <VolumeDownRoundedIcon />;
    return <VolumeUpRoundedIcon />;
}

export function MasterVolumeSlider({ compact = false }: { compact?: boolean }) {
    const volume = useAudioSettingsStore((state) => state.volume);
    const setVolume = useAudioSettingsStore((state) => state.setVolume);
    const toggleMuted = useAudioSettingsStore((state) => state.toggleMuted);
    const percentage = Math.round(volume * 100);

    return (
        <Box sx={{ display: "grid", gap: compact ? 0.75 : 1.1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography level={compact ? "body-sm" : "title-sm"} sx={{ color: "inherit" }}>
                    Volumen general
                </Typography>
                <Typography level="body-xs" sx={{ color: "rgba(255, 244, 235, 0.72)", minWidth: 36, textAlign: "right" }}>
                    {percentage}%
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    size="sm"
                    variant="plain"
                    aria-label={volume > 0 ? "Silenciar" : "Activar sonido"}
                    onClick={toggleMuted}
                    sx={{ color: "#f3ad84", flex: "0 0 auto" }}
                >
                    <MasterVolumeIcon volume={volume} />
                </IconButton>
                <Slider
                    value={percentage}
                    min={0}
                    max={100}
                    step={1}
                    aria-label="Volumen general"
                    onChange={(_, value) => setVolume((value as number) / 100)}
                    sx={{
                        color: "#f3ad84",
                        "& .MuiSlider-track": { background: "linear-gradient(90deg, #f08db8, #f3ce62)" },
                    }}
                />
            </Box>
        </Box>
    );
}

export default function FloatingVolumeControl() {
    const volume = useAudioSettingsStore((state) => state.volume);
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
            sx={{ position: "fixed", top: { xs: 10, sm: 16 }, right: { xs: 10, sm: 16 }, zIndex: 9500, pointerEvents: "auto" }}
        >
            <Tooltip title="Volumen general" placement="bottom">
                <IconButton
                    aria-label="Volumen general"
                    aria-expanded={open}
                    onClick={() => setOpen((current) => !current)}
                    sx={floatingButtonSx}
                >
                    <MasterVolumeIcon volume={volume} />
                </IconButton>
            </Tooltip>
            {open && (
                <Sheet
                    component="section"
                    aria-label="Volumen general"
                    sx={{
                        position: "absolute",
                        top: 50,
                        right: 0,
                        width: 240,
                        p: 1.5,
                        color: "#fff8f1",
                        borderRadius: "9px",
                        border: "1px solid rgba(244, 163, 125, 0.68)",
                        backgroundColor: "rgba(31, 24, 34, 0.94)",
                        boxShadow: "0 16px 38px rgba(20, 12, 24, 0.42)",
                        backdropFilter: "blur(18px) saturate(145%)",
                    }}
                >
                    <MasterVolumeSlider compact />
                </Sheet>
            )}
        </Box>
    );
}

