import TailwindTypography from '@tailwindcss/typography';
import { config } from '@signalco/ui-themes-minimal-app/config';

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    presets: [config],
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
        '../../packages/ui-primitives/src/**/*.{ts,tsx}',
        '../../packages/cms-components-marketing/src/**/*.{ts,tsx}',
    ],
    plugins: [
        TailwindTypography
    ]
}
