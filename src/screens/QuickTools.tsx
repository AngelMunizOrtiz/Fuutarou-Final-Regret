import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FastForwardRoundedIcon from "@mui/icons-material/FastForwardRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Box, Button, Divider, IconButton, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageFlagPair, LanguagePicker } from "../components/LanguageControl";
import { MasterVolumeIcon, MasterVolumeSlider } from "../components/VolumeControl";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoBack } from "../hooks/useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../hooks/useQuerySaves";
import { useWheelActions } from "../hooks/useWheelActions";
import { getInitialGameLanguage, isGameLanguage } from "../i18n";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useAudioSettingsStore from "../stores/useAudioSettingsStore";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";
import useStepStore from "../stores/useStepStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import { saveGameToIndexDB } from "../utils/save-utility";
import { captureGameScreenshot } from "../utils/screenshot-utility";

type OpenPanel = "language" | "menu" | "timing" | "volume" | null;
type TimingPresetId = "slow" | "medium" | "fast";

type TimingPreset = {
    id: TimingPresetId;
    value: number;
};

const TEXT_SPEED_PRESETS: readonly TimingPreset[] = [
    { id: "slow", value: 45 },
    { id: "medium", value: 20 },
    { id: "fast", value: 5 },
];

const AUTO_DELAY_PRESETS: readonly TimingPreset[] = [
    { id: "slow", value: 4 },
    { id: "medium", value: 2 },
    { id: "fast", value: 1 },
];

const hudButtonSx = {
    minHeight: 40,
    height: 40,
    borderRadius: "8px",
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

const panelSx = {
    position: "absolute",
    top: 48,
    right: 0,
    width: "min(340px, calc(100cqw - 24px))",
    maxHeight: "calc(100cqh - 76px)",
    overflowY: "auto",
    p: 1.25,
    borderRadius: "8px",
    border: "1px solid rgba(244, 163, 125, 0.68)",
    color: "#fff8f1",
    backgroundColor: "rgba(31, 24, 34, 0.94)",
    boxShadow: "0 16px 38px rgba(20, 12, 24, 0.42), inset 0 1px rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(18px) saturate(145%)",
    pointerEvents: "auto",
};

function getTextSpeedPreset(delay: number): TimingPresetId {
    if (delay <= 8) return "fast";
    if (delay <= 30) return "medium";
    return "slow";
}

function getAutoDelayPreset(delay: number): TimingPresetId {
    if (delay <= 1) return "fast";
    if (delay <= 3) return "medium";
    return "slow";
}

export default function QuickTools() {
    const editOpenSettings = useSettingsScreenStore((state) => state.editOpen);
    const editOpenHistory = useHistoryScreenStore((state) => state.editOpen);
    const editOpenSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const hidden = useInterfaceStore((state) => state.hidden);
    const editHideInterface = useInterfaceStore((state) => state.editHidden);
    const skipEnabled = useSkipStore((state) => state.enabled);
    const editSkipEnabled = useSkipStore((state) => state.editEnabled);
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const autoEnabled = useAutoInfoStore((state) => state.enabled);
    const autoTime = useAutoInfoStore((state) => state.time);
    const editAutoEnabled = useAutoInfoStore((state) => state.editEnabled);
    const setAutoTime = useAutoInfoStore((state) => state.setTime);
    const masterVolume = useAudioSettingsStore((state) => state.volume);
    const typewriterDelay = useTypewriterStore((state) => state.delay);
    const setTypewriterDelay = useTypewriterStore((state) => state.setDelay);
    const nextStepLoading = useStepStore((state) => state.loading);
    const { data: lastSave = null } = useQueryLastSave();
    const { data: canGoBack = null } = useQueryCanGoBack();
    const { goBack } = useNarrationFunctions();
    const { t, i18n } = useTranslation(["ui"]);
    const activeLanguage = isGameLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : getInitialGameLanguage();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const hudRef = useRef<HTMLDivElement>(null);
    const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
    const [quickSaveInProgress, setQuickSaveInProgress] = useState(false);
    const [captureInProgress, setCaptureInProgress] = useState(false);
    useWheelActions();

    const hudVariants = useMemo(
        () =>
            hidden
                ? "motion-opacity-out-0 motion-translate-y-out-[-50%]"
                : "motion-opacity-in-0 motion-translate-y-in-[-50%]",
        [hidden],
    );

    useEffect(() => {
        if (!openPanel) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (hudRef.current && !hudRef.current.contains(event.target as Node)) {
                setOpenPanel(null);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpenPanel(null);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [openPanel]);

    const quickSave = useCallback(async () => {
        setQuickSaveInProgress(true);
        try {
            const save = await saveGameToIndexDB();
            queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
            queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
            enqueueSnackbar(t("success_save"), { variant: "success" });
        } catch {
            enqueueSnackbar(t("fail_save"), { variant: "error" });
        } finally {
            setQuickSaveInProgress(false);
            setOpenPanel(null);
        }
    }, [enqueueSnackbar, queryClient, t]);

    const takeScreenshot = useCallback(async () => {
        setCaptureInProgress(true);
        setOpenPanel(null);
        try {
            await captureGameScreenshot();
            enqueueSnackbar(t("screenshot_saved"), { variant: "success" });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t("screenshot_failed"), { variant: "error" });
        } finally {
            setCaptureInProgress(false);
        }
    }, [enqueueSnackbar, t]);

    const toggleAuto = () => {
        if (!autoEnabled && skipEnabled) setSkipEnabled(false);
        editAutoEnabled();
    };

    const toggleSkip = () => {
        if (!skipEnabled && autoEnabled) editAutoEnabled();
        editSkipEnabled();
    };

    return (
        <Box
            ref={hudRef}
            className={`vn-quick-tools ${hudVariants}`}
            sx={{
                position: "absolute",
                top: "clamp(8px, 1.1cqw, 16px)",
                right: "clamp(8px, 1.1cqw, 16px)",
                zIndex: 180,
                pointerEvents: hidden ? "none" : "auto",
            }}
        >
            <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                <Tooltip title={t("language")} placement="bottom">
                    <IconButton
                        aria-label={t("language")}
                        aria-expanded={openPanel === "language"}
                        onClick={() => setOpenPanel((current) => (current === "language" ? null : "language"))}
                        sx={hudButtonSx}
                    >
                        <LanguageFlagPair activeLanguage={activeLanguage} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("master_volume")} placement="bottom">
                    <IconButton
                        aria-label={t("master_volume")}
                        aria-expanded={openPanel === "volume"}
                        onClick={() => setOpenPanel((current) => (current === "volume" ? null : "volume"))}
                        sx={hudButtonSx}
                    >
                        <MasterVolumeIcon volume={masterVolume} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("auto_forward_time_restricted")} placement="bottom">
                    <Button
                        size="sm"
                        startDecorator={<HdrAutoIcon />}
                        aria-pressed={autoEnabled}
                        onClick={toggleAuto}
                        sx={{
                            ...hudButtonSx,
                            minWidth: "var(--quick-auto-width)",
                            px: 1,
                            backgroundColor: autoEnabled ? "rgba(184, 73, 86, 0.94)" : hudButtonSx.backgroundColor,
                            borderColor: autoEnabled ? "rgba(255, 197, 137, 0.96)" : "rgba(244, 163, 125, 0.72)",
                            "& .MuiButton-startDecorator": {
                                mr: "var(--quick-auto-decorator-margin)",
                            },
                        }}
                    >
                        <Box component="span" sx={{ display: "var(--quick-auto-label-display)" }}>
                            {t("auto_forward_time_restricted")}
                        </Box>
                    </Button>
                </Tooltip>
                <Tooltip title={t("playback_timing")} placement="bottom">
                    <IconButton
                        aria-label={t("playback_timing")}
                        aria-expanded={openPanel === "timing"}
                        onClick={() => setOpenPanel((current) => (current === "timing" ? null : "timing"))}
                        sx={hudButtonSx}
                    >
                        <TimerOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("game_menu")} placement="bottom">
                    <IconButton
                        aria-label={t("game_menu")}
                        aria-expanded={openPanel === "menu"}
                        onClick={() => setOpenPanel((current) => (current === "menu" ? null : "menu"))}
                        sx={hudButtonSx}
                    >
                        <MenuRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            {openPanel === "timing" && (
                <Sheet component="section" aria-label={t("playback_timing")} sx={panelSx}>
                    <Typography level="title-sm" sx={{ color: "#fff5eb", px: 0.5, pb: 1 }}>
                        {t("playback_timing")}
                    </Typography>
                    <TimingSegments
                        label={t("text_speed")}
                        selected={getTextSpeedPreset(typewriterDelay)}
                        presets={TEXT_SPEED_PRESETS}
                        onChange={setTypewriterDelay}
                    />
                    <Divider sx={{ my: 1.25, backgroundColor: "rgba(255, 201, 164, 0.18)" }} />
                    <TimingSegments
                        label={t("next_dialogue")}
                        selected={getAutoDelayPreset(autoTime)}
                        presets={AUTO_DELAY_PRESETS}
                        onChange={setAutoTime}
                    />
                </Sheet>
            )}

            {openPanel === "volume" && (
                <Sheet component="section" aria-label={t("master_volume")} sx={panelSx}>
                    <MasterVolumeSlider compact />
                </Sheet>
            )}

            {openPanel === "language" && (
                <Sheet component="section" aria-label={t("language")} sx={panelSx}>
                    <LanguagePicker compact onSelected={() => setOpenPanel(null)} />
                </Sheet>
            )}

            {openPanel === "menu" && (
                <Sheet component="section" aria-label={t("game_menu")} sx={panelSx}>
                    <Typography level="title-sm" sx={{ color: "#fff5eb", px: 0.5, pb: 1 }}>
                        {t("game_menu")}
                    </Typography>
                    <Box
                        role="menu"
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                            gap: 0.75,
                        }}
                    >
                        <MenuAction
                            icon={<ArrowBackRoundedIcon />}
                            label={t("back")}
                            disabled={!canGoBack || nextStepLoading}
                            onClick={() => {
                                setOpenPanel(null);
                                if (skipEnabled) setSkipEnabled(false);
                                void goBack();
                            }}
                        />
                        <MenuAction
                            icon={<HistoryRoundedIcon />}
                            label={t("history")}
                            onClick={() => {
                                setOpenPanel(null);
                                editOpenHistory();
                            }}
                        />
                        <MenuAction
                            icon={<FastForwardRoundedIcon />}
                            label={t("skip")}
                            selected={skipEnabled}
                            onClick={toggleSkip}
                        />
                        <MenuAction
                            icon={<FolderOpenRoundedIcon />}
                            label={`${t("save")} / ${t("load")}`}
                            onClick={() => {
                                setOpenPanel(null);
                                editOpenSaveScreen();
                            }}
                        />
                        <MenuAction
                            icon={<SaveAsRoundedIcon />}
                            label={t("quick_save")}
                            loading={quickSaveInProgress}
                            onClick={() => void quickSave()}
                        />
                        <MenuAction
                            icon={<RestoreRoundedIcon />}
                            label={t("load_last_save")}
                            disabled={!lastSave}
                            onClick={() => {
                                setOpenPanel(null);
                                if (lastSave) setOpenLoadAlert(lastSave);
                            }}
                        />
                        <MenuAction
                            icon={<PhotoCameraRoundedIcon />}
                            label={t("take_screenshot")}
                            loading={captureInProgress}
                            onClick={() => void takeScreenshot()}
                        />
                        <MenuAction
                            icon={<SettingsRoundedIcon />}
                            label={t("settings")}
                            onClick={() => {
                                setOpenPanel(null);
                                editOpenSettings();
                            }}
                        />
                        <MenuAction
                            icon={<VisibilityOffRoundedIcon />}
                            label={t("hide_ui")}
                            onClick={() => {
                                setOpenPanel(null);
                                editHideInterface();
                            }}
                        />
                    </Box>
                </Sheet>
            )}
        </Box>
    );
}

function TimingSegments({
    label,
    selected,
    presets,
    onChange,
}: {
    label: string;
    selected: TimingPresetId;
    presets: readonly TimingPreset[];
    onChange: (value: number) => void;
}) {
    const { t } = useTranslation(["ui"]);

    return (
        <Box>
            <Typography level="body-sm" sx={{ color: "rgba(255, 244, 235, 0.78)", px: 0.5, mb: 0.75 }}>
                {label}
            </Typography>
            <Box
                role="group"
                aria-label={label}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    overflow: "hidden",
                    border: "1px solid rgba(244, 163, 125, 0.42)",
                    borderRadius: "7px",
                }}
            >
                {presets.map((preset, index) => {
                    const isSelected = preset.id === selected;
                    return (
                        <Button
                            key={preset.id}
                            size="sm"
                            variant="plain"
                            aria-pressed={isSelected}
                            onClick={() => onChange(preset.value)}
                            sx={{
                                minWidth: 0,
                                borderRadius: 0,
                                borderLeft: index === 0 ? "none" : "1px solid rgba(244, 163, 125, 0.28)",
                                color: isSelected ? "#2e1e29" : "rgba(255, 246, 239, 0.82)",
                                backgroundColor: isSelected ? "#f3ad84" : "rgba(255, 255, 255, 0.035)",
                                "&:hover": {
                                    color: isSelected ? "#2e1e29" : "#fff8f1",
                                    backgroundColor: isSelected ? "#ffc092" : "rgba(243, 173, 132, 0.16)",
                                },
                            }}
                        >
                            {t(preset.id)}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}

function MenuAction({
    icon,
    label,
    selected = false,
    disabled = false,
    loading = false,
    onClick,
}: {
    icon: ReactNode;
    label: string;
    selected?: boolean;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            role="menuitem"
            size="sm"
            variant="plain"
            startDecorator={icon}
            disabled={disabled}
            loading={loading}
            onClick={onClick}
            sx={{
                minHeight: 44,
                minWidth: 0,
                justifyContent: "flex-start",
                borderRadius: "7px",
                border: "1px solid",
                borderColor: selected ? "rgba(255, 194, 139, 0.74)" : "rgba(255, 255, 255, 0.08)",
                color: selected ? "#fff4df" : "rgba(255, 248, 242, 0.86)",
                backgroundColor: selected ? "rgba(184, 73, 86, 0.7)" : "rgba(255, 255, 255, 0.035)",
                overflow: "hidden",
                "& .MuiButton-startDecorator": { color: selected ? "#ffd29b" : "#f3ad84" },
                "&:hover": {
                    color: "#fffaf5",
                    backgroundColor: selected ? "rgba(194, 79, 91, 0.82)" : "rgba(243, 173, 132, 0.14)",
                    borderColor: "rgba(244, 163, 125, 0.46)",
                },
            }}
        >
            <Typography
                level="body-sm"
                sx={{
                    color: "inherit",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </Typography>
        </Button>
    );
}
