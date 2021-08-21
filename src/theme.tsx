import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = (isDark: boolean) => {
  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#000",
        light: "#000",
        dark: "#fff"
      },
      secondary: {
        main: "#fff",
        light: "#fff",
        dark: "#000"
      },
      error: {
        main: red.A400,
      },
      background: {
        default: isDark ? "#000" : "#fff"
      },
    },
    components: {
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
