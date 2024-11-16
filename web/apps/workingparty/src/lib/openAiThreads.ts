import { openAiClient } from './openAiClient';

export async function openAiCreateThread() {
    return (await openAiClient().beta.threads.create()).id;
}

export function openAiDeleteThread(threadId: string) {
    return openAiClient().beta.threads.del(threadId);
}
