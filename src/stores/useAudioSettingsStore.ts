import { create } from "zustand";

const MASTER_VOLUME_STORAGE_KEY = "master_volume";
const LAST_AUDIBLE_VOLUME_STORAGE_KEY = "last_audible_volume";
const DEFAULT_MASTER_VOLUME = 0.8;

function clampVolume(value: number) {
    return Math.min(1, Math.max(0, value));
}

function readStoredVolume(key: string, fallback: number) {
    const storedValue = Number.parseFloat(localStorage.getItem(key) ?? "");
    return Number.isFinite(storedValue) ? clampVolume(storedValue) : fallback;
}

type AudioSettingsStore = {
    volume: number;
    lastAudibleVolume: number;
    setVolume: (volume: number) => void;
    toggleMuted: () => void;
};

const initialVolume = readStoredVolume(MASTER_VOLUME_STORAGE_KEY, DEFAULT_MASTER_VOLUME);
const initialLastAudibleVolume = readStoredVolume(
    LAST_AUDIBLE_VOLUME_STORAGE_KEY,
    initialVolume > 0 ? initialVolume : DEFAULT_MASTER_VOLUME,
);

const useAudioSettingsStore = create<AudioSettingsStore>((set, get) => ({
    volume: initialVolume,
    lastAudibleVolume: initialLastAudibleVolume,
    setVolume: (nextVolume) => {
        const volume = clampVolume(nextVolume);
        const nextState: Partial<AudioSettingsStore> = { volume };

        localStorage.setItem(MASTER_VOLUME_STORAGE_KEY, volume.toString());
        if (volume > 0) {
            nextState.lastAudibleVolume = volume;
            localStorage.setItem(LAST_AUDIBLE_VOLUME_STORAGE_KEY, volume.toString());
        }

        set(nextState);
    },
    toggleMuted: () => {
        const { volume, lastAudibleVolume } = get();
        const nextVolume = volume > 0 ? 0 : lastAudibleVolume || DEFAULT_MASTER_VOLUME;
        localStorage.setItem(MASTER_VOLUME_STORAGE_KEY, nextVolume.toString());
        set({ volume: nextVolume });
    },
}));

export default useAudioSettingsStore;

