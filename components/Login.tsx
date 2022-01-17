import {
  Button, Stack, Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { AppContext } from "../pages/_app";
import Image from 'next/image';
import logoLight from '../public/images/icon-light-512x512.png';
import logoDark from '../public/images/icon-dark-512x144.png';

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
    <Stack sx={{
      position: 'absolute',
      top: 'calc(50% - 72px)',
      left: 'calc(50% - 256px)',
      px: '20%'
    }} spacing={2}>
      <Image
        src={appState.theme === 'light' ? logoLight : logoDark}
        alt="Signalco logo"
        priority />
      {isLong
        ? <Stack spacing={2}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting is taking a bit longer...</Typography>
          <Link href="/" passHref><Button variant="text" size="large">Go back</Button></Link>
        </Stack>
        : <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting...</Typography>
      }
    </Stack>
  );
};

export default Login;
