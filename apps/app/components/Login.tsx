import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button, Typography, Stack, Row
} from '@signalco/ui';
import SignalcoLogotype from './icons/SignalcoLogotype';
import useTimeout from '../src/hooks/useTimeout';

function Login() {
  const [isLong, setIsLong] = useState(false);
  useTimeout(() => setIsLong(true), 3000);

  return (
    <Row justifyContent="center" style={{ height: '100%' }}>
      <Stack style={{ paddingLeft: '20%', paddingRight: '20%' }} spacing={2} justifyContent="center" alignItems="center">
        <SignalcoLogotype width={256} />
        {isLong
          ? <Stack spacing={2}>
            <Typography level="body2">Redirecting is taking a bit longer...</Typography>
            <Link href="/" passHref>
              <Button size="lg">Go home</Button>
            </Link>
          </Stack>
          : <Typography level="body2">Redirecting...</Typography>}
      </Stack>
    </Row>
  );
}

export default Login;
