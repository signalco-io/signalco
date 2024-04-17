// NOTE: Not actualy used, but here to enable tailwindcss IDE support

import { baseConfig } from '@signalco/tailwindcss-config-signalco';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [baseConfig],
    content: [
        './src/**/*.{ts,tsx}'
    ]
}
