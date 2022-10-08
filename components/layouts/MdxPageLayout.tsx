import { MDXProvider } from '@mdx-js/react';
import { PageLayout } from './PageLayout';
import mdxComponents from './mdxComponents';
import { ChildrenProps } from '../../src/sharedTypes';

export default function MdxFullPageLayout(props: ChildrenProps) {
    return (
        <MDXProvider components={mdxComponents}>
            <PageLayout>
                {props.children}
            </PageLayout>
        </MDXProvider>
    )
}
