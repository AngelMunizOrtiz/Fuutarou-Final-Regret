import { Box } from "@mui/joy";
import { lazy, Suspense } from "react";
import Routes from "./AppRoutes";
import useClosePageDetector from "./hooks/useClosePageDetector";
import useInkInitialization from "./hooks/useInkInitialization";
import useKeyboardDetector from "./hooks/useKeyboardDetector";
import useEventListener from "./hooks/useKeyDetector";
import RootProvider from "./providers/RootProvider";
import GameSaveScreen from "./screens/GameSaveScreen";
import SaveLoadAlert from "./screens/modals/SaveLoadAlert";
import OfflineScreen from "./screens/OfflineScreen";
import Settings from "./screens/Settings";

const ReactQueryDevtools = import.meta.env.DEV
    ? lazy(async () => {
          const module = await import("@tanstack/react-query-devtools");
          return { default: module.ReactQueryDevtools };
      })
    : null;

function HomeChild() {
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
            <Routes />
            <Settings />
            <GameSaveScreen />
            <SaveLoadAlert />
            <OfflineScreen />
            {ReactQueryDevtools && (
                <Suspense fallback={null}>
                    <Box sx={{ pointerEvents: "auto" }}>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </Box>
                </Suspense>
            )}
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
