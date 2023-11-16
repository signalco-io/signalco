const { baseConfig } = require('@signalco/tailwindcss-config-signalco');

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    'stories/**/*.stories.{tsx,ts}'
  ]
}
