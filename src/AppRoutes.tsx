import { Game } from "@drincs/pixi-vn";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CharacterStage from "./components/CharacterStage";
import FloatingLanguageControl from "./components/LanguageControl";
import NextButton from "./components/NextButton";
import VisibilityButton from "./components/VisibilityButton";
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
import useSkipAutoDetector from "./hooks/useSkipAutoDetector";
import GalleryScreen from "./screens/GalleryScreen";
import HistoryScreen from "./screens/HistoryScreen";
import LoadingScreen from "./screens/LoadingScreen";
import MainMenu from "./screens/MainMenu";
import SceneScreen from "./screens/SceneScreen";
import TextInput from "./screens/modals/TextInput";
import NarrationScreen from "./screens/NarrationScreen";
import QuickTools from "./screens/QuickTools";
import SplashScreen from "./screens/SplashScreen";

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
            <Route key={"narration"} path={NARRATION_ROUTE} element={<NarrationElement />} />
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
            {location.pathname !== NARRATION_ROUTE && location.pathname !== LOADING_ROUTE && (
                <>
                    <FloatingLanguageControl />
                    <FloatingVolumeControl />
                </>
            )}
        </>
    );
}

function NarrationElement() {
    return (
        <>
            <HistoryScreen />
            <CharacterStage />
            <NarrationScreen />
            <QuickTools />
            <TextInput />
            <NextButton />
            <NarrationDetectors />
            <VisibilityButton />
        </>
    );
}

function NarrationDetectors() {
    useSkipAutoDetector();
    return <></>;
}
