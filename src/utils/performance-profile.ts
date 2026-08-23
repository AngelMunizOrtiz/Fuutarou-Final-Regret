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

const useSystemFonts = import.meta.env.VITE_SYSTEM_FONTS === "true" || isAndroid;
const constrainedAndroid = isAndroid && (hasConstrainedMemory || hasConstrainedCpu);

export const performanceProfile = Object.freeze({
    isAndroid,
    isTauriRuntime,
    lite,
    // Android WebView renders the DOM UI at the device resolution, so lowering
    // only Pixi's internal canvas keeps text crisp while substantially reducing
    // the amount of background pixels the GPU has to draw every frame.
    canvasResolution: constrainedAndroid ? 0.42 : isAndroid ? 0.5 : lite ? 0.67 : 1,
    // A visual novel does not benefit from a permanently running 60 FPS
    // renderer. 45 FPS keeps fades fluid on desktop while cutting the idle
    // WebGL workload by roughly a quarter; constrained devices stay lower.
    // 24 FPS looked like periodic judder on 60/120 Hz tablets even when the
    // renderer had spare time. Thirty divides evenly into both refresh rates.
    maxFps: isAndroid ? 30 : lite ? 30 : 45,
    cinematicPreloadCount: lite ? 1 : 2,
    storyWarmAssetCount: lite ? 1 : 2,
    storyPrefetchCount: constrainedAndroid ? 1 : lite ? 2 : 3,
    storyTextureRetainCount: constrainedAndroid ? 1 : isAndroid ? 2 : lite ? 2 : 3,
    spritePrefetchCount: constrainedAndroid ? 1 : lite ? 2 : 3,
    spritePreloadCacheLimit: lite ? 8 : 24,
    imagePreloadCacheLimit: lite ? 6 : 24,
    typewriterFrameMs: isAndroid ? 64 : lite ? 50 : 25,
    rendererIdleSleepMs: isAndroid ? 1_200 : lite ? 1_800 : 3_000,
    enableViewTransitions: !lite,
    reducedMotion: lite,
    useSystemFonts,
    powerPreference: isAndroid ? "high-performance" : "low-power",
    initialLoaderMinimumMs: lite ? 700 : 500,
    menuVideoSrc: lite ? "/videos/menu/menu-mobile.mp4" : "/videos/menu/menu.mp4",
    // AAC is transparent for these tracks and streams efficiently. The WAV
    // versions add more than 50 MB to a chapter-one desktop package.
    menuAudioSrc: "/audio/bgm/menu-mobile.m4a",
    splashAudioSrc: "/audio/bgm/splash-mobile.m4a",
});

export function applyPerformanceProfile() {
    document.documentElement.classList.toggle("vn-performance-lite", performanceProfile.lite);
    document.documentElement.classList.toggle("vn-system-fonts", performanceProfile.useSystemFonts);
    document.documentElement.dataset.performanceProfile = performanceProfile.lite ? "lite" : "full";
}
