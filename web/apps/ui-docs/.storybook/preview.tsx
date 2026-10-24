import storybookSignalcoTheme from './signalco-theme';
import { withThemeByClassName } from '@storybook/addon-themes';
import '!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css';
import '../styles/global.css';
import { Preview } from '@storybook/nextjs';

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
  ],

  tags: ['autodocs']
};

export default preview;