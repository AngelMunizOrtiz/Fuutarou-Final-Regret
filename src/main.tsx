import { canvas, Container, Game } from "@drincs/pixi-vn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import { getStoryChapterNumber } from "./assets/manifest";
import { CANVAS_UI_LAYER_NAME, HTML_CANVAS_LAYER_NAME, HTML_UI_LAYER_NAME, SCENE_ROUTE } from "./constans";
import useCharacterStageStore from "./stores/useCharacterStageStore";
import useChapterTransitionStore from "./stores/useChapterTransitionStore";
import { loadStoryAssetsForLabel, releaseStoryAssets, trimStoryAssetCache } from "./utils/assets-utility";
import { isStorySceneTransition } from "./utils/ink-utility";
import { getAppPathname } from "./utils/base-path";
import { applyPerformanceProfile, performanceProfile } from "./utils/performance-profile";
import { configureCanvasRendererPerformance, wakeCanvasRenderer } from "./utils/renderer-performance";
import {
    isStoryChapterBoundary,
    resetActiveStoryChapter,
    setActiveStoryChapter,
} from "./utils/story-runtime-state";

applyPerformanceProfile();

// Keep PWA caching out of dev so layout and asset tweaks are visible immediately.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        const pwaEnabled = import.meta.env.VITE_DISABLE_PWA !== "true";
        if (import.meta.env.PROD && pwaEnabled && !performanceProfile.isTauriRuntime) {
            navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(console.error);
            return;
        }

        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => registration.unregister());
        }).catch(console.error);

        if ("caches" in window) {
            window.caches.keys().then((keys) => {
                keys.forEach((key) => window.caches.delete(key));
            }).catch(console.error);
        }
    });
}

// Canvas setup with PIXI
const body = document.body;
if (!body) {
    throw new Error("body element not found");
}

Game.init(body, {
    id: HTML_CANVAS_LAYER_NAME,
    height: 1080,
    width: 1920,
    backgroundColor: "#090916",
    resizeMode: "contain",
    resolution: performanceProfile.canvasResolution,
    autoDensity: true,
    antialias: !performanceProfile.lite,
    preference: "webgl",
    // Android WebView benefits from the GPU renderer; desktop keeps the
    // battery-friendly adapter because most frames are static.
    powerPreference: performanceProfile.powerPreference,
}).then(() => {
    canvas.app.ticker.maxFPS = performanceProfile.maxFps;
    configureCanvasRendererPerformance();

    // Pixi.JS UI Layer
    canvas.addLayer(CANVAS_UI_LAYER_NAME, new Container());

    // React setup with ReactDOM
    const root = document.getElementById("root");
    if (!root) {
        throw new Error("root element not found");
    }

    const htmlLayout = canvas.addHtmlLayer(HTML_UI_LAYER_NAME, root);
    if (!htmlLayout) {
        throw new Error("htmlLayout not found");
    }
    htmlLayout.classList.add("vn-game-ui-layer");
    const reactRoot = createRoot(htmlLayout);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });

    reactRoot.render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>,
    );
});

Game.onEnd(async ({ navigate }) => {
    wakeCanvasRenderer();
    if (isStorySceneTransition() || getAppPathname().startsWith(SCENE_ROUTE)) {
        return;
    }

    useCharacterStageStore.getState().clear();
    Game.clear();
    resetActiveStoryChapter();
    navigate("/");
});

Game.onError((type, error, { notify, uiTransition }) => {
    notify(uiTransition("allert_error_occurred"), { variant: "error" });
    console.error(`Error occurred: ${type}`, error);
});

Game.onLoadingLabel(async (_stepId, { id }) => {
    wakeCanvasRenderer();
    const nextChapter = getStoryChapterNumber(id);
    const isChapterBoundary = isStoryChapterBoundary(nextChapter);

    if (!isChapterBoundary || nextChapter === undefined) {
        await loadStoryAssetsForLabel(id);
        return;
    }

    setActiveStoryChapter(nextChapter);
    useChapterTransitionStore.getState().begin(nextChapter);

    try {
        // Give React one frame to cover the old scene before destroying its
        // textures, then begin the next chapter with an empty visual stage.
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
        useCharacterStageStore.getState().clear();
        canvas.removeAll();
        await releaseStoryAssets();
        await loadStoryAssetsForLabel(id);
    } finally {
        useChapterTransitionStore.getState().end();
    }
});
Game.onStepEnd(() => {
    wakeCanvasRenderer();
    void trimStoryAssetCache();
});

if (import.meta.hot) {
    import.meta.hot.on("ink-updated", () => window.location.reload());
}
