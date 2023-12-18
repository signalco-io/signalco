const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "eslint-config-turbo",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["only-warn", "@typescript-eslint"],
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project
      },
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
    "indent": [
      "error",
      4
    ],
    "quotes": [
      "error",
      "single"
    ],
    "comma-dangle": [
      "warn",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline"
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "import/no-unresolved": 0,
    "import/no-absolute-path": 0
  }
};
