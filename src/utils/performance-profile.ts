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
// A constrained device should use cheaper effects, not lose all motion. Keep
// Motion's global accessibility switch tied to the user's OS preference so
// Android still gets lightweight fades, pans and character emphasis.
const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    // Mobile keeps exactly the next visual warm. Decoding several 16:9
    // textures while dialogue is being revealed was the main source of the
    // short stalls seen in Android WebView.
    storyPrefetchCount: isAndroid ? 1 : lite ? 2 : 3,
    // Keep a small rolling window of backgrounds on mobile. One or two
    // textures were too aggressive for quick dialogue advances: a background
    // could be unloaded just before the next line reused it, forcing another
    // decode/upload on the WebView GPU.
    storyTextureRetainCount: isAndroid ? 3 : lite ? 2 : 3,
    // Texture eviction is deliberately less frequent than dialogue steps.
    // Releasing GPU resources is more expensive than retaining one extra
    // chapter texture for a few seconds, especially on Android WebView.
    storyTrimMinIntervalMs: isAndroid ? 5_000 : lite ? 2_000 : 1_200,
    spritePrefetchCount: isAndroid ? 1 : lite ? 2 : 3,
    spritePreloadCacheLimit: isAndroid ? 4 : lite ? 8 : 24,
    imagePreloadCacheLimit: isAndroid ? 3 : lite ? 6 : 24,
    typewriterFrameMs: isAndroid ? 64 : lite ? 50 : 25,
    // Lite transitions are shortened below, so Pixi only needs to remain
    // awake for a small tail after each tap. DOM dialogue and sprites keep
    // animating independently while the static WebGL scene sleeps.
    rendererIdleSleepMs: isAndroid ? 360 : lite ? 650 : 1_200,
    storyTrimFallbackMs: isAndroid ? 500 : 220,
    storyPrefetchFallbackMs: isAndroid ? 850 : 350,
    storyAssetIdleTimeoutMs: isAndroid ? 1_800 : 900,
    spritePrefetchFallbackMs: isAndroid ? 650 : 120,
    spriteAssetIdleTimeoutMs: isAndroid ? 1_400 : 500,
    canvasFadeDurationSeconds: isAndroid || lite ? 0.18 : undefined,
    // Keep mobile transitions short, but long enough for a visible 30 FPS
    // fade/zoom instead of appearing as an instant cut.
    cinematicTransitionSeconds: isAndroid || lite ? 0.26 : 0.3,
    enableViewTransitions: !prefersReducedMotion,
    reducedMotion: prefersReducedMotion,
    useSystemFonts,
    powerPreference: isAndroid ? "high-performance" : "low-power",
    initialLoaderMinimumMs: lite ? 250 : 500,
    initialLoaderExitMs: lite ? 140 : 420,
    // Video decoding and compositing competes with Pixi for the same mobile
    // GPU. Android gets the existing title illustration; desktop retains the
    // animated menu.
    menuVideoEnabled: !isAndroid && !lite,
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
