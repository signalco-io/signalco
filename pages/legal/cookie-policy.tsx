import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '../../components/layouts/mdxComponents';
import CookiePolicyMdx from './cookie-policy-content.mdx';

export default function CookiePolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <CookiePolicyMdx />
        </MDXProvider>
    );
}
