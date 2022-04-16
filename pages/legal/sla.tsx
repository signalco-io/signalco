import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '../../components/layouts/mdxComponents';
import SlaMdx from './sla-content.mdx';

export default function Sla() {
    return (
        <MDXProvider components={mdxComponents}>
            <SlaMdx />
        </MDXProvider>
    );
}
