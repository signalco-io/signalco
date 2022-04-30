import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '../../components/layouts/mdxComponents';
import StationsSetupMd from '../../docs/stations/setup.md';

export default function StationIndex() {
    return (
        <MDXProvider components={mdxComponents}>
            <StationsSetupMd />
        </MDXProvider>
    );
}
