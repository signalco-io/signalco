import React from "react";
import { ChildrenProps } from "../src/sharedTypes";
import Footer from "./pages/Footer";
import { PageNavSsr } from "./PageNavSsr";
import { PageNav } from "./PageNav";


export function PageFullLayout(props: ChildrenProps) {
    const Nav = typeof window !== 'undefined' ? PageNav : PageNavSsr;

    return (
        <div>
            <Nav fullWidth />
            <div>
                {props.children}
            </div>
            <Footer />
        </div>);
}
