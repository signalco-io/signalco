import storybookSignalcoTheme from './signalco-theme';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../global.css';
import { Preview } from '@storybook/react';

const preview: Preview = {
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
    })
  ]
};

export default preview;