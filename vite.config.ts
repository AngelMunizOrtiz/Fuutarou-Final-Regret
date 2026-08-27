import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFile, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

const host = process.env.TAURI_DEV_HOST;
const basePath = normalizeBasePath(process.env.VITE_BASE_PATH);
const enablePwa = !process.env.TAURI_ENV_PLATFORM && process.env.VITE_DISABLE_PWA !== "true";
const virtualInkStoryId = "virtual:compiled-ink-story";
const resolvedVirtualInkStoryId = `\0${virtualInkStoryId}`;

function normalizeBasePath(value: string | undefined) {
    const trimmedValue = value?.trim();
    if (!trimmedValue || trimmedValue === "/") return "/";

    return `/${trimmedValue.replace(/^\/+|\/+$/g, "")}/`;
}

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

function precompileInkStory(): Plugin {
    const inkDirectory = resolve("src", "ink");
    const chaptersDirectory = join(inkDirectory, "chapters");

    async function compileStory() {
        const chapterOneDemo = process.env.VITE_CHAPTER1_DEMO === "true";
        const chapterFiles = (await readdir(chaptersDirectory, { withFileTypes: true }))
            .filter((entry) => entry.isFile() && /^chapter_\d+\.ink$/i.test(entry.name))
            .filter((entry) => !chapterOneDemo || entry.name.toLowerCase() === "chapter_01.ink")
            .sort((left, right) => left.name.localeCompare(right.name, "en", { numeric: true }));
        const root = (await readFile(join(inkDirectory, "start.ink"), "utf8")).trim();
        const chapters = await Promise.all(
            chapterFiles.map(async (entry) => {
                const source = (await readFile(join(chaptersDirectory, entry.name), "utf8")).trim();
                return chapterOneDemo ? createChapterOneDemoInk(source) : source;
            }),
        );
        const story = await compileInkSource(`${root}\n\n${chapters.join("\n\n")}\n\n`);

        if (!story) {
            throw new Error("Ink compilation returned no story data.");
        }

        return story;
    }

    return {
        name: "precompile-ink-story",
        enforce: "pre" as const,
        resolveId(id: string) {
            return id === virtualInkStoryId ? resolvedVirtualInkStoryId : undefined;
        },
        async load(id: string) {
            if (id !== resolvedVirtualInkStoryId) return undefined;
            return `export default ${JSON.stringify(await compileStory())};`;
        },
        handleHotUpdate(context) {
            if (!context.file.toLowerCase().endsWith(".ink")) return undefined;
            const virtualModule = context.server.moduleGraph.getModuleById(resolvedVirtualInkStoryId);
            if (virtualModule) {
                context.server.moduleGraph.invalidateModule(virtualModule);
            }
            context.server.ws.send({ type: "full-reload" });
            return [];
        },
    };
}

async function compileInkSource(source: string) {
    // Keep the browser shims scoped to Ink compilation so Workbox/PWA sees
    // the normal Node runtime during the remainder of the Vite build.
    const runtime = globalThis as Record<string, unknown>;
    const keys = ["document", "window", "addEventListener", "removeEventListener"] as const;
    const previous = new Map<string, { existed: boolean; value: unknown }>();
    for (const key of keys) previous.set(key, { existed: key in runtime, value: runtime[key] });
    const noop = () => undefined;
    runtime.document = {
        addEventListener: noop,
        removeEventListener: noop,
        createElement: () => ({ addEventListener: noop, removeEventListener: noop, canPlayType: () => "" }),
    };
    runtime.window = { AudioContext: null, OfflineAudioContext: null, webkitAudioContext: null, webkitOfflineAudioContext: null };
    runtime.addEventListener = noop;
    runtime.removeEventListener = noop;
    try {
        const { convertInkText } = await import("@drincs/pixi-vn-ink");
        return convertInkText(source);
    } finally {
        for (const key of keys) {
            const entry = previous.get(key)!;
            if (entry.existed) runtime[key] = entry.value;
            else delete runtime[key];
        }
    }
}

function createChapterOneDemoInk(chapter: string) {
    const extraLabel = "=== chapter_1_extra ===";
    const labelIndex = chapter.indexOf(extraLabel);
    if (labelIndex < 0) return chapter;

    const mainChapter = chapter
        .slice(0, labelIndex)
        .replace(/\n\* Continuar al capitulo 2\s*\n-> chapter_2\s*$/, "")
        .trimEnd();
    const extraChapter = chapter
        .slice(labelIndex)
        .replace(/\n\* Continuar al capitulo 2\s*\n-> chapter_2\s*$/, "\n-> END")
        .trimEnd();

    return `${mainChapter}\n\n${extraChapter}`;
}

// https://vite.dev/config/
export default defineConfig({
    base: basePath,
    publicDir: process.env.VITE_PUBLIC_DIR || "public",
    plugins: [
        react(),
        checker({
            typescript: true,
            enableBuild: false,
        }),
        tailwindcss(),
        precompileInkStory(),
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
                start_url: basePath,
                scope: basePath,
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
    ],
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
