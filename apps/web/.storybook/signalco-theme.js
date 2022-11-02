import { create } from '@storybook/theming';

export default create({
    base: 'dark',

    colorPrimary: 'white',
    colorSecondary: '#666',

    // // UI
    appBg: '#121212',
    //appContentBg: 'white',
    // appBorderColor: 'grey',
    appBorderRadius: 8,

    // Typography
    fontBase: '"Roboto","Helvetica","Arial",sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: '#eaeaea',
    textInverseColor: 'red',

    // // Toolbar default and active colors
    // barTextColor: 'silver',
    barSelectedColor: 'white',
    // barBg: 'black',

    // // Form colors
    // inputBg: 'white',
    // inputBorder: 'silver',
    // inputTextColor: 'black',
    // inputBorderRadius: 8,

    brandTitle: 'signalco',
    brandUrl: 'https://www.signalco.io',
    brandImage: 'https://www.signalco.io/images/icon-dark-512x144.png',
});
