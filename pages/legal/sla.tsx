import { MDXProvider } from '@mdx-js/react';
import SlaMdx from './sla-content.mdx';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function Sla() {
    return (
        <MDXProvider components={mdxComponents}>
            <SlaMdx />
        </MDXProvider>
    );
}
