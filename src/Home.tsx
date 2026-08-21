import { lazy, Suspense } from "react";
import Routes from "./AppRoutes";
import LandscapeOrientationGuard from "./components/LandscapeOrientationGuard";
import useClosePageDetector from "./hooks/useClosePageDetector";
import useInkInitialization from "./hooks/useInkInitialization";
import useKeyboardDetector from "./hooks/useKeyboardDetector";
import useEventListener from "./hooks/useKeyDetector";
import RootProvider from "./providers/RootProvider";
import LoadingScreen from "./screens/LoadingScreen";
import OfflineScreen from "./screens/OfflineScreen";
import useGameSaveScreenStore from "./stores/useGameSaveScreenStore";
import useSettingsScreenStore from "./stores/useSettingsScreenStore";

const GameSaveScreen = lazy(() => import("./screens/GameSaveScreen"));
const SaveLoadAlert = lazy(() => import("./screens/modals/SaveLoadAlert"));
const Settings = lazy(() => import("./screens/Settings"));

function HomeChild() {
    const settingsOpen = useSettingsScreenStore((state) => state.open);
    const saveScreenOpen = useGameSaveScreenStore((state) => state.open);
    const saveAlertOpen = useGameSaveScreenStore((state) => state.alert.open);
    useKeyboardDetector();
    useClosePageDetector();
    useInkInitialization();
    // Prevent the user from going back to the previous page
    useEventListener({
        type: "popstate",
        listener: () => {
            window.history.forward();
        },
    });

    return (
        <>
            <LandscapeOrientationGuard />
            <Routes />
            <Suspense fallback={<LoadingScreen />}>
                {settingsOpen && <Settings />}
                {saveScreenOpen && <GameSaveScreen />}
                {saveAlertOpen && <SaveLoadAlert />}
            </Suspense>
            <OfflineScreen />
        </>
    );
}

export default function Home() {
    return (
        <RootProvider>
            <HomeChild />
        </RootProvider>
    );
}
