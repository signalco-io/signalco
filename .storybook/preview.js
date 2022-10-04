import { withScreenshot } from 'storycap';
import React from 'react';
import theme from '../src/theme';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import '../styles/global.scss';
import { themes } from '@storybook/theming';
import { DateTimeProvider } from '../src/services/DateTimeProvider';
import { ThemeContext } from '../pages/_app';

DateTimeProvider.staticDateTime = new Date(2022, 5, 1, 10, 9, 36);

// Integrating with the MUI by defining a global decorator
export const decorators = [
    withScreenshot,
    Story => (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme('dark')}>
                <ThemeContext.Provider value={{ isDark: true, theme: 'dark' }}>
                    <CssBaseline />
                    <Story />
                </ThemeContext.Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
