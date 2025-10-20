import { openAiCreateRunAndPoll } from '../openAiRuns';
import { openAiCreateMessage, openAiListMessages } from '../openAiMessages';
import { workersGet } from './workersRepository';
import { threadsGet } from './threadsRepository';

export async function messagesGetAll(accountId: string, threadId: string, before?: string, after?: string) {
    const threadMessages = await openAiListMessages(accountId, threadId, before, after);
    return threadMessages;
}

export async function messagesCreateAndPoll(accountId: string, workerId: string, threadId: string, message: string) {
    const [{ model, instructions }] = await Promise.all([
        workersGet(accountId, workerId)
    ]);

    await openAiCreateMessage(accountId, threadId, message, 'user');
    const { runId, status, usage } = await openAiCreateRunAndPoll(accountId, threadId, model, instructions);

    return {
        runId,
        status,
        usage
    };
}
