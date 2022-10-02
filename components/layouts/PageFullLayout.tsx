import React from 'react';
import Footer from '../pages/Footer';
import { PageNavSsr } from '../PageNavSsr';
import { PageNav } from '../PageNav';
import { ChildrenProps } from '../../src/sharedTypes';

export function PageFullLayout(props: ChildrenProps) {
    const Nav = typeof window !== 'undefined' ? PageNav : PageNavSsr;

    return (
        <div>
            <Nav fullWidth />
            <>
                {props.children}
            </>
            <Footer />
        </div>);
}
