import storybookSignalcoTheme from './signalco-theme';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../global.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: storybookSignalcoTheme
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'dark',
    }),
  ]
};

export default preview;