import { ChildrenProps } from '@signalco/ui';
import React from 'react';

export function EmptyLayout(props: ChildrenProps) {
    const {
        children
    } = props;

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            {children}
        </div>
    );
}
