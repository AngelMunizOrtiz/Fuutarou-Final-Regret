import { ComponentType, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { MotionConfig } from "motion/react";
import { getInitialGameLanguage, initializeI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";
import { importAllInkLabels } from "./utils/ink-utility";
import { performanceProfile } from "./utils/performance-profile";
import { preloadImages } from "./utils/preload-utility";

const SPLASH_IMAGE_ASSETS = [
    "/images/bg_title.webp",
    "/images/logo_game.webp",
    "/images/ui/press-any-button-en.svg",
    "/images/ui/press-any-button-es.svg",
] as const;

const INITIAL_LOADER_MINIMUM_MS = performanceProfile.initialLoaderMinimumMs;
const INITIAL_LOADER_EXIT_MS = performanceProfile.initialLoaderExitMs;
const INITIAL_LOADER_STARTED_AT = performance.now();

const Home = lazy(async () => {
    await Promise.all([import("./values"), import("./labels")]);
    await Promise.all([
        initializeIndexedDB(),
        defineAssets(),
        initializeI18n(),
        importAllInkLabels(),
        preloadImages(SPLASH_IMAGE_ASSETS),
    ]);
    if (import.meta.env.DEV) {
        const { setupPixivnViteData } = await import("@drincs/pixi-vn/vite-listener");
        setupPixivnViteData();
    }
    return import("./Home");
});

const ErrorFallback: ComponentType<FallbackProps> = ({ error, resetErrorBoundary }) => {
    const language = getInitialGameLanguage();

    return (
        <div
            role='alert'
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10001,
                pointerEvents: "auto",
                backgroundColor: "#090916",
            }}
        >
            <h2
                style={{
                    color: "red",
                    fontSize: "2rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                {language === "es" ? "Algo salió mal" : "Something went wrong"}
            </h2>
            <p
                style={{
                    color: "white",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                {(error as Error).message}
            </p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                    paddingBottom: "1rem",
                }}
            >
                <button
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                    }}
                    onClick={resetErrorBoundary}
                >
                    {language === "es" ? "Intentar de nuevo" : "Try again"}
                </button>
            </div>
        </div>
    );
};

function HomeReadyMarker({ onReady }: { onReady: () => void }) {
    useEffect(onReady, [onReady]);
    return <Home />;
}

export default function App() {
    const [homeReady, setHomeReady] = useState(false);
    const [showInitialLoader, setShowInitialLoader] = useState(true);
    const [initialLoaderExiting, setInitialLoaderExiting] = useState(false);
    const markHomeReady = useCallback(() => setHomeReady(true), []);

    useEffect(() => {
        document.getElementById("bootstrap-loader")?.remove();
    }, []);

    useEffect(() => {
        if (!homeReady) return;

        let exitTimer: number | undefined;
        const elapsed = performance.now() - INITIAL_LOADER_STARTED_AT;
        const minimumTimer = window.setTimeout(
            () => {
                setInitialLoaderExiting(true);
                exitTimer = window.setTimeout(() => setShowInitialLoader(false), INITIAL_LOADER_EXIT_MS);
            },
            Math.max(0, INITIAL_LOADER_MINIMUM_MS - elapsed),
        );

        return () => {
            window.clearTimeout(minimumTimer);
            if (exitTimer !== undefined) window.clearTimeout(exitTimer);
        };
    }, [homeReady]);

    return (
        <MotionConfig reducedMotion={performanceProfile.reducedMotion ? "always" : "user"}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={null}>
                    <HomeReadyMarker onReady={markHomeReady} />
                </Suspense>
                {showInitialLoader && <LoadingScreen exiting={initialLoaderExiting} />}
            </ErrorBoundary>
        </MotionConfig>
    );
}
