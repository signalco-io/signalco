import { dnsRecord } from '@infra/pulumi/cloudflare';
import { EmailService, Domain, DomainManagement, UserEngagementTracking, SenderUsername, CommunicationService, listCommunicationServiceKeysOutput } from '@pulumi/azure-native/communication/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';

export async function acsEmails(prefix: string, resourceGroup: ResourceGroup, domainName: string, subdomain: string | null | undefined, stack: string, emails: { subdomain: string; displayName: string; }[]) {
    // Create ACS
    const aes = new EmailService(`${prefix}-azure-email-service`, {
        dataLocation: 'Europe',
        emailServiceName: `${prefix}email`,
        location: 'Global',
        resourceGroupName: resourceGroup.name,
    });
    const aesDomain = new Domain(`${prefix}-aes-domain`, {
        resourceGroupName: resourceGroup.name,
        emailServiceName: aes.name,
        domainManagement: DomainManagement.CustomerManaged,
        domainName: domainName,
        location: 'Global',
        userEngagementTracking: UserEngagementTracking.Disabled,
    });
    if (aesDomain.verificationRecords.domain) {
        const aesDomainVerifyDataName = aesDomain.verificationRecords.domain.apply(domainVerification => domainVerification?.name ?? '');
        const aesDomainVerifyDataValue = aesDomain.verificationRecords.domain.apply(domainVerification => domainVerification?.value ?? '');
        dnsRecord(`${prefix}-aes-domain-domainverify`, aesDomainVerifyDataName, aesDomainVerifyDataValue, 'TXT', false);
    }
    if (aesDomain.verificationRecords.sPF) {
        const aesDomainVerifySpfName = aesDomain.verificationRecords.sPF.apply(dkimVerification => dkimVerification?.name ?? '');
        const aesDomainVerifySpfValue = aesDomain.verificationRecords.sPF.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord(`${prefix}-aes-domain-spf`, aesDomainVerifySpfName, aesDomainVerifySpfValue, 'TXT', false);
    }
    if (aesDomain.verificationRecords.dKIM) {
        const aesDomainVerifyDkimName = aesDomain.verificationRecords.dKIM.apply(dkimVerification => subdomain ? (`${dkimVerification?.name ?? ''}.${subdomain}`) : dkimVerification?.name ?? '');
        const aesDomainVerifyDkimValue = aesDomain.verificationRecords.dKIM.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord(`${prefix}-aes-domain-dkim`, aesDomainVerifyDkimName, aesDomainVerifyDkimValue, 'CNAME', false);
    }
    if (aesDomain.verificationRecords.dKIM2) {
        const aesDomainVerifyDkimName = aesDomain.verificationRecords.dKIM2.apply(dkimVerification => subdomain ? (`${dkimVerification?.name ?? ''}.${subdomain}`) : dkimVerification?.name ?? '');
        const aesDomainVerifyDkimValue = aesDomain.verificationRecords.dKIM2.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord(`${prefix}-aes-domain-dkim2`, aesDomainVerifyDkimName, aesDomainVerifyDkimValue, 'CNAME', false);
    }
    // NOTE: Domain needs to be verified manually in Azure Communication Services

    // Create senders
    emails.forEach(({ subdomain: emailSubdomain, displayName }) => {
        new SenderUsername(`${prefix}-aes-sender-${emailSubdomain}`, {
            resourceGroupName: resourceGroup.name,
            emailServiceName: aes.name,
            domainName: aesDomain.name,
            displayName: displayName,
            senderUsername: emailSubdomain,
            username: emailSubdomain,
        });
    });

    const communicaionService = new CommunicationService(`${prefix}-azure-communication-service`, {
        communicationServiceName: `${prefix}acs-${stack}`,
        dataLocation: 'Europe',
        location: 'Global',
        resourceGroupName: resourceGroup.name,
        linkedDomains: [aesDomain.id],
    });
    const acsPrimaryConnectionString = listCommunicationServiceKeysOutput({
        resourceGroupName: resourceGroup.name,
        communicationServiceName: communicaionService.name,
    }).apply(keys => keys.primaryConnectionString ?? '');

    return {
        acsPrimaryConnectionString,
    };
}
