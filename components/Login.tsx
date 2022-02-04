import {
  Button, Stack, Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { AppContext } from "../pages/_app";
import SignalcoLogo from "./icons/SignalcoLogo";

const Login = () => {
  const [isLong, setIsLong] = useState(false);
  const appState = useContext(AppContext);
  useEffect(() => {
    const token = setTimeout(() => {
      setIsLong(true);
    }, 3000);

    return () => clearTimeout(token);
  }, []);

  return (
    <Stack justifyContent="center" direction="row" sx={{ height: '100%' }}>
      <Stack sx={{ px: '20%' }} spacing={2} justifyContent="center" alignItems="center">
        <SignalcoLogo priority width={256} />
        {isLong
          ? <Stack spacing={2}>
            <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting is taking a bit longer...</Typography>
            <Link href="/" passHref><Button variant="text" size="large">Go home</Button></Link>
          </Stack>
          : <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting...</Typography>}
      </Stack>
    </Stack>
  );
};

export default Login;
