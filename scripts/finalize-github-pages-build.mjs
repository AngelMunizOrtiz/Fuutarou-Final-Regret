import { copyFile, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(scriptDirectory, "..");
const outputDirectory = join(workspace, "dist");
const basePath = normalizeBasePath(process.env.VITE_BASE_PATH);
const basePrefix = basePath === "/" ? "" : basePath.slice(0, -1);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".svg", ".webmanifest"]);
const rootPublicAssetPattern = /(["'`(=:,\s])\/(images|audio|fonts|videos)\//g;

if (basePath === "/") {
    throw new Error("VITE_BASE_PATH must target the GitHub Pages repository subpath.");
}

const files = await collectFiles(outputDirectory);
let rewrittenFileCount = 0;

for (const file of files) {
    if (!textExtensions.has(extname(file).toLowerCase())) continue;

    const source = await readFile(file, "utf8");
    const rewritten = source.replace(
        rootPublicAssetPattern,
        (_match, prefix, directory) => `${prefix}${basePrefix}/${directory}/`,
    );

    if (rewritten !== source) {
        await writeFile(file, rewritten, "utf8");
        rewrittenFileCount += 1;
    }
}

const remainingRootReferences = [];
for (const file of await collectFiles(outputDirectory)) {
    if (!textExtensions.has(extname(file).toLowerCase())) continue;
    const source = await readFile(file, "utf8");
    if (rootPublicAssetPattern.test(source)) {
        remainingRootReferences.push(relative(outputDirectory, file));
    }
    rootPublicAssetPattern.lastIndex = 0;
}

if (remainingRootReferences.length > 0) {
    throw new Error(`Unprefixed public asset paths remain in: ${remainingRootReferences.join(", ")}`);
}

await copyFile(join(outputDirectory, "index.html"), join(outputDirectory, "404.html"));
await writeFile(join(outputDirectory, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages paths finalized for ${basePath} (${rewrittenFileCount} files updated).`);

function normalizeBasePath(value) {
    const trimmedValue = value?.trim();
    if (!trimmedValue || trimmedValue === "/") return "/";
    return `/${trimmedValue.replace(/^\/+|\/+$/g, "")}/`;
}

async function collectFiles(directory) {
    const directoryStats = await stat(directory);
    if (directoryStats.isFile()) return [directory];

    const entries = await readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(entries.map((entry) => {
        const fullPath = join(directory, entry.name);
        return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
    }));
    return nestedFiles.flat();
}
