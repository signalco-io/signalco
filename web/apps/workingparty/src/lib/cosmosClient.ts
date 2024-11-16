import { type Container, CosmosClient, type Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let dataDb: Database | null = null;
let loginRequestsContainer: Container | null = null;
let plansContainer: Container | null = null;
let accountsContainer: Container | null = null;
let usersContainer: Container | null = null;
let emailUserContainer: Container | null = null;
let usageContainer: Container | null = null;
let subscriptionsContainer: Container | null = null;
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

function cosmosDataDb() {
    return dataDb = dataDb ?? cosmosClient().database('wpdata');
}

export function cosmosDataContainerLoginRequests() {
    return loginRequestsContainer = loginRequestsContainer ?? cosmosDataDb().container('login-requests');
}

export function cosmosDataContainerEmailUser() {
    return emailUserContainer = emailUserContainer ?? cosmosDataDb().container('email-user');
}

export function cosmosDataContainerPlans() {
    return plansContainer = plansContainer ?? cosmosDataDb().container('plans');
}

export function cosmosDataContainerAccounts() {
    return accountsContainer = accountsContainer ?? cosmosDataDb().container('accounts');
}

export function cosmosDataContainerUsers() {
    return usersContainer = usersContainer ?? cosmosDataDb().container('users');
}

export function cosmosDataContainerUsage() {
    return usageContainer = usageContainer ?? cosmosDataDb().container('usage');
}

export function cosmosDataContainerSubscriptions() {
    return subscriptionsContainer = subscriptionsContainer ?? cosmosDataDb().container('subscriptions');
}

export function cosmosDataContainerWorkers() {
    return workersContainer = workersContainer ?? cosmosDataDb().container('workers');
}

export function cosmosDataContainerThreads() {
    return threadsContainer = threadsContainer ?? cosmosDataDb().container('threads');
}

