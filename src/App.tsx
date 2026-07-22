import { ComponentType, lazy, Suspense, useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { initializeI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";
import { importAllInkLabels } from "./utils/ink-utility";
import { preloadImages } from "./utils/preload-utility";

const SPLASH_IMAGE_ASSETS = [
    "/images/bg_title.webp",
    "/images/logo_game.webp",
    "/images/pressanybutton.webp",
] as const;

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
                Something went wrong
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
                    Try again
                </button>
            </div>
        </div>
    );
};

export default function App() {
    useEffect(() => {
        document.getElementById("bootstrap-loader")?.remove();
    }, []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingScreen />}>
                <Home />
            </Suspense>
        </ErrorBoundary>
    );
}
