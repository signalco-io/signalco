import { MDXProvider } from "@mdx-js/react";
import mdxComponents from "../../components/layouts/mdxComponents";
import AcceptableUsePolicyMdx from './acceptable-use-policy-content.mdx';

export default function AcceptableUsePolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <AcceptableUsePolicyMdx />
        </MDXProvider>
    );
}
