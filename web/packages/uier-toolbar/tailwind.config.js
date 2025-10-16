import { config } from '@signalco/ui-themes-minimal/config';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [config],
    content: [
        './src/**/*.{ts,tsx}',
        '../ui/src/**/*.{ts,tsx}',
        '../ui-primitives/src/**/*.{ts,tsx}'
    ]
}
