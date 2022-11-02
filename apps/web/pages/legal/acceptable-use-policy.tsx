import { MDXProvider } from '@mdx-js/react';
import AcceptableUsePolicyMdx from './acceptable-use-policy-content.mdx';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function AcceptableUsePolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <AcceptableUsePolicyMdx />
        </MDXProvider>
    );
}
