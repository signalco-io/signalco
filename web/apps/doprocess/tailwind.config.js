import { baseConfig } from '@signalco/tailwindcss-config-signalco';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [baseConfig],
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
        '../../packages/ui-primitives/src/**/*.{ts,tsx}',
        '../../packages/cms-components-marketing/src/**/*.{ts,tsx}',
    ]
}
