import React from 'react';
import { Spinner } from '@signalco/ui-primitives/Spinner';

export function WidgetSpinner({ isLoading }: { isLoading: boolean; }) {
    if (!isLoading)
        return null;

    return (
        <div className="absolute right-4 top-4">
            <Spinner loading className="size-6" loadingLabel="Loading..." />
        </div>
    );
}
