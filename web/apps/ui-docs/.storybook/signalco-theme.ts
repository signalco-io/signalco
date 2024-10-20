import { create } from '@storybook/theming/create';
export type ThemeVars = ReturnType<typeof create>;
export default create({
    base: 'dark',
    brandTitle: 'signalco UI',
    brandUrl: 'https://ui.signalco.io',
    brandImage: 'https://www.signalco.io/LogotypeDark.png',
    brandTarget: '_self',
}) as ThemeVars;