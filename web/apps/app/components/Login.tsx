'use client';

import React, { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { useTimeout } from '@signalco/hooks/useTimeout';

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
