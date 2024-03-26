import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain } from '@pulumiverse/vercel';
import { getStack } from '@pulumi/pulumi';

const up = async () => {
    const stack = getStack();

    const app = nextJsApp('uier', 'uier', 'web/apps/uier');

    // Configure domain name
    let domainName = undefined;
    if (stack === 'next') domainName = 'next.uier.io';
    else if (stack === 'production') domainName = 'uier.io';
    if (domainName) {
        new ProjectDomain('vercel-uier-domain', {
            projectId: app.projectId,
            domain: domainName,
        });

        if (stack === 'next') {
            dnsRecord('vercel-uier', 'next', 'cname.vercel-dns.com', 'CNAME', false);
        } else if (stack === 'production') {
            dnsRecord('vercel-uier', '@', '76.76.21.21', 'A', false);
        }
    }
};

export default up;