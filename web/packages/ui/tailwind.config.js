const { baseConfig } = require('@signalco/tailwindcss-config-signalco');

/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'uitw-',
    presets: [baseConfig],
    content: [
        './src/**/*.{ts,tsx}'
    ]
}
