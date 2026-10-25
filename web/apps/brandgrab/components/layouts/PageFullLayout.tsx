import React, { PropsWithChildren } from 'react';
import { PageNav } from '@signalco/ui/Nav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav logo="BrandGrab.io" />
            <main style={{ paddingTop: '80px' }}>
                {props.children}
            </main>
        </>
    );
}
