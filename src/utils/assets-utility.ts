import { Assets, canvas } from "@drincs/pixi-vn";
import manifest, {
    getStoryAssetBundles,
    getStoryAssetEntries,
    getStoryAssetEntriesForBundles,
} from "../assets/manifest";
import { performanceProfile } from "./performance-profile";

let activeStoryBundles: readonly string[] = [];
let trimRequest: Promise<void> | null = null;
let recentStoryAliases: string[] = [];

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
    if (sameBundles(activeStoryBundles, currentBundles)) {
        return;
    }
    activeStoryBundles = currentBundles;

    // PixiVN loads visuals on demand. Warming only the first couple of entries
    // avoids a visible first-frame pause without decoding an entire chapter (and
    // the following chapter) into RAM/VRAM at once on desktop.
    const warmAssets = getStoryAssetEntriesForBundles(currentBundles)
        .slice(0, performanceProfile.storyWarmAssetCount);
    await Promise.all(
        warmAssets.map(async ({ alias }) => {
            try {
                if (!Assets.cache.has(alias)) {
                    await Assets.load(alias);
                }
                touchRecentStoryAlias(alias);
            } catch (error) {
                console.warn(`Unable to warm chapter asset: ${alias}`, error);
            }
        }),
    );
}

export async function releaseStoryAssets() {
    activeStoryBundles = [];
    recentStoryAliases = [];

    const cachedAliases = [...storyAssetAliases].filter((alias) => Assets.cache.has(alias));
    await Promise.allSettled(cachedAliases.map((alias) => Assets.unload(alias)));
}

/**
 * Keep only story textures that are still attached to the Pixi canvas.
 * Character sprites are DOM assets and are deliberately not touched here.
 */
export function trimStoryAssetCache() {
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

    retainedAliases.forEach(touchRecentStoryAlias);
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
}

function touchRecentStoryAlias(alias: string) {
    const previousIndex = recentStoryAliases.indexOf(alias);
    if (previousIndex >= 0) recentStoryAliases.splice(previousIndex, 1);
    recentStoryAliases.push(alias);
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
