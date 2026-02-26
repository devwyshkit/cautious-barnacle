import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        rules: {
            "no-console": ["error", { allow: ["warn", "error"] }],
        },
    },
    {
        files: ["src/lib/logging/logger.ts"],
        rules: {
            "no-console": "off",
        },
    },
];

export default eslintConfig;
