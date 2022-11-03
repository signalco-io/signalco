import { extendTheme } from '@mui/joy/styles';

export type AppThemeMode = 'system' | 'manual' | 'sunriseSunset' | 'timeRange';

const zincColor = {
  '50': '#f9fafb',
  '100': '#f4f4f5',
  '200': '#e4e4e7',
  '300': '#d4d4d8',
  '400': '#a1a1aa',
  '500': '#71717a',
  '600': '#52525b',
  '700': '#3f3f46',
  '800': '#27272a',
  '900': '#18181b'
}

const neutralColor = {
  '50': '#f9fafb',
  '100': '#f4f4f5',
  '200': '#e4e4e7',
  '300': '#d4d4d8',
  '400': '#a1a1aa',
  '500': '#71717a',
  '600': '#52525b',
  '700': '#3f3f46',
  '800': '#27272a',
  '900': '#18181b'
}

const theme = () => {
  const joyTheme = extendTheme({
    colorSchemes: {
      dark: {
        palette: {
          primary: zincColor,
          neutral: neutralColor,
          background: {
            body: 'var(--joy-palette-primary-900)',
            //surface: 'var(--joy-palette-primary-900)',
            level1: '#00ff00',
            level2: '#00ffff',
            level3: '#0000ff',
            // backdrop: '#ff00ff',
            tooltip: '#f0f0f0'
          }
        }
      },
      light: {
        palette: {
          primary: zincColor,
          neutral: neutralColor,
          background: {
            body: 'var(--joy-palette-primary-100)',
            // surface: '#ffffff',
            level1: '#00ff00',
            level2: '#00ffff',
            level3: '#0000ff',
            // backdrop: '#ff00ff',
            tooltip: '#f0f0f0'
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
      JoyCard: {
        defaultProps: {
          variant: 'outlined'
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

  return joyTheme;
};

const rootTheme = theme();

export default rootTheme;
