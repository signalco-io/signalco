import { nanoid } from 'nanoid';
import { openAiCreateThread } from '../openAiThreads';
import { cosmosDataContainerThreads } from '../cosmosClient';

export async function threadsGetAll(workerId: string) {
    const container = cosmosDataContainerThreads();
    const allItems = await container.items
        .query({
            query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.assignedWorkers, @workerId) ORDER BY c.createdAt DESC',
            parameters: [
                { name: '@workerId', value: workerId }
            ],
        })
        .fetchAll();

    const data = allItems.resources.map((dbItem) => ({
        id: dbItem.id,
        name: dbItem.name,
        assignedWorkers: dbItem.assignedWorkers
    })) ?? [];

    return data;
}

export async function threadsGet(threadId: string) {
    const container = cosmosDataContainerThreads();
    const { resource: dbItem } = await container.item(threadId, threadId).read();

    return {
        id: dbItem.id,
        name: dbItem.name,
        assignedWorkers: dbItem.assignedWorkers,
        oaiThreadId: dbItem.oaiThreadId
    };
}

export async function threadsCreate(workerId: string) {
    const oaiThreadId = await openAiCreateThread();

    const newItem = {
        id: nanoid(16),
        name: 'New Thread',
        assignedWorkers: [workerId],
        createdAt: new Date().getTime() / 1000, // UNIX
        oaiThreadId
    };

    const container = cosmosDataContainerThreads();
    await container.items.create(newItem);

    return newItem.id;
}

export async function threadsDelete(threadId: string) {
    const container = cosmosDataContainerThreads();

    // TODO: Delete all related messages

    await container.item(threadId, threadId).delete();
}
