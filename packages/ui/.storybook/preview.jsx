import { CssVarsProvider, CssBaseline, extendTheme } from '../src/index';

const theme = extendTheme({});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {Story()}
    </CssVarsProvider>
  )
];
