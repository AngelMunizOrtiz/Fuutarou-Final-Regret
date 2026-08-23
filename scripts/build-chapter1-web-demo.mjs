import { readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const stagedPublicDirectory = join(workspace, ".codex-tmp", "windows-chapter1-public");
const publicDirectory = join(workspace, "public");
const defaultBasePath = "/Fuutarou-Final-Regret/";

await run(process.execPath, [join(scriptDirectory, "prepare-chapter1-windows-demo.mjs")], process.env);

const storyDirectories = [
    "images/memories",
    "images/backgrounds/chapter_01",
    "images/cg/chapter_01",
];
const sourcePngFiles = (
    await Promise.all(storyDirectories.map((directory) => collectFiles(join(publicDirectory, directory))))
).flat().filter((file) => extname(file).toLowerCase() === ".png");

const stagedVariants = await Promise.all(sourcePngFiles.map(async (sourceFile) => {
    const relativePath = relative(publicDirectory, sourceFile);
    const stagedPng = join(stagedPublicDirectory, relativePath);
    const stagedWebp = stagedPng.replace(/\.png$/i, ".webp");
    return {
        png: await fileExists(stagedPng),
        webp: await fileExists(stagedWebp),
    };
}));

const allStoryPngsWereConverted = stagedVariants.length > 0 && stagedVariants.every((entry) => entry.webp && !entry.png);
const allStoryPngsRemainOriginal = stagedVariants.every((entry) => entry.png && !entry.webp);

if (!allStoryPngsWereConverted && !allStoryPngsRemainOriginal) {
    throw new Error("Chapter 1 image staging is incomplete: PNG/WebP derivatives are mixed or missing.");
}

const buildEnvironment = {
    ...process.env,
    VITE_PUBLIC_DIR: stagedPublicDirectory,
    VITE_CHAPTER1_DEMO: "true",
    VITE_DISABLE_PWA: "true",
    VITE_STORY_WEBP: allStoryPngsWereConverted ? "true" : "false",
    VITE_BASE_PATH: process.env.VITE_BASE_PATH || defaultBasePath,
};

await run(process.execPath, [join(scriptDirectory, "generate-story-prefetch-plan.mjs")], buildEnvironment);
await run(process.execPath, [join(workspace, "node_modules", "typescript", "bin", "tsc")], buildEnvironment);
await run(process.execPath, [join(workspace, "node_modules", "vite", "bin", "vite.js"), "build"], buildEnvironment);
await run(process.execPath, [join(scriptDirectory, "finalize-github-pages-build.mjs")], buildEnvironment);

const outputDirectory = join(workspace, "dist");
const outputFiles = await collectFiles(outputDirectory);
const outputBytes = (
    await Promise.all(outputFiles.map(async (file) => (await stat(file)).size))
).reduce((total, size) => total + size, 0);

console.log(`GitHub Pages demo ready: ${outputFiles.length} files, ${(outputBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(outputDirectory);

function run(command, args, env) {
    return new Promise((resolveRun, rejectRun) => {
        const child = spawn(command, args, {
            cwd: workspace,
            env,
            stdio: "inherit",
            windowsHide: true,
        });

        child.once("error", rejectRun);
        child.once("exit", (code) => {
            if (code === 0) resolveRun();
            else rejectRun(new Error(`${command} exited with code ${code ?? "unknown"}`));
        });
    });
}

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(entries.map((entry) => {
        const fullPath = join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
    }));
    return nestedFiles.flat();
}

async function fileExists(path) {
    try {
        await stat(path);
        return true;
    } catch {
        return false;
    }
}
