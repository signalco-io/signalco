import { type Container, CosmosClient, type Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let dataDb: Database | null = null;

let commentsContainer: Container | null = null;

function cosmosClient() {
    if (client == null) {
        const connectionString = process.env.COSMOSDB_CONNECTION_STRING;
        if (!connectionString)
            throw new Error('COSMOSDB_CONNECTION_STRING is not available in the environment. Please set it before using this feature.');

        client = new CosmosClient(connectionString);
    }

    return client;
}

function cosmosDataDb() {
    return dataDb = dataDb ?? cosmosClient().database('uierdata');
}

export function cosmosDataContainerComments() {
    return commentsContainer = commentsContainer ?? cosmosDataDb().container('comments');
}
