import { config } from '@signalco/ui-themes-minimal/config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [config],
  content: [
    './stories/**/*.stories.{tsx,ts}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/ui-primitives/src/**/*.{ts,tsx}',
    '../../packages/cms-components-marketing/src/**/*.{ts,tsx}',
  ]
}
