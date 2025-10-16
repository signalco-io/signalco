import { config } from '@signalco/ui-themes-minimal/config';
const path = require("path")

/** @type {import('tailwindcss').Config} */
export default {
  presets: [config],
  content: [
    './**/*.stories.{js,jsx,tsx,ts}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/ui-primitives/src/**/*.{ts,tsx}',
    '../../packages/cms-components-marketing/src/**/*.{ts,tsx}',
  ]
}
