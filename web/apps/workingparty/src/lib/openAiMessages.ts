import { openAiClient } from './openAiClient';

export async function openAiListMessages(threadId: string, before?: string, after?: string) {
    const threadMessages = await openAiClient().beta.threads.messages.list(threadId, {
        limit: 25,
        after,
        before
    });

    return threadMessages.data;
}

export async function openAiCreateMessage(threadId: string, message: string) {
    return (await openAiClient().beta.threads.messages.create(threadId, {
        content: message,
        role: 'user'
    })).id;
}
