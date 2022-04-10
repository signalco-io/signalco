import { MDXProvider } from "@mdx-js/react";
import mdxComponents from "../../components/layouts/mdxComponents";
import PrivacyPolicyMdx from './privacy-policy-content.mdx';

export default function PrivacyPolicy() {
    return (
        <MDXProvider components={mdxComponents}>
            <PrivacyPolicyMdx />
        </MDXProvider>
    );
}
