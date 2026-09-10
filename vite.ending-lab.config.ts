import { defineConfig } from "vite";
import { resolve } from "node:path";

// Separate entry: this experiment does not load Ink, saves, Pixi or the game's assets.
export default defineConfig({
    // Resolve from the repository root instead of import.meta.url. Vite bundles
    // this config into a temporary file before loading it on Windows.
    root: resolve(process.cwd(), "experiments/ending-lab"),
    base: "./",
    publicDir: false,
    server: { host: "127.0.0.1", port: 1430, strictPort: true },
    preview: { host: "127.0.0.1", port: 1431, strictPort: true },
    build: { outDir: resolve(process.cwd(), "dist/ending-lab"), emptyOutDir: true, assetsInlineLimit: 0 },
});
