import { Game } from "@drincs/pixi-vn";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ChapterLoadingOverlay from "./components/ChapterLoadingOverlay";
import FloatingLanguageControl from "./components/LanguageControl";
import FloatingVolumeControl from "./components/VolumeControl";
import {
    GALLERY_ROUTE,
    LOADING_ROUTE,
    MAIN_MENU_ROUTE,
    NARRATION_ROUTE,
    SCENE_ROUTE,
    SPLASH_FINISHED_SESSION_STORAGE_KEY,
    SPLASH_ROUTE,
} from "./constans";
import LoadingScreen from "./screens/LoadingScreen";

const GalleryScreen = lazy(() => import("./screens/GalleryScreen"));
const MainMenu = lazy(() => import("./screens/MainMenu"));
const NarrationRoute = lazy(() => import("./screens/NarrationRoute"));
const SceneScreen = lazy(() => import("./screens/SceneScreen"));
const SplashScreen = lazy(() => import("./screens/SplashScreen"));

export default function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSplashFinished, setIsSplashFinished] = useState(
        () => sessionStorage.getItem(SPLASH_FINISHED_SESSION_STORAGE_KEY) === "1",
    );

    useEffect(() => {
        Game.onNavigate(navigate);
    }, [navigate]);

    useEffect(() => {
        // Modificamos la protección para que permita estar en DREAM_ROUTE o MAIN_MENU_ROUTE
        // si ya pasamos por el Splash
        if (!isSplashFinished && location.pathname !== SPLASH_ROUTE) {
            navigate(SPLASH_ROUTE, { replace: true });
        }
    }, [isSplashFinished, location.pathname, navigate]);

    return (
        <>
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
            <Route
                key={"splash"}
                path={SPLASH_ROUTE}
                element={
                    <SplashScreen
                        onFinish={() => {
                            sessionStorage.setItem(SPLASH_FINISHED_SESSION_STORAGE_KEY, "1");
                            setIsSplashFinished(true);
                        }}
                    />
                }
            />
            <Route key={"main_menu"} path={MAIN_MENU_ROUTE} element={<MainMenu />} />

            <Route key={"scene"} path={`${SCENE_ROUTE}/:sceneId`} element={<SceneScreen />} />
            <Route key={"gallery"} path={GALLERY_ROUTE} element={<GalleryScreen />} />

            <Route key={"loading"} path={LOADING_ROUTE} element={<LoadingScreen />} />
            <Route key={"narration"} path={NARRATION_ROUTE} element={<NarrationRoute />} />
            <Route
                path='*'
                element={
                    <SplashScreen
                        onFinish={() => {
                            sessionStorage.setItem(SPLASH_FINISHED_SESSION_STORAGE_KEY, "1");
                            setIsSplashFinished(true);
                        }}
                    />
                }
            />
                </Routes>
            </Suspense>
            <ChapterLoadingOverlay />
            {location.pathname !== NARRATION_ROUTE && location.pathname !== LOADING_ROUTE && (
                <>
                    <FloatingLanguageControl />
                    <FloatingVolumeControl />
                </>
            )}
        </>
    );
}
