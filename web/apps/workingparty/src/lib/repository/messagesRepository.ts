import { openAiCreateRun } from '../openAiRuns';
import { openAiCreateMessage, openAiListMessages } from '../openAiMessages';
import { workersGet } from './workersRepository';
import { threadsGet } from './threadsRepository';

export async function messagesGetAll(accountId: string, threadId: string, before?: string, after?: string) {
    const { oaiThreadId } = await threadsGet(accountId, threadId);
    const threadMessages = await openAiListMessages(oaiThreadId, before, after);
    return threadMessages;
}

export async function messagesCreate(accountId: string, workerId: string, threadId: string, message: string) {
    const [{ oaiThreadId }, { oaiAssistantId }] = await Promise.all([
        threadsGet(accountId, threadId),
        workersGet(accountId, workerId)
    ]);

    await openAiCreateMessage(oaiThreadId, message);
    const oaiRunId = await openAiCreateRun(oaiThreadId, oaiAssistantId);

    return {
        runId: oaiRunId
    };
}
