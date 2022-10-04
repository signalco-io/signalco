import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export type AppThemeMode = 'manual' | 'sunriseSunset' | 'timeRange';

export type AppTheme = 'dark' | 'darkDimmed' | 'light';

const componentsTopLevelBorder = {
  styleOverrides: {
    root: {
      borderRadius: '8px'
    }
  }
}

const componentInPageBorder = {
  styleOverrides: {
    root: {
      borderRadius: '4px'
    }
  }
}

const theme = (_theme: AppTheme) => {
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


  const createdTheme = extendTheme({
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
            default: '#fff',
            paper: '#eee'
          },
        },
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            fontWeight: 400,
            '&.MuiButton-outlined': {
              backgroundColor: 'rgba(0,0,0,0.08)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(255,255,255,0.15)'
              },
              border: '1px solid rgba(0,0,0,0.04)',
              [theme.getColorSchemeSelector('dark')]: {
                border: '1px solid rgba(255,255,255,0.05)'
              }
            },
            '&.MuiButton-outlined:hover': {
              backgroundColor: 'rgba(0,0,0,0.12)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(255,255,255,0.2)'
              },
              border: '1px solid rgba(0,0,0,0.1)',
              [theme.getColorSchemeSelector('dark')]: {
                border: '1px solid rgba(255,255,255,0.1)'
              }
            },
            '&.MuiButton-contained:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(255,255,255,0.8)'
              }
            }
          }),
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined'
        }
      },
      MuiFilledInput: {
        defaultProps: {
          disableUnderline: true
        },
        ...componentInPageBorder
      },
      MuiPaper: {
        defaultProps: {
          variant: 'outlined'
        },
        ...componentsTopLevelBorder
      },
      MuiCard: {
        defaultProps: {
          variant: 'outlined'
        },
        ...componentsTopLevelBorder
      }
    },
    typography: {
      h1: {
        fontSize: '2rem',
        fontFamily: 'Raleway, Open Sans, sans-serif',
        fontWeight: 400,
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
      },
      h3: {
        fontSize: '1.3rem',
      },
      h4: {
        fontSize: '1.2rem',
      },
      h5: {
        fontSize: '1.1rem',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 400,
      }
    }
  });

  return createdTheme;
};

export default theme;
