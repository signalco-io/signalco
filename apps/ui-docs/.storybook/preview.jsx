import { CssVarsProvider, CssBaseline, signalcoTheme } from '@signalco/ui';
import storybookSignalcoTheme from './signalco-theme';
import '@signalco/ui/dist/ui.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
    <CssVarsProvider theme={signalcoTheme} defaultMode='dark'>
      <CssBaseline />
      {Story()}
    </CssVarsProvider>
  )
];
