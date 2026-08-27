import { Assets, canvas } from "@drincs/pixi-vn";
import manifest, {
    getStoryAssetSequence,
    getStoryAssetBundles,
    getStoryAssetEntries,
    getStoryAssetEntriesForBundles,
    getStorySpriteSequence,
} from "../assets/manifest";
import {
    clearCharacterSpritePreloadSequence,
    setCharacterSpritePreloadSequence,
} from "../data/characterSprites";
import { performanceProfile } from "./performance-profile";

let activeStoryBundles: readonly string[] = [];
let activeStorySequence: readonly string[] = [];
let storySequenceCursor = 0;
let trimRequest: Promise<void> | null = null;
let trimRequestResolve: (() => void) | undefined;
let trimHandle: number | undefined;
let prefetchHandle: number | undefined;
let storyGeneration = 0;
let recentStoryAliases: string[] = [];
const prefetchedStoryAliases = new Set<string>();
let lastTrimRequestedAt = Number.NEGATIVE_INFINITY;

// Texture cleanup is intentionally less frequent than story steps. Running
// it after every tap can evict a background that is reused a few lines later,
// creating a decode/upload hitch that is more visible than the memory saved.
const MIN_TRIM_INTERVAL_MS = performanceProfile.isAndroid ? 1_800 : performanceProfile.lite ? 1_200 : 900;

const storyAssetEntries = getStoryAssetEntries();
const storyAssetAliases = new Set(storyAssetEntries.map(({ alias }) => alias));
const storyAliasBySource = new Map<string, string>();
for (const { alias, src } of storyAssetEntries) {
    storyAliasBySource.set(src, alias);
    try {
        const resolvedSource = new URL(src, window.location.href);
        storyAliasBySource.set(resolvedSource.href, alias);
        storyAliasBySource.set(resolvedSource.pathname, alias);
    } catch {
        // The original source key remains available.
    }
}

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
    if (sameBundles(activeStoryBundles, currentBundles)) {
        return;
    }
    activeStoryBundles = currentBundles;
    activeStorySequence = getStoryAssetSequence(labelId);
    storySequenceCursor = 0;
    prefetchedStoryAliases.clear();
    setCharacterSpritePreloadSequence(getStorySpriteSequence(labelId));

    // Warm assets in the exact order in which Ink will request them. Manifest
    // order is for organization and is not necessarily story order.
    const bundleEntries = getStoryAssetEntriesForBundles(currentBundles);
    const fallbackAliases = bundleEntries.map(({ alias }) => alias);
    const warmAssets = uniqueAliases(activeStorySequence.length ? activeStorySequence : fallbackAliases)
        .filter((alias) => storyAssetAliases.has(alias))
        .slice(0, performanceProfile.storyWarmAssetCount);
    await Promise.all(
        warmAssets.map(async (alias) => {
            try {
                if (!Assets.cache.has(alias)) {
                    await Assets.load(alias);
                }
                touchRecentStoryAlias(alias);
                advanceStorySequence(alias);
            } catch (error) {
                console.warn(`Unable to warm chapter asset: ${alias}`, error);
            }
        }),
    );
    scheduleStoryPrefetch();
}

export async function releaseStoryAssets() {
    storyGeneration += 1;
    cancelScheduledTask("prefetch");
    cancelScheduledTask("trim");
    if (trimRequest) await trimRequest;
    activeStoryBundles = [];
    activeStorySequence = [];
    storySequenceCursor = 0;
    lastTrimRequestedAt = Number.NEGATIVE_INFINITY;
    recentStoryAliases = [];
    prefetchedStoryAliases.clear();
    clearCharacterSpritePreloadSequence();

    const cachedAliases = [...storyAssetAliases].filter((alias) => Assets.cache.has(alias));
    await Promise.allSettled(cachedAliases.map((alias) => Assets.unload(alias)));
}

/**
 * Keep only story textures that are still attached to the Pixi canvas.
 * Character sprites are DOM assets and are deliberately not touched here.
 */
export function trimStoryAssetCache() {
    if (trimRequest) return trimRequest;

    const now = performance.now();
    if (now - lastTrimRequestedAt < MIN_TRIM_INTERVAL_MS) return Promise.resolve();
    lastTrimRequestedAt = now;

    const generation = storyGeneration;
    trimRequest = new Promise<void>((resolve) => {
        trimRequestResolve = resolve;
        trimHandle = scheduleIdleTask(async () => {
            trimHandle = undefined;
            try {
                if (generation === storyGeneration) await trimUnusedStoryAssets();
            } finally {
                settleTrimRequest();
            }
        }, performanceProfile.storyTrimFallbackMs, performanceProfile.storyAssetIdleTimeoutMs);
    });
    return trimRequest;
}

async function trimUnusedStoryAssets() {
    const retainedAliases = new Set<string>();
    for (const child of canvas.children) {
        collectCanvasAssetAliases(child, retainedAliases);
    }

    retainedAliases.forEach(touchRecentStoryAlias);
    retainedAliases.forEach((alias) => {
        prefetchedStoryAliases.delete(alias);
        advanceStorySequence(alias);
    });
    prefetchedStoryAliases.forEach((alias) => retainedAliases.add(alias));
    const retainedRecentAliases = recentStoryAliases
        .filter((alias) => !retainedAliases.has(alias))
        .slice(-performanceProfile.storyTextureRetainCount);
    retainedRecentAliases.forEach((alias) => retainedAliases.add(alias));

    const staleAliases = [...storyAssetAliases].filter(
        (alias) => Assets.cache.has(alias) && !retainedAliases.has(alias),
    );

    await Promise.allSettled(staleAliases.map((alias) => Assets.unload(alias)));
    recentStoryAliases = recentStoryAliases.filter(
        (alias) => retainedAliases.has(alias) && Assets.cache.has(alias),
    );
    scheduleStoryPrefetch();
}

function touchRecentStoryAlias(alias: string) {
    const previousIndex = recentStoryAliases.indexOf(alias);
    if (previousIndex >= 0) recentStoryAliases.splice(previousIndex, 1);
    recentStoryAliases.push(alias);
}

function advanceStorySequence(alias: string) {
    const matchIndex = activeStorySequence.findIndex(
        (sequenceAlias, index) => index >= storySequenceCursor && sequenceAlias === alias,
    );
    if (matchIndex >= 0) {
        storySequenceCursor = matchIndex + 1;
        const remainingAliases = new Set(activeStorySequence.slice(storySequenceCursor));
        prefetchedStoryAliases.forEach((prefetchedAlias) => {
            if (!remainingAliases.has(prefetchedAlias)) prefetchedStoryAliases.delete(prefetchedAlias);
        });
    }
}

function scheduleStoryPrefetch() {
    if (
        prefetchHandle !== undefined ||
        storySequenceCursor >= activeStorySequence.length ||
        typeof window === "undefined"
    ) {
        return;
    }

    const generation = storyGeneration;
    prefetchHandle = scheduleIdleTask(async () => {
        prefetchHandle = undefined;
        if (generation !== storyGeneration) return;

        const nextAliases = uniqueAliases(activeStorySequence.slice(storySequenceCursor))
            .filter((alias) => storyAssetAliases.has(alias))
            .slice(0, performanceProfile.storyPrefetchCount);

        for (const alias of nextAliases) {
            if (generation !== storyGeneration) return;
            try {
                if (!Assets.cache.has(alias)) await Assets.load(alias);
                prefetchedStoryAliases.add(alias);
            } catch (error) {
                console.warn(`Unable to prefetch story asset: ${alias}`, error);
            }
        }
    }, performanceProfile.storyPrefetchFallbackMs, performanceProfile.storyAssetIdleTimeoutMs);
}

function settleTrimRequest() {
    trimRequestResolve?.();
    trimRequestResolve = undefined;
    trimRequest = null;
}

function cancelScheduledTask(task: "trim" | "prefetch") {
    const handle = task === "trim" ? trimHandle : prefetchHandle;
    if (handle === undefined || typeof window === "undefined") return;

    const idleWindow = window as Window & { cancelIdleCallback?: (idleHandle: number) => void };
    if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(handle);
    else window.clearTimeout(handle);

    if (task === "trim") {
        trimHandle = undefined;
        settleTrimRequest();
    } else {
        prefetchHandle = undefined;
    }
}

function scheduleIdleTask(
    callback: () => void | Promise<void>,
    fallbackDelay: number,
    idleTimeout: number,
) {
    const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };

    if (idleWindow.requestIdleCallback) {
        return idleWindow.requestIdleCallback(() => void callback(), { timeout: idleTimeout });
    }
    return window.setTimeout(() => void callback(), fallbackDelay);
}

function uniqueAliases(aliases: readonly string[]) {
    return [...new Set(aliases)];
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
            let alias = storyAliasBySource.get(textureData.url);
            if (!alias) {
                try {
                    alias = storyAliasBySource.get(new URL(textureData.url, window.location.href).pathname);
                } catch {
                    // Ignore malformed third-party texture URLs.
                }
            }
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
