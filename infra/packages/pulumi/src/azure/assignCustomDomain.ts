import { Config, interpolate, Output } from '@pulumi/pulumi';
import {
    WebApp,
    WebAppHostNameBinding,
    Certificate,
    HostNameType,
    SslState,
    CustomHostNameDnsRecordType,
    getCertificate,
} from '@pulumi/azure-native/web/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { dnsRecord } from '../cloudflare/dnsRecord.js';

// Read live because Azure renews managed certificates (with a new thumbprint) on its own.
// Undefined until the certificate is first created.
async function managedCertificateThumbprint(resourceGroupName: string, name: string) {
    try {
        return (await getCertificate({ resourceGroupName, name })).thumbprint;
    } catch (error) {
        // Only a missing certificate may leave SSL disabled; anything else must fail the deploy
        if (/Status=404|NotFound/.test(String(error)))
            return undefined;
        throw error;
    }
}

export function assignCustomDomain(
    resourceGroup: ResourceGroup,
    webApp: WebApp,
    servicePlanId: Output<string>,
    namePrefix: string,
    subDomainName: string,
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

    const certName = `cert-${namePrefix}`;
    const certThumbprint = resourceGroup.name.apply(name => managedCertificateThumbprint(name, certName));

    const binding = new WebAppHostNameBinding(`func-hostnamebind-${namePrefix}`, {
        name: webApp.name,
        resourceGroupName: resourceGroup.name,
        hostName: fullDomainName,
        customHostNameDnsRecordType: CustomHostNameDnsRecordType.CName,
        hostNameType: HostNameType.Verified,
        sslState: certThumbprint.apply(t => t ? SslState.SniEnabled : SslState.Disabled),
        thumbprint: certThumbprint.apply(t => t ?? ''),
    }, {
        protect,
        // Hostname verification needs the DNS records in place
        dependsOn: [txtVerifyRecord, cname],
    });

    const cert = new Certificate(`func-cert-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        name: certName,
        canonicalName: fullDomainName,
        serverFarmId: servicePlanId,
    }, {
        protect,
        // Managed certificates can only be issued for a hostname already bound to the app
        dependsOn: [binding],
    });

    return {
        fullDomainName: fullDomainName,
        dnsTxtVerify: txtVerifyRecord,
        dnsCname: cname,
        cert,
        binding,
    };
}
