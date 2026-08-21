import { performanceProfile } from "./performance-profile";

const imagePreloadCache = new Map<string, Promise<void>>();

export function preloadImage(src: string): Promise<void> {
    if (!src || typeof Image === "undefined") {
        return Promise.resolve();
    }

    const cached = imagePreloadCache.get(src);
    if (cached) {
        // Refresh insertion order so the bounded map behaves as a tiny LRU.
        imagePreloadCache.delete(src);
        imagePreloadCache.set(src, cached);
        return cached;
    }

    const preload = new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
            if (typeof image.decode !== "function") {
                resolve();
                return;
            }

            image.decode().catch(() => undefined).then(() => resolve());
        };
        image.onerror = () => reject(new Error(`Unable to preload image: ${src}`));
        image.src = src;
    }).catch((error) => {
        imagePreloadCache.delete(src);
        throw error;
    });

    imagePreloadCache.set(src, preload);
    trimImagePreloadCache();
    return preload;
}

export async function preloadImages(sources: readonly string[]) {
    await Promise.all([...new Set(sources.filter(Boolean))].map(preloadImage));
}

function trimImagePreloadCache() {
    while (imagePreloadCache.size > performanceProfile.imagePreloadCacheLimit) {
        const oldestSource = imagePreloadCache.keys().next().value;
        if (typeof oldestSource !== "string") return;
        imagePreloadCache.delete(oldestSource);
    }
}

