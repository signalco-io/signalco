import { useAuth0 } from "@auth0/auth0-react";
import {
  Box, Button, Grid, Typography
} from "@material-ui/core";
import { useEffect, useRef } from "react";
import RippleIndicator, { IRippleIndicatorRef } from "./shared/indicators/RippleIndicator";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const rippleTriggerRef = useRef<IRippleIndicatorRef>();

  useEffect(() => {
    const rippleIntervalClear = setInterval(() => {
      if (typeof rippleTriggerRef.current !== 'undefined') {
        rippleTriggerRef.current.trigger();
      }
    }, 2500);
    return () => clearInterval(rippleIntervalClear);
  }, [])

  return (
    <Grid
      container
      className="login__root"
      wrap="nowrap"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>
            <RippleIndicator size={72} ref={rippleTriggerRef} />
          </Grid>
          <Grid item>
            <Typography variant="h1">Signal</Typography>
          </Grid>
          <Grid item>
            <Box width={72} height={72}></Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Box sx={{ width: 315, pt: 4 }}>
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
