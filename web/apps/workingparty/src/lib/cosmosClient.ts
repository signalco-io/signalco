import { type Container, CosmosClient, type Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let dataDb: Database | null = null;
let workersContainer: Container | null = null;
let threadsContainer: Container | null = null;

function cosmosClient() {
    if (client == null) {
        const connectionString = process.env.COSMOSDB_CONNECTION_STRING;
        if (!connectionString)
            throw new Error('COSMOSDB_CONNECTION_STRING is not available in the environment. Please set it before using this feature.');

        client = new CosmosClient(connectionString);
    }

    return client;
}

export function cosmosDataDb() {
    if (dataDb == null) {
        dataDb = cosmosClient().database('wpdata');
    }

    return dataDb;
}

export function cosmosDataContainerWorkers() {
    if (workersContainer == null) {
        workersContainer = cosmosDataDb().container('workers');
    }

    return workersContainer;
}

export function cosmosDataContainerThreads() {
    if (threadsContainer == null) {
        threadsContainer = cosmosDataDb().container('threads');
    }

    return threadsContainer;
}
