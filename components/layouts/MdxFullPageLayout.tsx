import { MDXProvider } from '@mdx-js/react';
import { ChildrenProps } from '../../src/sharedTypes';
import mdxComponents from './mdxComponents';
import { PageFullLayout } from './PageFullLayout';

export default function MdxFullPageLayout(props: ChildrenProps) {
    return (
        <MDXProvider components={mdxComponents}>
            <PageFullLayout>
                {props.children}
            </PageFullLayout>
        </MDXProvider>
    )
}