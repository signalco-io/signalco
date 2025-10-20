import { cosmosDataContainerMessages } from './cosmosClient';

export type DbMessage = {
    id: string;
    accountId: string;
    threadId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: number; // unix seconds
};

export async function openAiListMessages(accountId: string, threadId: string, before?: string, after?: string) {
    const container = cosmosDataContainerMessages();
    const query: any = {
        query: 'SELECT TOP 50 * FROM c WHERE c.threadId = @threadId AND c.accountId = @accountId ORDER BY c.createdAt DESC',
        parameters: [
            { name: '@threadId', value: threadId },
            { name: '@accountId', value: accountId }
        ]
    };

    const res = await container.items.query(query, { partitionKey: accountId }).fetchAll();
    let items = res.resources as DbMessage[];

    if (after) {
        const idx = items.findIndex(m => m.id === after);
        if (idx >= 0) items = items.slice(0, idx);
    }
    if (before) {
        const idx = items.findIndex(m => m.id === before);
        if (idx >= 0) items = items.slice(idx + 1);
    }

    // Return newest-first to match previous behavior expected by caller
    return items;
}

export async function openAiCreateMessage(accountId: string, threadId: string, message: string, role: DbMessage['role'] = 'user') {
    const container = cosmosDataContainerMessages();
    const item: DbMessage = {
        id: crypto.randomUUID(),
        accountId,
        threadId,
        role,
        content: message,
        createdAt: Math.floor(Date.now() / 1000)
    };
    await container.items.create(item);
    return item.id;
}
