import { extendTheme } from '@signalco/ui';
import zincColor from './colors/zinc';
import neutralColor from './colors/neutral';

export type AppThemeMode = 'system' | 'manual' | 'sunriseSunset' | 'timeRange';

const joyTheme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: zincColor,
                neutral: neutralColor,
                background: {
                    // body: 'var(--joy-palette-primary-900)',
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
                    body: 'var(--joy-palette-primary-50)',
                    //surface: '#ffffff',
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

export default joyTheme;
