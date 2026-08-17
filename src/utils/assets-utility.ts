import { Assets, canvas } from "@drincs/pixi-vn";
import manifest, { getNextStoryAssetBundles, getStoryAssetBundles, getStoryAssetEntries } from "../assets/manifest";
import { performanceProfile } from "./performance-profile";

const loadedStoryBundles = new Set<string>();
const backgroundRequests = new Map<string, Promise<void>>();
let activeStoryBundles: readonly string[] = [];
let previousStoryBundles: readonly string[] = [];
let assetGeneration = 0;
let trimRequest: Promise<void> | null = null;

const storyAssetEntries = getStoryAssetEntries();
const storyAssetAliases = new Set(storyAssetEntries.map(({ alias }) => alias));
const storyAliasBySource = new Map(storyAssetEntries.map(({ alias, src }) => [src, alias]));

/**
 * Define all the assets that will be used in the game.
 * This function will be called before the game starts.
 * You can read more about assets management in the documentation: https://pixi-vn.web.app/start/assets-management.html
 */
export async function defineAssets() {
    await Assets.init({ manifest });
}

export async function loadStoryAssetsForLabel(labelId: string) {
    const currentBundles = getStoryAssetBundles(labelId);
    const nextBundles = getNextStoryAssetBundles(labelId);

    if (!sameBundles(activeStoryBundles, currentBundles)) {
        previousStoryBundles = activeStoryBundles;
        activeStoryBundles = currentBundles;
    }

    // PixiVN already loads an image on demand when an Ink command shows it.
    // Loading a complete chapter eagerly is useful on desktop, but on Android it
    // creates a very large decoded texture cache and can stall the WebView.
    if (performanceProfile.lite) {
        return;
    }

    await Promise.all(
        currentBundles.map(async (bundleName) => {
            await Assets.loadBundle(bundleName);
            loadedStoryBundles.add(bundleName);
        }),
    );

    for (const bundleName of nextBundles) {
        if (currentBundles.includes(bundleName) || backgroundRequests.has(bundleName) || loadedStoryBundles.has(bundleName)) {
            continue;
        }

        const generation = assetGeneration;
        const request = Assets.backgroundLoadBundle(bundleName)
            .then(async () => {
                if (generation !== assetGeneration) {
                    await Assets.unloadBundle(bundleName);
                    return;
                }
                loadedStoryBundles.add(bundleName);
            })
            .catch((error) => {
                console.warn(`Unable to preload story bundle: ${bundleName}`, error);
            })
            .finally(() => {
                backgroundRequests.delete(bundleName);
            });

        backgroundRequests.set(bundleName, request);
    }

    const retainedBundles = new Set([...previousStoryBundles, ...currentBundles, ...nextBundles]);
    const staleBundles = [...loadedStoryBundles].filter((bundleName) => !retainedBundles.has(bundleName));
    await Promise.all(
        staleBundles.map(async (bundleName) => {
            await Assets.unloadBundle(bundleName);
            loadedStoryBundles.delete(bundleName);
        }),
    );
}

export async function releaseStoryAssets() {
    assetGeneration += 1;
    activeStoryBundles = [];
    previousStoryBundles = [];
    backgroundRequests.clear();

    const bundles = [...loadedStoryBundles];
    loadedStoryBundles.clear();
    if (bundles.length > 0) {
        await Assets.unloadBundle(bundles);
    }

    if (performanceProfile.lite) {
        const cachedAliases = [...storyAssetAliases].filter((alias) => Assets.cache.has(alias));
        await Promise.allSettled(cachedAliases.map((alias) => Assets.unload(alias)));
    }
}

/**
 * Keep only story textures that are still attached to the Pixi canvas.
 * Character sprites are DOM assets and are deliberately not touched here.
 */
export function trimStoryAssetCache() {
    if (!performanceProfile.lite) return Promise.resolve();
    if (trimRequest) return trimRequest;

    trimRequest = trimUnusedStoryAssets().finally(() => {
        trimRequest = null;
    });
    return trimRequest;
}

async function trimUnusedStoryAssets() {
    const retainedAliases = new Set<string>();
    for (const child of canvas.children) {
        collectCanvasAssetAliases(child, retainedAliases);
    }

    const staleAliases = [...storyAssetAliases].filter(
        (alias) => Assets.cache.has(alias) && !retainedAliases.has(alias),
    );

    await Promise.allSettled(staleAliases.map((alias) => Assets.unload(alias)));
}

function collectCanvasAssetAliases(value: unknown, retainedAliases: Set<string>, visited = new Set<unknown>()) {
    if (!value || typeof value !== "object" || visited.has(value)) return;
    visited.add(value);

    const record = value as {
        memory?: { textureData?: { alias?: unknown; url?: unknown } };
        children?: unknown[];
    };

    try {
        const textureData = record.memory?.textureData;
        if (typeof textureData?.alias === "string" && storyAssetAliases.has(textureData.alias)) {
            retainedAliases.add(textureData.alias);
        }
        if (typeof textureData?.url === "string") {
            const alias = storyAliasBySource.get(textureData.url);
            if (alias) retainedAliases.add(alias);
        }
    } catch {
        // Some Pixi display objects expose computed memory getters; they can be
        // absent while a transition is being removed, which is safe to ignore.
    }

    if (Array.isArray(record.children)) {
        record.children.forEach((child) => collectCanvasAssetAliases(child, retainedAliases, visited));
    }
}

function sameBundles(left: readonly string[], right: readonly string[]) {
    return left.length === right.length && left.every((bundleName, index) => bundleName === right[index]);
}

/**
 * Get the PixiJS asset from the given asset string.
 * If the asset is not a PixiAsset, it will return the asset as is.
 * @param asset - The asset string to resolve.
 * @returns The resolved PixiJS asset or the original asset string.
 */
export function getPixiJSAsset(asset: string) {
    // check if the asset is a PixiAsset
    return Assets.resolver.resolve(asset).src || asset;
}
