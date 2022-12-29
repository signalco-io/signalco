module.exports = {
    extends: [
        "next",
        "turbo",
        "next/core-web-vitals",
        "plugin:import/recommended",
        "plugin:import/typescript"
    ],
    settings: {
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json"
            }
        },
        react: {
            version: "detect"
        },
    },
    rules: {
        indent: [
            "error",
            4
        ],
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
        ]
    }
};