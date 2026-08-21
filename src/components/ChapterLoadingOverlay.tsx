import { useTranslation } from "react-i18next";
import LoadingScreen from "../screens/LoadingScreen";
import useChapterTransitionStore from "../stores/useChapterTransitionStore";

export default function ChapterLoadingOverlay() {
    const active = useChapterTransitionStore((state) => state.active);
    const chapterNumber = useChapterTransitionStore((state) => state.chapterNumber);
    const { i18n } = useTranslation();

    if (!active || chapterNumber === undefined) return null;

    const isSpanish = (i18n.resolvedLanguage || i18n.language).toLowerCase().startsWith("es");
    const label = isSpanish
        ? `Preparando capítulo ${chapterNumber}…`
        : `Preparing chapter ${chapterNumber}…`;

    return <LoadingScreen label={label} />;
}
