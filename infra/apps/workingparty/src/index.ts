import { getStack } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import * as azure_native from '@pulumi/azure-native';
import { DatabaseAccountOfferType } from '@pulumi/azure-native/documentdb/index.js';
import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain } from '@pulumiverse/vercel';
import { CommunicationService, EmailService, Domain, DomainManagement, UserEngagementTracking, SenderUsername, listCommunicationServiceKeysOutput } from '@pulumi/azure-native/communication/index.js';

const up = async () => {
    const stack = getStack();
    const resourceGroupName = `workingparty-${stack}`;

    let domainName = undefined;
    let subdomain = '';
    if (stack === 'next') {
        domainName = 'next.workingparty.ai';
        subdomain = 'next';
    }
    else if (stack === 'production') domainName = 'workingparty.ai';
    if (!domainName) throw new Error('Domain name not found');

    const resourceGroup = new ResourceGroup(resourceGroupName);

    // Create an Azure Cosmos DB Account for SQL API
    const cosmosAccountName = 'wpdb';
    const databaseName = 'wpdata'; // Provide a name for your SQL database
    const cosmosDbAccount = new azure_native.documentdb.DatabaseAccount(cosmosAccountName, {
        resourceGroupName: resourceGroup.name,
        databaseAccountOfferType: DatabaseAccountOfferType.Standard,
        capabilities: [
            {
                name: 'EnableServerless', // Use specific capabilities if needed
            },
        ],
        consistencyPolicy: {
            defaultConsistencyLevel: 'Session', // Adjust the consistency level as needed
        },
        locations: [
            { locationName: 'West Europe' },
        ],
    });

    // Create a SQL Database within the Cosmos DB Account
    const sqlDatabase = new azure_native.documentdb.SqlResourceSqlDatabase(databaseName, {
        resourceGroupName: resourceGroup.name,
        accountName: cosmosDbAccount.name,
        resource: {
            id: databaseName,
        },
    });

    // Creating the containers inside the database
    const containerNames = ['accounts', 'users'];
    const accountContainerNames = ['workers', 'threads'];
    containerNames.map((containerName) =>
        new azure_native.documentdb.SqlResourceSqlContainer(`dbcontainer-${containerName}`, {
            resourceGroupName: resourceGroup.name,
            accountName: cosmosDbAccount.name,
            databaseName: sqlDatabase.name,
            containerName: containerName,
            resource: {
                id: containerName,
                partitionKey: {
                    kind: 'Hash',
                    paths: ['/id'],
                },
            },
        }),
    );
    accountContainerNames.map((containerName) =>
        new azure_native.documentdb.SqlResourceSqlContainer(`dbcontainer-${containerName}`, {
            resourceGroupName: resourceGroup.name,
            accountName: cosmosDbAccount.name,
            databaseName: sqlDatabase.name,
            containerName: containerName,
            resource: {
                id: containerName,
                partitionKey: {
                    kind: 'Hash',
                    paths: ['/accountId'],
                },
            },
        }),
    );

    // Create ACS
    const aes = new EmailService('wp-azure-email-service', {
        dataLocation: 'Europe',
        emailServiceName: 'wpemail',
        location: 'Global',
        resourceGroupName: resourceGroup.name,
    });
    const aesDomain = new Domain('wp-aes-domain', {
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
        dnsRecord('wp-aes-domain-domainverify', aesDomainVerifyDataName, aesDomainVerifyDataValue, 'TXT', false);
    }
    if (aesDomain.verificationRecords.sPF) {
        const aesDomainVerifySpfName = aesDomain.verificationRecords.sPF.apply(dkimVerification => dkimVerification?.name ?? '');
        const aesDomainVerifySpfValue = aesDomain.verificationRecords.sPF.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord('wp-aes-domain-spf', aesDomainVerifySpfName, aesDomainVerifySpfValue, 'TXT', false);
    }
    if (aesDomain.verificationRecords.dKIM) {
        const aesDomainVerifyDkimName = aesDomain.verificationRecords.dKIM.apply(dkimVerification => subdomain ? (`${dkimVerification?.name ?? ''}.${subdomain}`) : dkimVerification?.name ?? '');
        const aesDomainVerifyDkimValue = aesDomain.verificationRecords.dKIM.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord('wp-aes-domain-dkim', aesDomainVerifyDkimName, aesDomainVerifyDkimValue, 'CNAME', false);
    }
    if (aesDomain.verificationRecords.dKIM2) {
        const aesDomainVerifyDkimName = aesDomain.verificationRecords.dKIM2.apply(dkimVerification => subdomain ? (`${dkimVerification?.name ?? ''}.${subdomain}`) : dkimVerification?.name ?? '');
        const aesDomainVerifyDkimValue = aesDomain.verificationRecords.dKIM2.apply(dkimVerification => dkimVerification?.value ?? '');
        dnsRecord('wp-aes-domain-dkim2', aesDomainVerifyDkimName, aesDomainVerifyDkimValue, 'CNAME', false);
    }
    // NOTE: Domain needs to be verified manually in Azure Communication Services

    new SenderUsername('wp-aes-sender-notifications', {
        resourceGroupName: resourceGroup.name,
        emailServiceName: aes.name,
        domainName: aesDomain.name,
        displayName: 'WorkingParty Notifications',
        senderUsername: 'notifications',
        username: 'notifications',
    });
    new SenderUsername('wp-aes-sender-system', {
        resourceGroupName: resourceGroup.name,
        emailServiceName: aes.name,
        domainName: aesDomain.name,
        displayName: 'WorkingParty',
        senderUsername: 'system',
        username: 'system',
    });
    new CommunicationService('wp-azure-communication-service', {
        communicationServiceName: `wpacs-${stack}`,
        dataLocation: 'Europe',
        location: 'Global',
        resourceGroupName: resourceGroup.name,
        linkedDomains: [aesDomain.id],
    });

    // Vercel setup
    const app = nextJsApp('wp', 'workingparty');

    new ProjectDomain('vercel-wp-domain', {
        projectId: app.projectId,
        domain: domainName,
    });

    if (stack === 'next') {
        dnsRecord('vercel-wp', 'next', 'cname.vercel-dns.com', 'CNAME', false);
    } else if (stack === 'production') {
        dnsRecord('vercel-wp', '@', '76.76.21.21', 'A', false);
    }

    // TODO: Assign ACS connection string to Vercel environment variable
    // const acsPrimaryConnectionString = listCommunicationServiceKeysOutput({
    //     resourceGroupName: resourceGroup.name,
    //     communicationServiceName: acs.name,
    // }).apply(keys => keys.primaryConnectionString ?? '');
};

export default up;