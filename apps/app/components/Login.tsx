'use client';

import React, { useState } from 'react';
import {
    Button, Stack, Row
} from '@signalco/ui';
import { useTimeout } from '@signalco/hooks';

export default function Login() {
    const [isLong, setIsLong] = useState(false);
    useTimeout(() => setIsLong(true), 3000);

    return (
        <Row justifyContent="center" style={{ height: '100%' }}>
            <Stack spacing={2} alignItems="start">
                <p>
                    {isLong
                        ? 'Redirecting is taking a bit longer...'
                        : 'Redirecting...'}
                </p>
                <Button size="lg" href="/" style={{ display: isLong ? 'initial' : 'none' }}>Go home</Button>
            </Stack>
        </Row>
    );
}
