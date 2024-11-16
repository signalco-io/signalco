const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
    extends: [
        "next",
        "turbo",
        "next/core-web-vitals",
        "plugin:import/recommended",
        "plugin:import/typescript",
        'plugin:@typescript-eslint/recommended',
        "plugin:tailwindcss/recommended"
    ],
    plugins: ["only-warn"],
    globals: {
        React: true,
        JSX: true,
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js']
        },
    ],
    settings: {
        "import/resolver": {
            typescript: {
                project
            }
        }
    },
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "react/jsx-max-props-per-line": [1, { "when": "multiline" }],
        "react/jsx-props-no-multi-spaces": "warn",
        "react/jsx-wrap-multilines": "warn",
        "react/function-component-definition": [
            "warn"
        ],
        "no-trailing-spaces": "warn",
        quotes: [
            "error",
            "single"
        ],
        "jsx-quotes": [
            "error",
            "prefer-double"
        ],
        "no-var": "error",
        "prefer-const": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-namespace": 0,
        "import/namespace": 0,
        "import/no-unresolved": "error",
        "import/no-absolute-path": "error",
        "import/order": [
            "warn",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    [
                        "sibling",
                        "parent"
                    ],
                    "index",
                    "unknown"
                ],
                "newlines-between": "never",
                alphabetize: {
                    "order": "desc",
                    "caseInsensitive": true
                }
            }
        ],
        "tailwindcss/no-custom-classname": ["warn", {
            "cssFiles": ["!**/node_modules", "!**/.*", "!**/dist", "!**/build"]
        }],
    }
};