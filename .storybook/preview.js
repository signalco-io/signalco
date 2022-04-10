import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme';
import '../styles/global.scss';
import * as NextImage from 'next/image';
import { themes } from '@storybook/theming';
import { AppContext } from '../pages/_app';
import { withScreenshot } from 'storycap';
import { withPerformance } from 'storybook-addon-performance';

// Fix for getting next/image to work with Storybook
// Source link https://dev.to/jonasmerlin/how-to-use-the-next-js-image-component-in-storybook-1415
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
    configurable: true,
    value: (props) => (
        <OriginalNextImage {...props} unoptimized />
    )
});

// Integrating with the MUI by defining a global decorator
export const decorators = [
    withPerformance,
    withScreenshot,
    Story => (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme('light')}>
                <CssBaseline />
                <AppContext.Provider value={{ theme: 'light' }}>
                    <Story />
                </AppContext.Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    layout: 'fullscreen',
    docs: {
        theme: themes.dark
    },
    screenshot: {
        // Put global screenshot parameters(e.g. viewport). See: https://github.com/reg-viz/storycap
        delay: 1000
    }
}
