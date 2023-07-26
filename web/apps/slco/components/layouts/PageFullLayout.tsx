'use client';

import { PropsWithChildren } from 'react';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav fullWidth />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
            <Footer />
        </>
    );
}
