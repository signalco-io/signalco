import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

// Create a theme instance.
const theme = (isDark: boolean) => {
  return createTheme({
    breakpoints: {
      keys: ["mobile", "tablet", "laptop", "desktop"],
      values: {
        mobile: 320,
        tablet: 640,
        laptop: 1024,
        desktop: 1200,
      },
    },
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
            textTransform: 'none'
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined"
        }
      },
      MuiPaper: {
        defaultProps: {
          variant: "outlined"
        },
        styleOverrides: {
          root: {
            borderRadius: '8px'
          }
        }
      },
      MuiCard: {
        defaultProps: {
          variant: "outlined"
        }
      }
    },
    typography: {
      h1: {
        fontSize: "2rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h2: {
        fontSize: "1.2rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h3: {
        fontSize: "1rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h4: {
        fontSize: "1rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h5: {
        fontSize: "1rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
      h6: {
        fontSize: "1rem",
        fontFamily: "Raleway, Open Sans, sans-serif",
        fontWeight: 400,
      },
    }
  });
};

export default theme;
