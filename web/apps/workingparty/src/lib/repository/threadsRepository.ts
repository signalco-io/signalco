import { nanoid } from 'nanoid';
import { openAiCreateThread, openAiDeleteThread } from '../openAiThreads';
import { cosmosDataContainerThreads } from '../cosmosClient';

export async function threadsGetAll(accountId: string, workerId: string) {
    const container = cosmosDataContainerThreads();
    const allItems = await container.items
        .query({
            query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.assignedWorkers, @workerId) ORDER BY c.createdAt DESC',
            parameters: [
                { name: '@workerId', value: workerId }
            ],
        }, { partitionKey: accountId })
        .fetchAll();

    const data = allItems.resources.map((dbItem) => ({
        id: dbItem.id,
        name: dbItem.name,
        assignedWorkers: dbItem.assignedWorkers
    })) ?? [];

    return data;
}

export async function threadsGet(accountId: string, threadId: string) {
    const container = cosmosDataContainerThreads();
    const { resource: dbItem } = await container.item(threadId, accountId).read();

    return {
        id: dbItem.id,
        name: dbItem.name,
        assignedWorkers: dbItem.assignedWorkers,
        oaiThreadId: dbItem.oaiThreadId
    };
}

export async function threadsCreate(accountId: string, workerId: string) {
    const oaiThreadId = await openAiCreateThread();

    const newItem = {
        id: nanoid(16),
        accountId: accountId,
        name: 'New Thread',
        assignedWorkers: [workerId],
        createdAt: new Date().getTime() / 1000, // UNIX seconds
        oaiThreadId
    };

    const container = cosmosDataContainerThreads();
    await container.items.create(newItem);

    return newItem.id;
}

export async function threadsDelete(accountId: string, threadId: string) {
    const dbItem = await threadsGet(accountId, threadId);
    if (!dbItem)
        throw new Error('Thread not found');

    // TODO: Delete all related messages

    const container = cosmosDataContainerThreads();
    await container.item(threadId, accountId).delete();

    // Delete OpenAI thread
    if (dbItem.oaiThreadId) {
        try {
            await openAiDeleteThread(dbItem.oaiThreadId);
        } catch (error) {
            console.error('Failed to delete OpenAI thread', error);
        }
    }
}
