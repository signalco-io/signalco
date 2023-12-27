import React, { PropsWithChildren } from 'react';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <>
            <PageNav fullWidth />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
        </>
    );
}
