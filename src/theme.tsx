import { red } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export type AppTheme = "dark" | "light";

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

// Create a theme instance.
const theme = (isDark: boolean) => {
  return responsiveFontSizes(createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: isDark ? "#fff" : "#000",
        light: "#000",
        dark: "#fff"
      },
      secondary: {
        main: isDark ? "#000" : "#cccccc",
        light: "#fff",
        dark: "#000"
      },
      error: {
        main: red.A400,
      },
      background: {
        default: isDark ? "#000" : "#fff",
        paper: isDark ? "#121212" : "#eee"
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 400,
            "&.MuiButton-outlined": {
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)'
            },
            "&.MuiButton-outlined:hover": {
              backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
            }
          },
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined"
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
          variant: "outlined"
        },
        ...componentsTopLevelBorder
      },
      MuiCard: {
        defaultProps: {
          variant: "outlined"
        },
        ...componentsTopLevelBorder
      }
    },
    typography: {
      h1: {
        fontSize: "2rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
      },
      h3: {
        fontSize: "1.3rem",
      },
      h4: {
        fontSize: "1.2rem",
      },
      h5: {
        fontSize: "1.1rem",
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 400,
      }
    }
  }));
};

export default theme;
