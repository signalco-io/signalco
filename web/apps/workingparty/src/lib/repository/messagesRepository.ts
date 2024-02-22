import { openAiCreateRun } from '../openAiRuns';
import { openAiCreateMessage, openAiListMessages } from '../openAiMessages';
import { workersGet } from './workersRepository';
import { threadsGet } from './threadsRepository';

export async function messagesGetAll(threadId: string, before?: string, after?: string) {
    const { oaiThreadId } = await threadsGet(threadId);
    const threadMessages = await openAiListMessages(oaiThreadId, before, after);
    return threadMessages;
}

export async function messagesCreate(workerId: string, threadId: string, message: string) {
    const { oaiThreadId } = await threadsGet(threadId);
    const { oaiAssistantId } = await workersGet(workerId);

    await openAiCreateMessage(oaiThreadId, message);
    const oaiRunId = await openAiCreateRun(oaiThreadId, oaiAssistantId);

    return {
        runId: oaiRunId
    };
}
