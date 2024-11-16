import { openAiClient } from './openAiClient';

export async function openAiCreateRunAndPoll(threadId: string, assistantId: string) {
    const run = (await openAiClient().beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId
    }));

    return {
        runId: run.id,
        status: run.status,
        usage: run.usage
    };
}
