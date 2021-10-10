import {
  Box, Button, Stack, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import RippleIndicator from "./shared/indicators/RippleIndicator";

const Login = () => {
  const [isLong, setIsLong] = useState(false);
  useEffect(() => {
    const token = setTimeout(() => {
      setIsLong(true);
    }, 3000);

    return () => clearTimeout(token);
  }, []);

  return (
    <Stack sx={{
      position: 'absolute',
      top: 'calc(50% - 36px)',
      left: 'calc(50% - 150px)'
    }} spacing={2} alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <RippleIndicator size={72} />
        <Typography variant="h1">Signalco</Typography>
        <Box sx={{ width: 72, height: 72 }}></Box>
      </Stack>
      {isLong
        ? <Stack spacing={1}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting is taking a bit longer...</Typography>
          <Link href="/" passHref><Button variant="text">Go back</Button></Link>
        </Stack>
        : <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting...</Typography>
      }
    </Stack>
  );
};

export default Login;
