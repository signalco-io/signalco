import { appBaseConfig } from '@signalco/tailwindcss-config-signalco';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [appBaseConfig],
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
        '../../packages/ui-primitives/src/**/*.{ts,tsx}'
    ]
}
