import { MDXProvider } from '@mdx-js/react';
import PrivacyPolicyMdx from './privacy-policy-content.mdx';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function PrivacyPolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <PrivacyPolicyMdx />
        </MDXProvider>
    );
}
