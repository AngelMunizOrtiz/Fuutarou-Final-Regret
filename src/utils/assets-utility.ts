import { Assets } from "@drincs/pixi-vn";
import manifest, { getNextStoryAssetBundles, getStoryAssetBundles } from "../assets/manifest";

const loadedStoryBundles = new Set<string>();
const backgroundRequests = new Map<string, Promise<void>>();
let activeStoryBundles: readonly string[] = [];
let previousStoryBundles: readonly string[] = [];
let assetGeneration = 0;

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
