import { CssVarsProvider, CssBaseline } from '@signalco/ui';
import { buildSignalcoTheme } from '@signalco/ui/dist/theme';
import storybookSignalcoTheme from './signalco-theme';
import '@signalco/ui/dist/index.css';

const signalcoTheme = buildSignalcoTheme();

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
