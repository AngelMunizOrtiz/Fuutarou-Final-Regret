import { Assets } from "@drincs/pixi-vn";
import manifest, { getNextStoryAssetBundles, getStoryAssetBundles } from "../assets/manifest";

const backgroundRequestedBundles = new Set<string>();

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

    await Promise.all(currentBundles.map((bundleName) => Assets.loadBundle(bundleName)));

    for (const bundleName of getNextStoryAssetBundles(labelId)) {
        if (currentBundles.includes(bundleName) || backgroundRequestedBundles.has(bundleName)) {
            continue;
        }

        backgroundRequestedBundles.add(bundleName);
        void Assets.backgroundLoadBundle(bundleName);
    }
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
