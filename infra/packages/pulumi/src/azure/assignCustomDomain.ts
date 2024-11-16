import { Config, interpolate, type StackReference, Output } from '@pulumi/pulumi';
import {
    WebApp,
    WebAppHostNameBinding,
    Certificate,
    HostNameType,
    SslState,
    CustomHostNameDnsRecordType,
} from '@pulumi/azure-native/web/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { dnsRecord } from '../cloudflare/dnsRecord.js';

export function assignCustomDomain(
    resourceGroup: ResourceGroup,
    webApp: WebApp,
    servicePlanId: Output<string>,
    namePrefix: string,
    subDomainName: string,
    currentStack: StackReference,
    protect: boolean) {
    const config = new Config();
    const fullDomainName = `${subDomainName}.${config.require('domain')}`;

    const txtVerifyRecord = dnsRecord(
        `func-dns-txt-domainverify-${namePrefix}`,
        `asuid.${fullDomainName}`,
        interpolate`${webApp.customDomainVerificationId}`,
        'TXT',
        protect,
    );
    const cname = dnsRecord(
        `func-dns-cname-${namePrefix}`,
        fullDomainName,
        webApp.defaultHostName,
        'CNAME',
        protect,
    );

    const certsOutput = currentStack.getOutput('certs') as Output<{ fullDomainName: string, thumbprint: string }[]>;
    const certOutput = certsOutput.apply(certs => certs?.find(c => c.fullDomainName === fullDomainName));

    const binding = new WebAppHostNameBinding(`func-hostnamebind-${namePrefix}`, {
        name: webApp.name,
        resourceGroupName: resourceGroup.name,
        hostName: fullDomainName,
        customHostNameDnsRecordType: CustomHostNameDnsRecordType.CName,
        hostNameType: HostNameType.Verified,
        sslState: certOutput.apply(c => c?.thumbprint ? SslState.SniEnabled : SslState.Disabled),
        thumbprint: certOutput.apply(c => c?.thumbprint ?? ''),
    }, {
        protect,
    });

    const cert = new Certificate(`func-cert-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        name: `cert-${namePrefix}`,
        canonicalName: fullDomainName,
        serverFarmId: servicePlanId,
    }, {
        protect,
    });

    return {
        fullDomainName: fullDomainName,
        dnsTxtVerify: txtVerifyRecord,
        dnsCname: cname,
        cert,
        binding,
    };
}
