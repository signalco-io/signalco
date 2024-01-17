'use client';

import React from 'react';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Minimize } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';

export function FullScreenExitButton() {
    const [isFullScreen, setFullScreen] = useSearchParam('fullscreen');

    if (isFullScreen !== 'true') {
        return null;
    }

    return (
        <div className="fixed bottom-3 right-3">
            <IconButton
                variant="plain"
                className="rounded-full text-muted-foreground"
                size="lg"
                title="Exit fullscreen"
                onClick={() => setFullScreen(undefined)}>
                <Minimize />
            </IconButton>
        </div>
    );
}
