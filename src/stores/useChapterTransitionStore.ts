import { create } from "zustand";

type ChapterTransitionStore = {
    active: boolean;
    chapterNumber?: number;
    begin: (chapterNumber: number) => void;
    end: () => void;
};

const useChapterTransitionStore = create<ChapterTransitionStore>((set) => ({
    active: false,
    chapterNumber: undefined,
    begin: (chapterNumber) => set({ active: true, chapterNumber }),
    end: () => set({ active: false }),
}));

export default useChapterTransitionStore;
