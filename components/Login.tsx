import {
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Box,
} from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Grid
      container
      className="login__root"
      spacing={4}
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <img
              alt="Logo"
              src="/images/icon-72x72.png"
              width="72"
              height="72"
            />
          </Grid>
          <Grid item>
            <Typography variant="h1">Signal</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Box width={235}>
          <Button
            onClick={() => loginWithRedirect()}
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
