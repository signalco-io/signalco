import React, { PropsWithChildren } from 'react';
import { PageNav } from '@signalco/ui/Nav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav logo="BrandGrab.io" />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
        </>
    );
}
