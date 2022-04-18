import React from 'react';
import { ChildrenProps } from '../../src/sharedTypes';
import { PageNav } from '../PageNav';
import { PageNavSsr } from '../PageNavSsr';
import Footer from '../pages/Footer';

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
