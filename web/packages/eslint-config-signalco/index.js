// import next from 'eslint-config-next';
import eslintTurbo from 'eslint-config-turbo';
import eslintReact from 'eslint-plugin-react';
import eslintTailwindcss from 'eslint-plugin-tailwindcss';
import stylisticJs from '@stylistic/eslint-plugin-js'
// import eslintImport from 'eslint-plugin-import';
// import eslintImportRecommended from 'eslint-plugin-import/recommended';
// import eslintImportTypescript from 'eslint-plugin-import/typescript';

// import { resolve } from "node:path";
// const project = resolve(process.cwd(), "tsconfig.json");

const reactConfig = {
    files: ['*.tsx'],
    plugins: {
        react: eslintReact,
    },
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        }
    },
    rules: {
        "react/jsx-max-props-per-line": [1, { "when": "multiline" }],
        "react/jsx-props-no-multi-spaces": "warn",
        "react/jsx-wrap-multilines": "warn",
        "react/function-component-definition": [
            "warn"
        ],
        "jsx-quotes": [
            "warn",
            "prefer-double"
        ],
    }
};

const generalConfig = {
    plugins: {
        '@stylistic/js': stylisticJs,
    },
    rules: {
        "no-var": "error",
        "prefer-const": "warn",
        "@stylistic/js/quotes": [
            "warn",
            "single"
        ],
        "@stylistic/js/no-trailing-spaces": "warn",
    }
};

const tailwindcssConfig = {
    plugins: {
        tailwindcss: eslintTailwindcss,
    },
    rules: {
        "tailwindcss/no-custom-classname": ["warn", {
            "cssFiles": ["!**/node_modules", "!**/.*", "!**/dist", "!**/build"]
        }],
    }
};

// const importConfig = {
//     plugins: {
//         import: eslintImport,
//     },
//     rules: {
//         "import/namespace": 0,
//         "import/no-unresolved": "error",
//         "import/no-absolute-path": "error",
//         "import/order": [
//             "warn",
//             {
//                 groups: [
//                     "builtin",
//                     "external",
//                     "internal",
//                     [
//                         "sibling",
//                         "parent"
//                     ],
//                     "index",
//                     "unknown"
//                 ],
//                 "newlines-between": "never",
//                 alphabetize: {
//                     "order": "desc",
//                     "caseInsensitive": true
//                 }
//             }
//         ],
//     }
// };

const turboConfig = {
    plugins: {
        turbo: eslintTurbo,
    }
}

export default [
    generalConfig,
    // reactConfig,
    tailwindcssConfig,
    // importConfig,
    turboConfig
];

// const config = {
//     extends: [
//         "next",
//         "turbo",
//         "next/core-web-vitals",
//         "plugin:import/recommended",
//         "plugin:import/typescript",
//         'plugin:@typescript-eslint/recommended',
//         "plugin:tailwindcss/recommended"
//     ],
//     overrides: [
//         {
//             files: ['*.ts', '*.tsx', '*.js']
//         },
//     ],
//     settings: {
//         "import/resolver": {
//             typescript: {
//                 project
//             }
//         }
//     },
//     rules: {
//         "@next/next/no-html-link-for-pages": "off",
//         "@typescript-eslint/no-inferrable-types": "error",
//         "@typescript-eslint/no-extra-semi": "error",
//         "@typescript-eslint/no-unused-vars": "error",
//         "@typescript-eslint/no-namespace": 0,
//     }
// };

// export default config;