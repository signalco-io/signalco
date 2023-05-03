import React from 'react';
import { ChildrenProps } from '@signalco/ui';

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
