import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain } from '@pulumiverse/vercel';
import { getStack } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { createStorageAccount } from '@infra/pulumi/azure';
import { Profile, Endpoint, SkuName } from '@pulumi/azure-native/cdn/index.js';

const up = async () => {
    const stack = getStack();
    const shouldProtect = stack === 'production';

    const resourceGroup = new ResourceGroup(`uier-${stack}`);

    // TODO: Create Static files storage
    const staticFilesStorage = createStorageAccount(
        resourceGroup,
        'static',
        shouldProtect,
    );

    // TODO: Create CDN for status files storage
    const cdnProfile = new Profile('uier-staticcndprofile', {
        resourceGroupName: resourceGroup.name,
        sku: {
            name: SkuName.Standard_Microsoft,
        },
        profileName: 'uier-staticFiles-cdn',
    });
    // new Endpoint('uier-staticFiles', {
    //     resourceGroupName: resourceGroup.name,
    //     profileName: cdnProfile.name,
    //     origins: [

    //     ],     
    // });

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
            dnsRecord('vercel-uier', 'next', 'cname.vercel-dns.com', 'CNAME', false);
        } else if (stack === 'production') {
            dnsRecord('vercel-uier', '@', '76.76.21.21', 'A', false);
        }
    }
};

export default up;