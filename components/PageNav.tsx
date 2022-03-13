import React from "react";
import useWindowRect from "../src/hooks/useWindowRect";
import { PageNavSsr } from "./PageNavSsr";


export function PageNav(props: { fullWidth?: boolean | undefined; }) {
    var rect = useWindowRect();
    return <PageNavSsr fullWidth={props.fullWidth} isScrolled={(rect?.scrollY || 0) > 0} />;
}
