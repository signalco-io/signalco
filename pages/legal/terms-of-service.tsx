import { MDXProvider } from '@mdx-js/react';
import TermsOfServiceMdx from './terms-of-service-content.mdx';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function TermsOfService() {
    return (
        <MDXProvider components={mdxComponents}>
            <TermsOfServiceMdx />
        </MDXProvider>
    );
}
