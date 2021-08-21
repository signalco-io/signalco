import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000",//"#fff",
    },
    secondary: {
      main: "#fff",//"#000",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",//"#000"
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
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

export default theme;
