import { MDXProvider } from '@mdx-js/react';
import { PageFullLayout } from './PageFullLayout';
import mdxComponents from './mdxComponents';
import { ChildrenProps } from '../../src/sharedTypes';

export default function MdxFullPageLayout(props: ChildrenProps) {
    return (
        <MDXProvider components={mdxComponents}>
            <PageFullLayout>
                {props.children}
            </PageFullLayout>
        </MDXProvider>
    )
}