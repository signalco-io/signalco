import { CssVarsProvider, CssBaseline, extendTheme } from '@signalco/ui';
import signalcoTheme from './signalco-theme';
import '@signalco/ui/dist/ui.css';

const theme = extendTheme({});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: signalcoTheme
  }
}

export const decorators = [
  (Story) => (
    <CssVarsProvider theme={theme} defaultMode='dark'>
      <CssBaseline />
      {Story()}
    </CssVarsProvider>
  )
];
