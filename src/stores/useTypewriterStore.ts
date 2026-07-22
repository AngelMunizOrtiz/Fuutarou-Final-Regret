import { create } from "zustand";

type TypewriterStoreType = {
    /**
     * The delay in milliseconds between each character
     */
    delay: number;
    /**
     * Set the delay in milliseconds between each character
     */
    setDelay: (value: number) => void;
    /**
     * The delay in milliseconds between each character
     */
    inProgress: boolean;
    /**
     * Start the typewriter effect
     */
    start: () => void;
    /**
     * End the typewriter effect
     */
    end: () => void;
};

const storedTypewriterDelayValue = localStorage.getItem("typewriter_delay_millisecond");
const storedTypewriterDelay = storedTypewriterDelayValue === null ? Number.NaN : Number(storedTypewriterDelayValue);

const useTypewriterStore = create<TypewriterStoreType>((set) => ({
    delay: Number.isFinite(storedTypewriterDelay) && storedTypewriterDelay >= 0 ? storedTypewriterDelay : 20,
    setDelay: (value: number) => {
        if (typeof value === "number") {
            localStorage.setItem("typewriter_delay_millisecond", value.toString());
            set({ delay: value });
        }
    },
    inProgress: false,
    start: () => set({ inProgress: true }),
    end: () => set({ inProgress: false }),
}));
export default useTypewriterStore;
