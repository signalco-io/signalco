import {
  Button, Stack, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { AppContext } from "../pages/_app";
import Image from 'next/image';

const Login = () => {
  const [isLong, setIsLong] = useState(false);
  useEffect(() => {
    const token = setTimeout(() => {
      setIsLong(true);
    }, 3000);

    return () => clearTimeout(token);
  }, []);

  return (
    <AppContext.Consumer>
      {appState => (
        <Stack sx={{
          position: 'absolute',
          top: 'calc(50% - 72px)',
          left: 'calc(50% - 256px)'
        }} spacing={2}>
          <Image src={appState.theme === 'light' ? "/images/icon-light-512x512.png" : "/images/icon-dark-512x144.png"} alt="Signalco logo" layout="fixed" width={512} height={144} />
          {isLong
            ? <Stack spacing={2}>
              <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting is taking a bit longer...</Typography>
              <Link href="/" passHref><Button variant="text" size="large">Go back</Button></Link>
            </Stack>
            : <Typography variant="subtitle2" color="textSecondary" fontWeight="light">Redirecting...</Typography>
          }
        </Stack>
      )}
    </AppContext.Consumer>
  );
};

export default Login;
