import { Config } from 'tailwindcss';
import { baseConfig } from './baseConfig';

const appFontCoef = 0.875;

export const appBaseConfig: Config = {
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