import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: 'black',
  colorSecondary: 'black',

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: 'grey',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Roboto","Helvetica","Arial",sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'white',
  barBg: 'black',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 8,

  brandTitle: 'signalco',
  brandUrl: 'https://www.signalco.io',
  brandImage: 'https://www.signalco.io/images/icon-light-512x512.png',
});