import React, { PropsWithChildren, Suspense } from 'react';
import { PageNav } from '@signalco/ui/Nav';
import InputGrabDomain from '../InputGrabDomain';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav fullWidth logo="BrandGrab.io">
                <Suspense>
                    <InputGrabDomain />
                </Suspense>
            </PageNav>
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
        </>
    );
}
