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
import { applyPerformanceProfile, performanceProfile } from "./utils/performance-profile";

applyPerformanceProfile();

// Keep PWA caching out of dev so layout and asset tweaks are visible immediately.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        if (import.meta.env.PROD && !performanceProfile.isTauriRuntime) {
            navigator.serviceWorker.register("/sw.js").catch(console.error);
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
    // The renderer is mostly compositing static VN frames. Avoid forcing a
    // discrete GPU on laptops when the integrated adapter is sufficient.
    powerPreference: "low-power",
}).then(() => {
    canvas.app.ticker.maxFPS = performanceProfile.maxFps;

    // Do not keep the WebGL renderer running while the Android app is in the
    // background. Besides saving battery, this prevents a large catch-up burst
    // when the WebView becomes visible again.
    const updateTickerVisibility = () => {
        if (document.hidden) {
            canvas.app.ticker.stop();
        } else {
            canvas.app.ticker.start();
        }
    };
    document.addEventListener("visibilitychange", updateTickerVisibility);

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
    if (isStorySceneTransition() || window.location.pathname.startsWith(SCENE_ROUTE)) {
        return;
    }

    useCharacterStageStore.getState().clear();
    Game.clear();
    navigate("/");
});

Game.onError((type, error, { notify, uiTransition }) => {
    notify(uiTransition("allert_error_occurred"), { variant: "error" });
    console.error(`Error occurred: ${type}`, error);
});

let activeStoryChapter: number | undefined;

Game.onLoadingLabel(async (_stepId, { id }) => {
    const nextChapter = getStoryChapterNumber(id);
    const isChapterBoundary = nextChapter !== undefined && nextChapter !== activeStoryChapter;

    if (!isChapterBoundary) {
        await loadStoryAssetsForLabel(id);
        return;
    }

    activeStoryChapter = nextChapter;
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
Game.onStepEnd(() => trimStoryAssetCache());

if (import.meta.hot) {
    import.meta.hot.on("ink-updated", () => window.location.reload());
}
