'use client';
import { PropsWithChildren } from 'react';
import { Row } from '@signalco/ui/dist/Row';

export function Toolbar({ children }: PropsWithChildren) {
    return (
        <Row className="p-2">
            <div className="grow"></div>
            {children}
        </Row>
    );
}
