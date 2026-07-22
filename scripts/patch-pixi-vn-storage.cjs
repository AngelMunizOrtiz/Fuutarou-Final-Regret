const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pixiVnDist = path.join(root, "node_modules", "@drincs", "pixi-vn", "dist");

const patches = [
    {
        file: path.join(pixiVnDist, "storage.mjs"),
        marker: "SYSTEM_RESERVED_STORAGE_KEYS",
        patch: "\nexport{n as SYSTEM_RESERVED_STORAGE_KEYS}from'./chunk-IWAXXFXE.mjs';\n",
    },
    {
        file: path.join(pixiVnDist, "storage.cjs"),
        marker: "SYSTEM_RESERVED_STORAGE_KEYS",
        patch: "\nexports.SYSTEM_RESERVED_STORAGE_KEYS=j;\n",
    },
    {
        file: path.join(pixiVnDist, "storage.d.ts"),
        marker: "SYSTEM_RESERVED_STORAGE_KEYS",
        patch:
            "\ndeclare const SYSTEM_RESERVED_STORAGE_KEYS: {\n" +
            "    readonly ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY: string;\n" +
            "};\n" +
            "export { SYSTEM_RESERVED_STORAGE_KEYS };\n",
    },
];

for (const { file, marker, patch } of patches) {
    if (!fs.existsSync(file)) {
        continue;
    }

    const content = fs.readFileSync(file, "utf8");
    if (content.includes(marker)) {
        continue;
    }

    fs.writeFileSync(file, content.trimEnd() + patch, "utf8");
    console.log(`[patch-pixi-vn-storage] Patched ${path.relative(root, file)}`);
}
