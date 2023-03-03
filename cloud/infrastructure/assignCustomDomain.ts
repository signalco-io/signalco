import { Config, interpolate, log } from '@pulumi/pulumi';
import { WebApp, AppServicePlan, WebAppHostNameBinding, Certificate, HostNameType, SslState, CustomHostNameDnsRecordType } from '@pulumi/azure-native/web';
import { ResourceGroup } from '@pulumi/azure-native/resources';
import { local } from '@pulumi/command';
import { dnsRecord } from './dnsRecord';

export function assignCustomDomain (resourceGroup: ResourceGroup, webApp: WebApp, servicePlan: AppServicePlan, namePrefix: string, subDomainName: string, protect: boolean) {
    const config = new Config();
    const fullDomainName = `${subDomainName}.${config.require('domain')}`;

    const txtVerifyRecord = dnsRecord(
        `func-dns-txt-domainverify-${namePrefix}`,
        `asuid.${fullDomainName}`,
        interpolate`${webApp.customDomainVerificationId}`,
        'TXT',
        protect,
        webApp);
    const cname = dnsRecord(
        `func-dns-cname-${namePrefix}`,
        fullDomainName,
        interpolate`${webApp.name}.azurewebsites.net`,
        'CNAME',
        protect,
        webApp
    );

    // Until Pulumi comes up with circular dependency solution
    // we are creating hostname binding via Azure CLI because
    // it's required to create certificate, only then the
    // hostname binding with SSL cert can be configured
    const assignHostName = new local.Command(`func-hostname-assign-${namePrefix}`, {
        create: interpolate`az webapp config hostname add --webapp-name ${webApp.name} --resource-group ${resourceGroup.name} --hostname ${fullDomainName}`
    }, {
        dependsOn: [txtVerifyRecord, cname]
        // parent: webApp
    });

    assignHostName.stderr.apply(err => err && log.warn('Assign hostname failed with: ' + err));

    const cert = new Certificate(`func-cert-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        canonicalName: fullDomainName,
        serverFarmId: servicePlan.id
    }, {
        protect,
        dependsOn: [assignHostName]
        // parent: webApp
    });

    const deleteHostName = new local.Command(`func-hostname-remove-${namePrefix}`, {
        create: interpolate`az webapp config hostname delete --webapp-name ${webApp.name} --resource-group ${resourceGroup.name} --hostname ${fullDomainName}`
    }, {
        dependsOn: [cert]
        // parent: webApp
    });

    deleteHostName.stderr.apply(err => err && log.warn('Delete hostname failed with: ' + err));

    const binding = new WebAppHostNameBinding(`func-hostnamebind-${namePrefix}`, {
        name: webApp.name,
        resourceGroupName: resourceGroup.name,
        hostName: fullDomainName,
        hostNameType: HostNameType.Verified,
        sslState: SslState.SniEnabled,
        customHostNameDnsRecordType: CustomHostNameDnsRecordType.CName,
        thumbprint: cert.thumbprint
    }, {
        dependsOn: [deleteHostName],
        protect
        // parent: webApp
    });

    return {
        dnsTxtVerify: txtVerifyRecord,
        dnsCname: cname,
        cert,
        binding
    };
}
