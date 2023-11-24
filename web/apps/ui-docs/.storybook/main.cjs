const {
  dirname,
  join
} = require("path");

module.exports = {
  "stories": ["../stories"],
  "addons": [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("storybook-addon-swc"),
    getAbsolutePath("@storybook/addon-styling-webpack")
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "docs": {
    "autodocs": true
  }
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
