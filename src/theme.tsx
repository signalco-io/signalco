import {
  extendTheme as extendJoyTheme,
} from '@mui/joy/styles';

export type AppThemeMode = 'system' | 'manual' | 'sunriseSunset' | 'timeRange';

const theme = () => {
  const joyTheme = extendJoyTheme({
    colorSchemes: {
      dark: {
        palette: {
          primary: { // zinc
            '50': '#f9fafb',
            '100': '#f4f4f5',
            '200': '#e4e4e7',
            '300': '#d4d4d8',
            '400': '#a1a1aa',
            '500': '#71717a',
            '600': '#52525b',
            '700': '#3f3f46',
            '800': '#27272a',
            '900': '#18181b',
          },
          background: {
            body: '#131313',
            surface: '#000000',
            level1: '#00ff00',
            level2: '#00ffff',
            level3: '#0000ff',
            // backdrop: '#ff00ff',
            tooltip: '#f0f0f0'
          },
          neutral: {
            '50': '#f9fafb',
            '100': '#f4f4f5',
            '200': '#e4e4e7',
            '300': '#d4d4d8',
            '400': '#a1a1aa',
            '500': '#71717a',
            '600': '#52525b',
            '700': '#3f3f46',
            '800': '#27272a',
            '900': '#18181b',
          }
        }
      }
    },
    components: {
      JoyIconButton: {
        defaultProps: {
          color: 'neutral',
          variant: 'plain'
        }
      },
      JoySheet: {
        defaultProps: {
          variant: 'soft',
          color: 'neutral'
        }
      },
      JoyButton: {
        defaultProps: {
          variant: 'soft',
          color: 'neutral'
        }
      },
      JoyTextField: {
        defaultProps: {
          variant: 'soft',
          color: 'neutral'
        }
      },
      JoyCircularProgress: {
        defaultProps: {
          color: 'neutral'
        }
      },
      JoySwitch: {
        defaultProps: {
          color: 'neutral'
        }
      },
      JoyChip: {
        defaultProps: {
          color: 'neutral',
          variant: 'soft'
        }
      }
    }
  });

  const finalTheme = joyTheme;//deepmerge(joyTheme, createdTheme);

  return finalTheme;
};

export default theme;
