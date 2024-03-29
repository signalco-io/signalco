const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
export const baseConfig = {
    darkMode: ["class", '[class="dark"]'],
    content: [
        './src/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                tertiary: {
                    DEFAULT: "hsl(var(--tertiary))",
                    foreground: "hsl(var(--tertiary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                    transparent: "hsl(var(--card-transparent))",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans]
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                "scroll-reveal": {
                    '0%': { opacity: 0 },
                    '2%': { opacity: 1 },
                },
                'scroll': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-100%)' }
                }
            },
            aspectRatio: {
                card: '1.586/1'
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "scroll-overflow": "scroll-reveal 1ms linear",
                'scroll': "scroll 5s linear infinite"
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}

const appFontCoef = 0.875;
/** @type {import('tailwindcss').Config} */
export const appBaseConfig = {
    ...baseConfig,
    theme: {
        ...baseConfig.theme,
        // Reduce font size by to 0.875rem (14px)
        fontSize: {
            xs: [`${0.75 * appFontCoef}rem`, { lineHeight: `${1 * appFontCoef}rem` }],
            sm: [`${0.875 * appFontCoef}rem`, { lineHeight: `${1.25 * appFontCoef}rem` }],
            base: [`${1 * appFontCoef}rem`, { lineHeight: `${1.5 * appFontCoef}rem` }],
            lg: [`${1.125 * appFontCoef}rem`, { lineHeight: `${1.75 * appFontCoef}rem` }],
            xl: [`${1.25 * appFontCoef}rem`, { lineHeight: `${1.75 * appFontCoef}rem` }],
            '2xl': [`${1.5 * appFontCoef}rem`, { lineHeight: `${2 * appFontCoef}rem` }],
            '3xl': [`${1.875 * appFontCoef}rem`, { lineHeight: `${2.25 * appFontCoef}rem` }],
            '4xl': [`${2.25 * appFontCoef}rem`, { lineHeight: `${2.5 * appFontCoef}rem` }],
            '5xl': [`${3 * appFontCoef}rem`, { lineHeight: '1' }],
            '6xl': [`${3.75 * appFontCoef}rem`, { lineHeight: '1' }],
            '7xl': [`${4.5 * appFontCoef}rem`, { lineHeight: '1' }],
            '8xl': [`${6 * appFontCoef}rem`, { lineHeight: '1' }],
            '9xl': [`${8 * appFontCoef}rem`, { lineHeight: '1' }],
        }
    }
};
