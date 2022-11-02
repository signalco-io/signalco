import { MDXProvider } from '@mdx-js/react';
import StationsSetupMd from '../../docs/stations/setup.md';
import mdxComponents from '../../components/layouts/mdxComponents';

export default function StationIndex() {
    return (
        <MDXProvider components={mdxComponents}>
            <StationsSetupMd />
        </MDXProvider>
    );
}
