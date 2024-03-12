import storybookSignalcoTheme from './signalco-theme';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../stories/styles.css';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: storybookSignalcoTheme
  }
}

export const decorators = [
  (Story) => (
    <>
      {Story()}
    </>
  ),
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark'
    },
    defaultTheme: 'dark',
  }),
];
