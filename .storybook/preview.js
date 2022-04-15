import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme';
import '../styles/global.scss';
import { themes } from '@storybook/theming';
import { AppContext } from '../pages/_app';
import { withScreenshot } from 'storycap';
import { withPerformance } from 'storybook-addon-performance';
import { DateTimeProvider } from '../src/services/DateTimeProvider';

const newStaticDate = new Date();
newStaticDate.setUTCFullYear(2022);
newStaticDate.setUTCMonth(5);
newStaticDate.setUTCDate(1);
newStaticDate.setUTCHours(10);
newStaticDate.setUTCMinutes(9);
newStaticDate.setUTCSeconds(36);
newStaticDate.setUTCMilliseconds(0);
DateTimeProvider.staticDateTime = newStaticDate;

// Integrating with the MUI by defining a global decorator
export const decorators = [
    withPerformance,
    withScreenshot,
    Story => (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme('dark')}>
                <CssBaseline />
                <AppContext.Provider value={{
                    theme: 'dark',
                    setTheme: () => { },
                    isDark: true
                }}>
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
