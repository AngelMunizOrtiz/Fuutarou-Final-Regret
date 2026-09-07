import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Separate entry: this experiment does not load Ink, saves, Pixi or the game's assets.
export default defineConfig({
    root: fileURLToPath(new URL("./experiments/ending-lab", import.meta.url)),
    base: "./",
    publicDir: false,
    server: { host: "127.0.0.1", port: 1430, strictPort: true },
    preview: { host: "127.0.0.1", port: 1431, strictPort: true },
    build: { outDir: "../../dist/ending-lab", emptyOutDir: true, assetsInlineLimit: 0 },
});
