import React from 'react';
import { PageNavSsr } from './PageNavSsr';
import useWindowRect from '../src/hooks/useWindowRect';


export function PageNav(props: { fullWidth?: boolean | undefined; }) {
    var rect = useWindowRect();
    return <PageNavSsr fullWidth={props.fullWidth} isScrolled={(rect?.scrollY || 0) > 0} />;
}
