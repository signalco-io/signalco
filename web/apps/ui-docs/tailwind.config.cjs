const { baseConfig } = require('@signalco/tailwindcss-config-signalco');

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    './stories/**/*.stories.{tsx,ts}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/ui-primitives/src/**/*.{ts,tsx}'
  ]
}
