import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#000",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#000",
    },
  },
  typography: {
    h1: {
      fontSize: "2rem",
      fontFamily: "Raleway, Open Sans, sans-serif",
      fontWeight: 400,
    },
    h2: {
      fontSize: "1.6rem",
      fontFamily: "Raleway, Open Sans, sans-serif",
      fontWeight: 400,
    },
    h3: {
      fontSize: "1.4rem",
      fontFamily: "Raleway, Open Sans, sans-serif",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.2rem",
      fontFamily: "Raleway, Open Sans, sans-serif",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.1rem",
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
