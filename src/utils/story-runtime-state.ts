let activeStoryChapter: number | undefined;

export function isStoryChapterBoundary(nextChapter: number | undefined) {
    return nextChapter !== undefined && nextChapter !== activeStoryChapter;
}

export function setActiveStoryChapter(chapter: number) {
    activeStoryChapter = chapter;
}

/**
 * Returning to the title clears the visual cache. Clear the chapter marker at
 * the same time so the next New Game always receives the chapter transition
 * overlay and a clean first-asset warmup.
 */
export function resetActiveStoryChapter() {
    activeStoryChapter = undefined;
}
