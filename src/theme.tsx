import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import {
  extendTheme as extendJoyTheme,
} from '@mui/joy/styles';

export type AppThemeMode = 'system' | 'manual' | 'sunriseSunset' | 'timeRange';

// const componentsTopLevelBorder = {
//   styleOverrides: {
//     root: {
//       borderRadius: '8px'
//     }
//   }
// }

// const componentInPageBorder = {
//   styleOverrides: {
//     root: {
//       borderRadius: '4px'
//     }
//   }
// }

const theme = () => {
  //   const createdTheme = createTheme({
  //     palette: {
  //       mode: isDark ? 'dark' : 'light',
  //       primary: {
  //         main: primary,
  //         light: primaryLight,
  //         dark: primaryDark
  //       },
  //       secondary: {
  //         main: secondary,
  //         light: primaryLight,
  //         dark: secondaryDark
  //       },
  //       error: {
  //         main: red.A400,
  //       },
  //       background: {
  //         default: background,
  //         paper: paper
  //       },
  //     },
  //   });

  //   switch (theme) {
  //     case 'darkDimmed':
  //       primaryDark = '#fff';
  //       secondaryDark = '#000';
  //       background = 'rgba(32,31,30,1)';
  //       paper = 'rgba(50,49,48,1)';
  //       break;
  //   }

  //   const primaryLight = '#000';
  //   const secondaryLight = '#cccccc';
  //   const primary = isDark ? primaryDark : primaryLight;
  //   const secondary = isDark ? secondaryDark : secondaryLight;


  const createdTheme = extendMuiTheme({
    cssVarPrefix: 'joy',
    colorSchemes: {
      dark: {
        palette: {
          primary: {
            main: '#fff',
            light: '#000',
            dark: '#fff'
          },
          secondary: {
            main: '#000',
            light: '#000',
            dark: '#000'
          },
          error: {
            main: red.A400,
          },
          background: {
            default: '#000',
            paper: '#121212'
          },
        },
      },
      light: {
        palette: {
          primary: {
            main: '#000',
            light: '#fff',
            dark: '#000'
          },
          secondary: {
            main: '#fff',
            light: '#fff',
            dark: '#fff'
          },
          error: {
            main: red.A400,
          },
          background: {
            default: '#fff',
            paper: '#eee'
          },
        },
      }
    },
    // components: {
    //   MuiButton: {
    //     styleOverrides: {
    //       root: ({ theme }) => ({
    //         textTransform: 'none',
    //         fontWeight: 400,
    //         '&.MuiButton-outlined': {
    //           backgroundColor: 'rgba(0,0,0,0.08)',
    //           border: '1px solid rgba(0,0,0,0.04)',
    //           [theme.getColorSchemeSelector('dark')]: {
    //             backgroundColor: 'rgba(255,255,255,0.15)',
    //             border: '1px solid rgba(255,255,255,0.05)'
    //           }
    //         },
    //         '&.MuiButton-outlined:hover': {
    //           backgroundColor: 'rgba(0,0,0,0.12)',
    //           border: '1px solid rgba(0,0,0,0.1)',
    //           [theme.getColorSchemeSelector('dark')]: {
    //             border: '1px solid rgba(255,255,255,0.1)',
    //             backgroundColor: 'rgba(255,255,255,0.2)'
    //           }
    //         },
    //         '&.MuiButton-contained:hover': {
    //           backgroundColor: 'rgba(0,0,0,0.7)',
    //           [theme.getColorSchemeSelector('dark')]: {
    //             backgroundColor: 'rgba(255,255,255,0.8)'
    //           }
    //         }
    //       }),
    //     }
    //   },
    //   MuiTextField: {
    //     defaultProps: {
    //       variant: 'outlined'
    //     }
    //   },
    //   MuiFilledInput: {
    //     defaultProps: {
    //       disableUnderline: true
    //     },
    //     ...componentInPageBorder
    //   },
    //   MuiPaper: {
    //     defaultProps: {
    //       variant: 'outlined'
    //     },
    //     ...componentsTopLevelBorder
    //   },
    //   MuiCard: {
    //     defaultProps: {
    //       variant: 'outlined'
    //     },
    //     ...componentsTopLevelBorder
    //   }
    // },
    // typography: {
    //   h1: {
    //     fontSize: '2rem',
    //     fontFamily: 'Raleway, Open Sans, sans-serif',
    //     fontWeight: 400,
    //   },
    //   h2: {
    //     fontSize: '1.4rem',
    //     fontWeight: 400,
    //   },
    //   h3: {
    //     fontSize: '1.3rem',
    //   },
    //   h4: {
    //     fontSize: '1.2rem',
    //   },
    //   h5: {
    //     fontSize: '1.1rem',
    //   },
    //   h6: {
    //     fontSize: '1rem',
    //     fontWeight: 400,
    //   }
    // }
  });

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
