import storybookSignalcoTheme from './signalco-theme';
import '@signalco/ui/dist/index.css';

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
    <>
      {Story()}
    </>
  )
];
