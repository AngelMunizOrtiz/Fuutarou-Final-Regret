import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import ScreenRotationAltRoundedIcon from "@mui/icons-material/ScreenRotationAltRounded";
import { Box, Button, Typography } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

type LockableScreenOrientation = ScreenOrientation & {
    lock?: (orientation: "landscape") => Promise<void>;
};

function isTouchDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
}

function isPortraitViewport() {
    return window.matchMedia("(orientation: portrait)").matches;
}

function isStandaloneDisplayMode() {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches
    );
}

async function lockLandscapeOrientation() {
    const orientation = screen.orientation as LockableScreenOrientation | undefined;
    if (!orientation?.lock) return false;

    try {
        await orientation.lock("landscape");
        return true;
    } catch {
        return false;
    }
}

export default function LandscapeOrientationGuard() {
    const { t } = useTranslation(["ui"]);
    const [touchDevice, setTouchDevice] = useState(isTouchDevice);
    const [portrait, setPortrait] = useState(isPortraitViewport);
    const [requestingLandscape, setRequestingLandscape] = useState(false);

    useEffect(() => {
        const orientationQuery = window.matchMedia("(orientation: portrait)");
        const pointerQuery = window.matchMedia("(pointer: coarse)");
        const updateDeviceState = () => {
            setPortrait(orientationQuery.matches);
            setTouchDevice(navigator.maxTouchPoints > 0 || pointerQuery.matches);
        };

        orientationQuery.addEventListener("change", updateDeviceState);
        pointerQuery.addEventListener("change", updateDeviceState);
        screen.orientation?.addEventListener("change", updateDeviceState);
        window.addEventListener("resize", updateDeviceState);

        return () => {
            orientationQuery.removeEventListener("change", updateDeviceState);
            pointerQuery.removeEventListener("change", updateDeviceState);
            screen.orientation?.removeEventListener("change", updateDeviceState);
            window.removeEventListener("resize", updateDeviceState);
        };
    }, []);

    useEffect(() => {
        if (!touchDevice || (!isStandaloneDisplayMode() && !document.fullscreenElement)) return;
        void lockLandscapeOrientation();
    }, [touchDevice]);

    const requestLandscape = useCallback(async () => {
        setRequestingLandscape(true);
        try {
            if (!document.fullscreenElement && document.fullscreenEnabled) {
                await document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => undefined);
            }
            await lockLandscapeOrientation();
        } finally {
            setRequestingLandscape(false);
        }
    }, []);

    if (!touchDevice || !portrait) return null;

    return createPortal(
        <Box className="vn-landscape-guard" role="dialog" aria-modal="true" aria-labelledby="landscape-title">
            <Box className="vn-landscape-guard__card">
                <Box className="vn-landscape-guard__device" aria-hidden="true">
                    <ScreenRotationAltRoundedIcon />
                </Box>
                <Typography
                    id="landscape-title"
                    component="h1"
                    className="vn-landscape-guard__title"
                    sx={{
                        color: "#fff8f1",
                        fontFamily: '"MPLUSRounded", sans-serif',
                        fontSize: "clamp(1.45rem, 6vw, 2rem)",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        textAlign: "center",
                    }}
                >
                    {t("landscape_required_title")}
                </Typography>
                <Typography
                    className="vn-landscape-guard__description"
                    sx={{
                        color: "rgba(255, 248, 241, 0.8)",
                        fontFamily: '"MPLUSRounded", sans-serif',
                        fontSize: "clamp(0.94rem, 3.8vw, 1.06rem)",
                        lineHeight: 1.5,
                        textAlign: "center",
                    }}
                >
                    {t("landscape_required_description")}
                </Typography>
                <Button
                    size="lg"
                    startDecorator={<FullscreenRoundedIcon />}
                    loading={requestingLandscape}
                    onClick={() => void requestLandscape()}
                    className="vn-landscape-guard__button"
                >
                    {t("landscape_fullscreen_action")}
                </Button>
                <Typography
                    className="vn-landscape-guard__hint"
                    sx={{
                        color: "rgba(255, 236, 215, 0.62)",
                        fontFamily: '"MPLUSRounded", sans-serif',
                        fontSize: "0.78rem",
                        lineHeight: 1.5,
                        textAlign: "center",
                    }}
                >
                    {t("landscape_required_hint")}
                </Typography>
            </Box>
        </Box>,
        document.body,
    );
}
