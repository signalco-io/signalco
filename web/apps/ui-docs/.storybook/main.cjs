module.exports = {
  "stories": ["../stories"],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-swc",
    "@storybook/addon-styling-webpack"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "docs": {
    "autodocs": true
  }
}
