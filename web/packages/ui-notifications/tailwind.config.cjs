// NOTE: Not actualy used, but here to enable tailwindcss IDE support

import { baseConfig } from '@signalco/tailwindcss-config-signalco/baseConfig';

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    presets: [baseConfig],
    content: [
        './src/**/*.{ts,tsx}'
    ]
}
