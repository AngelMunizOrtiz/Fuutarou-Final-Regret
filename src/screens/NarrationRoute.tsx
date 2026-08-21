import { lazy, Suspense } from "react";
import CharacterStage from "../components/CharacterStage";
import NextButton from "../components/NextButton";
import VisibilityButton from "../components/VisibilityButton";
import useSkipAutoDetector from "../hooks/useSkipAutoDetector";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import NarrationScreen from "./NarrationScreen";
import QuickTools from "./QuickTools";
import TextInput from "./modals/TextInput";

const HistoryScreen = lazy(() => import("./HistoryScreen"));

export default function NarrationRoute() {
    const historyOpen = useHistoryScreenStore((state) => state.open);

    return (
        <>
            {historyOpen && (
                <Suspense fallback={null}>
                    <HistoryScreen />
                </Suspense>
            )}
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
    return null;
}
