import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '../../components/layouts/mdxComponents';
import TermsOfServiceMdx from './terms-of-service-content.mdx';

export default function TermsOfService() {
    return (
        <MDXProvider components={mdxComponents}>
            <TermsOfServiceMdx />
        </MDXProvider>
    );
}
