import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
    {
        ignores: [
            "artwork/**",
            "dist/**",
            "node_modules/**",
            "src-tauri/gen/**",
            "src-tauri/target/**",
            "tmp/**",
        ],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.node,
            },
            parser: tsParser,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "prefer-const": [
                "error",
                {
                    destructuring: "all",
                    ignoreReadBeforeAssign: true,
                },
            ],
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },
];
