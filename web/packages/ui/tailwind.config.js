const { baseConfig } = require("@signalco/tailwindcss-config-signalco");

/** @type {import('tailwindcss').Config} */
export default {
    presets: [baseConfig],
    content: [
        './src/**/*.{ts,tsx}'
    ]
}
