import {
  Box, Stack, Typography
} from "@mui/material";
import React from "react";
import RippleIndicator from "./shared/indicators/RippleIndicator";

const Login = () => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{
      position: 'absolute',
      top: 'calc(50% - 36px)',
      left: 'calc(50% - 150px)'
    }}>
      <RippleIndicator size={72} />
      <Typography variant="h1">Signalco</Typography>
      <Box sx={{ width: 72, height: 72 }}></Box>
    </Stack>
  );
};

export default Login;
