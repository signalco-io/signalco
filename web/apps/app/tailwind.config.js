import { config } from '@signalco/ui-themes-minimal-app/config';

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    presets: [config],
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        '../../packages/ui/src/**/*.{ts,tsx}',
        '../../packages/ui-primitives/src/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            keyframes: {
                'wave': {
                    '0%': { transform: 'translateX(25%)' },
                    '50%': { transform: 'translateX(-25%)' },
                    '100%': { transform: 'translateX(-50%)' }
                }
            },
            animation: {
                'wave1': 'wave 10s -3s linear alternate infinite',
                'wave2': 'wave 18s linear alternate-reverse infinite',
                'wave3': 'wave 20s -1s linear alternate infinite'
            }
        }
    }
}
