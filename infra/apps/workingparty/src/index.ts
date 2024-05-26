import { Config, getStack } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Queue } from '@pulumi/azure-native/storage/index.js';
import { DatabaseAccount, SqlResourceSqlDatabase, SqlResourceSqlContainer, DatabaseAccountOfferType, listDatabaseAccountConnectionStringsOutput } from '@pulumi/azure-native/documentdb/index.js';
import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain, ProjectEnvironmentVariable } from '@pulumiverse/vercel';
import { CommunicationService, EmailService, Domain, DomainManagement, UserEngagementTracking, SenderUsername, listCommunicationServiceKeysOutput } from '@pulumi/azure-native/communication/index.js';
import { createStorageAccount } from '@infra/pulumi/azure';

const up = async () => {
    const config = new Config();
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
    const cosmosDbAccount = new DatabaseAccount(cosmosAccountName, {
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
    const cosmosPrimaryConnectionString = listDatabaseAccountConnectionStringsOutput({
        resourceGroupName: resourceGroup.name,
        accountName: cosmosDbAccount.name,
    }).apply(keys => keys.connectionStrings?.at(0)?.connectionString ?? '');

    // Create a SQL Database within the Cosmos DB Account
    const sqlDatabase = new SqlResourceSqlDatabase(databaseName, {
        resourceGroupName: resourceGroup.name,
        accountName: cosmosDbAccount.name,
        resource: {
            id: databaseName,
        },
    });

    // Creating the containers inside the database
    const containerNames = ['login-requests', 'accounts', 'users', 'plans'];
    const emailContainerNames = ['email-user'];
    const accountContainerNames = ['workers', 'threads', 'usage', 'subscriptions'];
    containerNames.map((containerName) =>
        new SqlResourceSqlContainer(`dbcontainer-${containerName}`, {
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
    emailContainerNames.map((containerName) =>
        new SqlResourceSqlContainer(`dbcontainer-${containerName}`, {
            resourceGroupName: resourceGroup.name,
            accountName: cosmosDbAccount.name,
            databaseName: sqlDatabase.name,
            containerName: containerName,
            resource: {
                id: containerName,
                partitionKey: {
                    kind: 'Hash',
                    paths: ['/email'],
                },
            },
        }),
    );
    accountContainerNames.map((containerName) =>
        new SqlResourceSqlContainer(`dbcontainer-${containerName}`, {
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

    // Create storage and queues
    const storage = createStorageAccount(resourceGroup, 'wpstorage', false);
    new Queue('wp-email-queue', {
        accountName: storage.storageAccount.name,
        resourceGroupName: resourceGroup.name,
        queueName: 'email-queue',
    });

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
    const communicaionService = new CommunicationService('wp-azure-communication-service', {
        communicationServiceName: `wpacs-${stack}`,
        dataLocation: 'Europe',
        location: 'Global',
        resourceGroupName: resourceGroup.name,
        linkedDomains: [aesDomain.id],
    });
    const acsPrimaryConnectionString = listCommunicationServiceKeysOutput({
        resourceGroupName: resourceGroup.name,
        communicationServiceName: communicaionService.name,
    }).apply(keys => keys.primaryConnectionString ?? '');

    // Vercel setup
    const app = nextJsApp('wp', 'workingparty', 'web/apps/workingparty');

    new ProjectDomain('vercel-wp-domain', {
        projectId: app.projectId,
        domain: domainName,
    });

    new ProjectEnvironmentVariable('vercel-wp-env-acs', {
        projectId: app.projectId,
        key: 'ACS_CONNECTION_STRING',
        value: acsPrimaryConnectionString,
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-cosmos', {
        projectId: app.projectId,
        key: 'COSMOSDB_CONNECTION_STRING',
        value: cosmosPrimaryConnectionString,
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-appdomain', {
        projectId: app.projectId,
        key: 'NEXT_PUBLIC_APP_DOMAIN',
        value: domainName,
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-emaildomain', {
        projectId: app.projectId,
        key: 'NEXT_PUBLIC_APP_EMAILDOMAIN',
        value: domainName,
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-openai', {
        projectId: app.projectId,
        key: 'OPENAI_API_KEY',
        value: config.requireSecret('openaikey'),
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-stripepublic', {
        projectId: app.projectId,
        key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE',
        value: config.requireSecret('stripepublic'),
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-stripesecret', {
        projectId: app.projectId,
        key: 'STRIPE_SECRETKEY',
        value: config.requireSecret('stripesecret'),
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-stripewebhook', {
        projectId: app.projectId,
        key: 'STRIPE_WEBHOOK_SECRET',
        value: config.requireSecret('stripewebhooksecret'),
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
    new ProjectEnvironmentVariable('vercel-wp-env-jwtsecret', {
        projectId: app.projectId,
        key: 'WP_JWT_SIGN_SECRET',
        value: config.requireSecret('jwtsecret'),
        targets: stack === 'production' ? ['production'] : ['preview'],
    });

    if (stack === 'next') {
        dnsRecord('vercel-wp', 'next', 'cname.vercel-dns.com', 'CNAME', false);
    } else if (stack === 'production') {
        dnsRecord('vercel-wp', '@', '76.76.21.21', 'A', false);
    }
};

export default up;