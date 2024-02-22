import { getStack } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import * as azure_native from "@pulumi/azure-native";
import { DatabaseAccountOfferType } from '@pulumi/azure-native/documentdb/index.js';

const up = async () => {
    const stack = getStack();
    const resourceGroupName = `workingparty-${stack}`;

    const resourceGroup = new ResourceGroup(resourceGroupName);

    const cosmosAccountName = "wpdb";
    const databaseName = "wpdata"; // Provide a name for your SQL database

    // Create an Azure Cosmos DB Account for SQL API
    const cosmosDbAccount = new azure_native.documentdb.DatabaseAccount(cosmosAccountName, {
        resourceGroupName: resourceGroup.name,
        databaseAccountOfferType: DatabaseAccountOfferType.Standard,
        capabilities: [
            {
                name: "EnableServerless", // Use specific capabilities if needed
            },
        ],
        consistencyPolicy: {
            defaultConsistencyLevel: "Session", // Adjust the consistency level as needed
        },
        locations: [
            { locationName: "West Europe" }
        ]
    });

    // Create a SQL Database within the Cosmos DB Account
    const sqlDatabase = new azure_native.documentdb.SqlResourceSqlDatabase(databaseName, {
        resourceGroupName: resourceGroup.name,
        accountName: cosmosDbAccount.name,
        resource: {
            id: databaseName
        },
    });

    // Creating the containers inside the database
    const containerNames = ["accounts", "users", "workers", "threads"];
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
                    paths: ['/id']
                }
            },
        })
    );
};

export default up;