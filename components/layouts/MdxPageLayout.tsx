import { MDXProvider } from '@mdx-js/react';
import { ChildrenProps } from '../../src/sharedTypes';
import mdxComponents from './mdxComponents';
import { PageLayout } from './PageLayout';

export default function MdxFullPageLayout(props: ChildrenProps) {
    return (
        <MDXProvider components={mdxComponents}>
            <PageLayout>
                {props.children}
            </PageLayout>
        </MDXProvider>
    )
}