'use client';

import React, { useState } from 'react';
import { cx } from 'classix';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Button } from '@signalco/ui/dist/Button';
import { useTimeout } from '@signalco/hooks/dist/useTimeout';

export default function Login() {
    const [isLong, setIsLong] = useState(false);
    useTimeout(() => setIsLong(true), 3000);

    return (
        <Row justifyContent="center" className="h-full">
            <Stack spacing={2} alignItems="start">
                <p>
                    {isLong
                        ? 'Redirecting is taking a bit longer...'
                        : 'Redirecting...'}
                </p>
                <Button size="lg" href="/" className={cx(!isLong && 'hidden')}>Go home</Button>
            </Stack>
        </Row>
    );
}
