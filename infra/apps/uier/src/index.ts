import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain } from '@pulumiverse/vercel';
import { getStack } from '@pulumi/pulumi';

const up = async () => {
    const stack = getStack();

    const app = nextJsApp('uier', 'uier');

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
            dnsRecord('vercel-uier', 'uier', 'cname.vercel-dns.com', 'CNAME', false);
        } else if (stack === 'production') {
            // TODO: Handle A record for production
        }
    }
};

export default up;