const { baseConfig } = require('@signalco/tailwindcss-config-signalco');

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    '.storybook/decorators.jsx',
    'stories/*.stories.{jsx,tsx}'
  ]
}
