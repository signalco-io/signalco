import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: "dark",
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
    fontSize: 12,
    h1: {
      fontSize: "3rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
    h2: {
      fontSize: "2rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
    h3: {
      fontSize: "1.6rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.2rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.1rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1rem",
      fontFamily: "Raleway",
      fontWeight: 400,
    },
  },
});

export default theme;
