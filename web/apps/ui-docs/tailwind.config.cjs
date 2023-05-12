const baseConfig = require('@signalco/ui/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [baseConfig],
  content: [
    ...baseConfig.content,
    '.storybook/decorators.jsx',
    'stories/*.stories.{jsx,tsx}'
  ]
}