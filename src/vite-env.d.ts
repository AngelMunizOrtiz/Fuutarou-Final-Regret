/// <reference types="vite/client" />

declare module "virtual:compiled-ink-story" {
    const story: import("@drincs/pixi-vn-ink").PixiVNJson;
    export default story;
}

declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;
