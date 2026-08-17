type NavigatorWithDeviceMemory = Navigator & {
    deviceMemory?: number;
};

type WindowWithTauri = Window & {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
};

const searchParams = new URLSearchParams(window.location.search);
const requestedQuality = searchParams.get("quality");
const userAgent = navigator.userAgent.toLowerCase();
const navigatorWithMemory = navigator as NavigatorWithDeviceMemory;
const windowWithTauri = window as WindowWithTauri;

const isAndroid = userAgent.includes("android");
const isTauriRuntime = Boolean(windowWithTauri.__TAURI_INTERNALS__ || windowWithTauri.__TAURI__);
const hasConstrainedMemory = typeof navigatorWithMemory.deviceMemory === "number" && navigatorWithMemory.deviceMemory <= 4;
const hasConstrainedCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
const automaticLiteMode = isAndroid || hasConstrainedMemory || hasConstrainedCpu;
const lite = requestedQuality === "lite" || (requestedQuality !== "full" && automaticLiteMode);

export const isChapterOneDemoBuild = import.meta.env.VITE_CHAPTER1_DEMO === "true";

export const performanceProfile = Object.freeze({
    isAndroid,
    isTauriRuntime,
    lite,
    canvasResolution: lite ? 0.67 : 1,
    maxFps: lite ? 30 : 60,
    cinematicPreloadCount: lite ? 1 : 2,
    menuVideoSrc: lite ? "/videos/menu/menu-mobile.mp4" : "/videos/menu/menu.mp4",
    menuAudioSrc: lite ? "/audio/bgm/menu-mobile.m4a" : "/audio/bgm/menu.wav",
    splashAudioSrc: lite ? "/audio/bgm/splash-mobile.m4a" : "/audio/bgm/splash.wav",
});

export function applyPerformanceProfile() {
    document.documentElement.classList.toggle("vn-performance-lite", performanceProfile.lite);
    document.documentElement.dataset.performanceProfile = performanceProfile.lite ? "lite" : "full";
}
