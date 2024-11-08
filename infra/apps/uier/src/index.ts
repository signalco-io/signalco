import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain, ProjectEnvironmentVariable } from '@pulumiverse/vercel';
import { getStack } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { DatabaseAccount, SqlResourceSqlDatabase, SqlResourceSqlContainer, DatabaseAccountOfferType, listDatabaseAccountConnectionStringsOutput } from '@pulumi/azure-native/documentdb/index.js';

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

    // Azure
    const resourceGroupName = `uier-${stack}`;
    const resourceGroup = new ResourceGroup(resourceGroupName);

    // Create an Azure Cosmos DB Account for SQL API
    const cosmosAccountName = 'uierdb';
    const databaseName = 'uierdata';
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
    const containerNames = ['comments'];
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
                    paths: ['/domain'],
                },
            },
        }),
    );

    // Assign app environment variables
    new ProjectEnvironmentVariable('vercel-uier-env-cosmos', {
        projectId: app.projectId,
        key: 'COSMOSDB_CONNECTION_STRING',
        value: cosmosPrimaryConnectionString,
        targets: stack === 'production' ? ['production'] : ['preview'],
    });
};

export default up;