import { type Container, CosmosClient, type Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let dataDb: Database | null = null;

// Auth
// TODO: Move to auth project
let usersContainer: Container | null = null;
let emailUserContainer: Container | null = null;
let loginRequestsContainer: Container | null = null;

// Subscriptions
// TODO: Move to subscriptions project
let plansContainer: Container | null = null;
let usageContainer: Container | null = null;
let subscriptionsContainer: Container | null = null;
let accountsContainer: Container | null = null;

// App
let documentsContainer: Container | null = null;
let processesContainer: Container | null = null;
let taskDefinitionsContainer: Container | null = null;
let processRunsContainer: Container | null = null;
let processRunTasksContainer: Container | null = null;

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

export function cosmosDataContainerDocuments() {
    return documentsContainer = documentsContainer ?? cosmosDataDb().container('documents');
}

export function cosmosDataContainerProcesses() {
    return processesContainer = processesContainer ?? cosmosDataDb().container('processes');
}

export function cosmosDataContainerTaskDefinitions() {
    return taskDefinitionsContainer = taskDefinitionsContainer ?? cosmosDataDb().container('taskdefinitions');
}

export function cosmosDataContainerProcessRuns() {
    return processRunsContainer = processRunsContainer ?? cosmosDataDb().container('processruns');
}

export function cosmosDataContainerProcessRunTasks() {
    return processRunTasksContainer = processRunTasksContainer ?? cosmosDataDb().container('processruntasks');
}
