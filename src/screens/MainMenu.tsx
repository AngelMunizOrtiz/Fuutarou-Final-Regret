import { canvas, Game } from "@drincs/pixi-vn";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Box } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import MenuButton from "../components/MenuButton";
import { GALLERY_ROUTE, INTRO_ROUTE } from "../constans";
import useGameProps from "../hooks/useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../hooks/useQueryInterface";
import useQueryLastSave from "../hooks/useQueryLastSave";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useAudioSettingsStore from "../stores/useAudioSettingsStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import { releaseStoryAssets } from "../utils/assets-utility";
import { preloadImages } from "../utils/preload-utility";
import { loadSave } from "../utils/save-utility";
import { runViewTransition } from "../utils/view-transition";
import { performanceProfile } from "../utils/performance-profile";
import LoadingScreen from "./LoadingScreen";

const OPENING_SCENE_ASSETS = [
    "/images/bg_title.webp",
    "/images/memories/frame1.webp",
    "/images/memories/frame2.webp",
] as const;

export default function MainMenu() {
    const setOpenSettings = useSettingsScreenStore((state) => state.setOpen);
    const editHideInterface = useInterfaceStore((state) => state.setHidden);
    const editSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const gameProps = useGameProps();
    const { uiTransition: t, navigate, notify } = gameProps;
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [isOpeningGallery, setIsOpeningGallery] = useState(false);
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const masterVolume = useAudioSettingsStore((state) => state.volume);

    const playRandomSfx = () => {
        if (masterVolume <= 0) return;

        const randomIndex = Math.floor(Math.random() * 6) + 1;
        const sfx = new Audio(`/audio/sfx_menu_button/${randomIndex}.mp3`);
        sfx.volume = 0.5 * masterVolume;
        const releaseSfx = () => {
            sfx.removeAttribute("src");
            sfx.load();
        };
        sfx.addEventListener("ended", releaseSfx, { once: true });
        sfx.play().catch(releaseSfx);
    };

    const openGallery = () => {
        if (isOpeningGallery) return;

        playRandomSfx();
        setIsOpeningGallery(true);
        runViewTransition(() => navigate(GALLERY_ROUTE));
    };

    const closeGame = async () => {
        playRandomSfx();
        const currentWindow = getCurrentWindow();

        try {
            await currentWindow.close();
        } catch (closeError) {
            console.warn("Unable to close the Tauri window gracefully; forcing shutdown.", closeError);

            try {
                await currentWindow.destroy();
            } catch (destroyError) {
                console.warn("Unable to destroy the Tauri window.", destroyError);
                window.close();
            }
        }
    };

    useEffect(() => {
        editHideInterface(false);
        void releaseStoryAssets();

        const music = new Audio();
        music.src = performanceProfile.menuAudioSrc;
        music.preload = "metadata";
        music.loop = true;
        music.volume = 0.4 * useAudioSettingsStore.getState().volume;
        musicRef.current = music;
        void music.play().catch(() => undefined);

        return () => {
            music.pause();
            music.removeAttribute("src");
            music.load();
            musicRef.current = null;
            canvas.removeAll();
        };
    }, [editHideInterface]);

    useEffect(() => {
        if (musicRef.current) musicRef.current.volume = 0.4 * masterVolume;
    }, [masterVolume]);

    const stickerButtonStyle = (filter = "none", rotation = "0deg") => ({
        "--sticker-filter": filter,
        "--sticker-rotate": rotation,
        width: { xs: "218px", sm: "235px", md: "252px", lg: "270px" },
        minWidth: { xs: "218px", sm: "235px", md: "252px", lg: "270px" },
        height: { xs: "42px", sm: "46px", md: "50px", lg: "54px" },
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: "'MPLUSRounded', sans-serif",
        color: '#523154',
        fontSize: { xs: "0.8rem", sm: "0.88rem", md: "0.98rem", lg: "1.06rem" },
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: "0",
        padding: { xs: "0 24px 1px 36px", md: "0 28px 1px 42px" },
        transition: 'all 0.3s ease',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: "center",
        gap: { xs: 0.8, md: 1 },
        overflow: 'visible',
        textShadow: `
            0 1px 0 rgba(255,255,255,0.8),
            0 2px 4px rgba(76, 43, 87, 0.22)
        `,
        "&::before": {
            content: '""',
            position: "absolute",
            inset: { xs: "-9px -20px", md: "-11px -24px" },
            zIndex: 0,
            backgroundImage: "url(/images/ui/menu_sticker_base.webp)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            filter: "var(--sticker-filter)",
            transform: "rotate(var(--sticker-rotate))",
            transformOrigin: "center",
            transition: "filter 0.28s ease, transform 0.28s ease, opacity 0.28s ease",
            opacity: 0.96,
        },
        "& svg": {
            fontSize: { xs: "1.05rem", md: "1.24rem" },
            color: "rgba(63, 42, 83, 0.9)",
            filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.8))",
        },

        '&:disabled, &.Mui-disabled': {
            backgroundColor: 'transparent !important',
            opacity: 0.7,
            color: 'rgba(92, 83, 103, 0.7) !important',
            cursor: 'not-allowed',
            filter: 'grayscale(0.25)',
        },

        '&:hover:not(:disabled)': {
            backgroundColor: 'transparent',
            color: '#6e2f74',
            transform: 'translateX(9px) rotate(-1deg)',
            textShadow: `
                0 1px 0 rgba(255,255,255,0.92),
                0 0 8px rgba(255, 238, 171, 0.9),
                0 0 18px rgba(255, 145, 188, 0.52),
                0 0 26px rgba(169, 126, 255, 0.36)
            `,
            "&::before": {
                filter: "var(--sticker-filter) brightness(1.07) saturate(1.14)",
                transform: "rotate(calc(var(--sticker-rotate) - 0.7deg)) scale(1.035)",
                opacity: 1,
            },
        },

        '&:focus-visible': {
            outline: 'none',
            color: '#6e2f74',
            transform: 'translateX(9px) rotate(-1deg)',
            textShadow: '0 0 8px rgba(255, 238, 171, 0.9), 0 0 18px rgba(255, 145, 188, 0.52), 0 0 26px rgba(169, 126, 255, 0.36)',
        }
    });

    const menuIconStyle = { fontSize: "inherit" };

    return (
        <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "black" }}>

            {/* Android uses the poster directly so video decoding does not
                contend with Pixi for GPU time. Desktop keeps the animation. */}
            {performanceProfile.menuVideoEnabled ? (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload='metadata'
                    disablePictureInPicture
                    poster="/images/bg_title.webp"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={performanceProfile.menuVideoSrc} type="video/mp4" />
                </video>
            ) : (
                <img
                    src="/images/bg_title.webp"
                    alt=""
                    aria-hidden
                    decoding='async'
                    fetchPriority='high'
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    opacity: performanceProfile.lite ? 0.22 : 0.58,
                    backgroundImage: `
                        linear-gradient(45deg, rgba(255, 188, 214, 0.24) 25%, transparent 25%, transparent 75%, rgba(255, 188, 214, 0.24) 75%),
                        linear-gradient(45deg, rgba(185, 229, 245, 0.18) 25%, transparent 25%, transparent 75%, rgba(185, 229, 245, 0.18) 75%),
                        repeating-linear-gradient(-45deg, rgba(255, 245, 194, 0.16) 0 2px, transparent 2px 24px),
                        linear-gradient(135deg, rgba(255, 219, 232, 0.22), rgba(207, 242, 225, 0.14) 45%, rgba(221, 209, 255, 0.16))
                    `,
                    backgroundSize: "92px 92px, 92px 92px, 52px 52px, 100% 100%",
                    backgroundPosition: "0 0, 46px 46px, 0 0, 0 0",
                    mixBlendMode: performanceProfile.lite ? "normal" : "screen",
                }}
            />

            <Box
                component={motion.div}
                initial={{ opacity: 0, y: performanceProfile.lite ? -6 : -12 }}
                animate={{ opacity: performanceProfile.lite ? 0.34 : 0.72, y: 0 }}
                transition={{
                    delay: 0.45,
                    duration: performanceProfile.lite ? 0.55 : 1.2,
                    ease: "easeOut",
                }}
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    backgroundImage: `
                        repeating-linear-gradient(90deg, transparent 0 76px, rgba(255, 255, 255, 0.2) 76px 78px),
                        repeating-linear-gradient(0deg, transparent 0 76px, rgba(255, 214, 230, 0.16) 76px 78px)
                    `,
                    maskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
                }}
            />

            {/* 2. CONTENEDOR PRINCIPAL */}
            <Box
                component={motion.div}
                initial={performanceProfile.reducedMotion ? false : { x: -800 }}
                animate={{ x: 0 }}
                transition={{ duration: performanceProfile.reducedMotion ? 0 : 0.8, ease: "easeOut" }}
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <img src="/images/ui/Cajamenu.webp" style={{ height: "100%", width: "auto", display: "block" }} />

                {/* 3. EL CUADERNO */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "72%",
                        maxWidth: "557px",
                        zIndex: 2,
                    }}
                >
                    <img src="/images/ui/cuaderno_menu_v2.webp" style={{ width: "100%", height: "auto" }} />

                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.05, duration: 0.55, ease: "easeOut" }}
                        sx={{
                            position: "absolute",
                            top: "6.4%",
                            left: "19.5%",
                            right: "13.5%",
                            height: "7.8%",
                            zIndex: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <Box
                            component='span'
                            sx={{
                                color: "#61436d",
                                fontFamily: "'MPLUSRounded', sans-serif",
                                fontSize: { xs: "0.76rem", sm: "0.9rem", md: "1.02rem" },
                                fontWeight: 900,
                                letterSpacing: "0.12em",
                                textAlign: "center",
                                textShadow:
                                    "0 2px 0 rgba(255,255,255,0.9), 0 6px 10px rgba(112,58,111,0.18), 0 0 12px rgba(255,209,119,0.28)",
                            }}
                        >
                            {t("game_select_mode")}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            inset: "7% 8% 8% 9%",
                            zIndex: 2,
                            pointerEvents: "none",
                            opacity: 0.28,
                            borderRadius: "18px",
                            backgroundImage: `
                                linear-gradient(45deg, rgba(255, 174, 202, 0.34) 25%, transparent 25%, transparent 75%, rgba(255, 174, 202, 0.34) 75%),
                                linear-gradient(45deg, rgba(185, 229, 245, 0.26) 25%, transparent 25%, transparent 75%, rgba(185, 229, 245, 0.26) 75%),
                                repeating-linear-gradient(-45deg, rgba(196, 232, 203, 0.28) 0 1px, transparent 1px 18px)
                            `,
                            backgroundSize: "42px 42px, 42px 42px, 28px 28px",
                            backgroundPosition: "0 0, 21px 21px, 0 0",
                            mixBlendMode: "multiply",
                        }}
                    />

                    {/* 4. BOTONES (Alineados al inicio de la hoja) */}
                    <Stack
                        spacing={0.5}
                        sx={{
                            position: "absolute",
                            top: "17.6%",
                            left: "17.2%",
                            width: "75%",
                            alignItems: "flex-start",
                            zIndex: 3,
                        }}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(0deg) saturate(1.08)", "-1.1deg")}
                            startDecorator={<AutoStoriesRoundedIcon sx={menuIconStyle} />}
                            onClick={() => {
                                playRandomSfx();
                                if (!lastSave) return;
                                setLoadingMessage(t("recovering_save"));
                                loadSave(lastSave, navigate)
                                    .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                                    .catch(() => notify(t("load_error"), { variant: "error" }))
                                    .finally(() => setLoadingMessage(null));
                            }}
                            disabled={isLoading || !lastSave || Boolean(loadingMessage)}
                        >
                            {t("continue")}
                        </MenuButton>

                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(320deg) saturate(1.08)", "0.8deg")}
                            startDecorator={<PlayArrowRoundedIcon sx={menuIconStyle} />}
                            onClick={async () => {
                                playRandomSfx();
                                setLoadingMessage(t("loading_prologue"));
                                try {
                                    await preloadImages(OPENING_SCENE_ASSETS);
                                    Game.clear();
                                    canvas.removeAll();
                                    navigate(`${INTRO_ROUTE}?returnLabel=start&mode=call&reset=1`);
                                } catch (error) {
                                    console.error(error);
                                    notify(t("prologue_assets_error"), { variant: "error" });
                                    setLoadingMessage(null);
                                }
                            }}
                        >
                            {t("start")}
                        </MenuButton>

                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(180deg) saturate(1.05) brightness(1.02)", "-0.4deg")}
                            startDecorator={<FolderOpenRoundedIcon sx={menuIconStyle} />}
                            onClick={() => { playRandomSfx(); editSaveScreen(); }}
                        >
                            {t("load")}
                        </MenuButton>

                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(48deg) saturate(1.12) brightness(1.03)", "1deg")}
                            startDecorator={<PhotoLibraryRoundedIcon sx={menuIconStyle} />}
                            onClick={openGallery}
                        >
                            {t("gallery")}
                        </MenuButton>

                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(250deg) saturate(1.1)", "-0.8deg")}
                            startDecorator={<SettingsRoundedIcon sx={menuIconStyle} />}
                            onClick={() => { playRandomSfx(); setOpenSettings(true); }}
                        >
                            {t("settings")}
                        </MenuButton>

                        <MenuButton
                            sx={stickerButtonStyle("hue-rotate(78deg) saturate(1.12)", "0.6deg")}
                            startDecorator={<ExitToAppRoundedIcon sx={menuIconStyle} />}
                            onClick={closeGame}
                        >
                            {t("quit")}
                        </MenuButton>
                    </Stack>
                </Box>
            </Box>

            {loadingMessage && <LoadingScreen label={loadingMessage} />}
        </Box>
    );
}
