import { appBaseConfig } from '@signalco/tailwindcss-config-signalco';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [appBaseConfig],
    content: [
        './src/**/*.{ts,tsx}',
        '../ui/src/**/*.{ts,tsx}',
        '../ui-primitives/src/**/*.{ts,tsx}'
    ]
}
