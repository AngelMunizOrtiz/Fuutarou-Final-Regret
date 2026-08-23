import { vitePluginInk } from "@drincs/pixi-vn-ink/vite";
import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

const host = process.env.TAURI_DEV_HOST;
const enablePwa = !process.env.TAURI_ENV_PLATFORM && process.env.VITE_DISABLE_PWA !== "true";

function removeUnusedProductionMedia() {
    let outputDirectory = "";

    return {
        name: "remove-unused-production-media",
        apply: "build" as const,
        configResolved(config: { root: string; build: { outDir: string } }) {
            outputDirectory = resolve(config.root, config.build.outDir);
        },
        async closeBundle() {
            // Runtime playback uses the equivalent AAC files on every profile.
            // Keep the WAV masters in public/, but do not ship 54 MB of dead
            // media inside web and desktop production builds.
            await Promise.all([
                "audio/bgm/menu.wav",
                "audio/bgm/splash.wav",
            ].map((asset) => rm(resolve(outputDirectory, asset), { force: true })));
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    publicDir: process.env.VITE_PUBLIC_DIR || "public",
    plugins: [
        react(),
        checker({
            typescript: true,
            enableBuild: false,
        }),
        tailwindcss(),
        removeUnusedProductionMedia(),
        ...(enablePwa ? [VitePWA({
            // you can generate the icons using: https://favicon.io/favicon-converter/
            // and the maskable icon using: https://progressier.com/maskable-icons-editor
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
            manifest: {
                name: "Fuutarou Final Regret",
                short_name: "Fuutarou Final Regret",
                description: "Fan game of TQQ , Route Miku",
                theme_color: "#ffffff",
                start_url: "/",
                display: "fullscreen",
                orientation: "landscape",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        })] : []),
        vitePluginPixivn(),
        vitePluginInk(),
    ],
    assetsInclude: ["**/ink/*.ink"],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_NAME__: JSON.stringify(process.env.npm_package_name),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "lib/@mui/joy": ["@mui/joy"],
                    "lib/react-markdown": ["react-markdown", "rehype-raw", "remark-gfm"],
                    "lib/pixi.js": ["pixi.js"],
                    "lib/@drincs/pixi-vn": ["@drincs/pixi-vn"],
                },
            },
        },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: "ws",
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/artwork/**", "**/dist/**", "**/src-tauri/**", "**/tmp/**"],
        },
    },
});
