import { withScreenshot } from 'storycap';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import appTheme from '../src/theme';
import '../styles/global.scss';
import { themes } from '@storybook/theming';
import DateTimeProvider from '../src/services/DateTimeProvider';

DateTimeProvider.staticDateTime = new Date(2022, 5, 1, 10, 9, 36);
const queryClient = new QueryClient();

// Integrating with the MUI by defining a global decorator
export const decorators = [
    withScreenshot,
    Story => (
        <CssVarsProvider theme={appTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <Story />
            </QueryClientProvider>
        </CssVarsProvider>
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
