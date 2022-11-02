import { MDXProvider } from '@mdx-js/react';
import CookiePolicyMdx from './cookie-policy-content.mdx';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function CookiePolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <CookiePolicyMdx />
        </MDXProvider>
    );
}
