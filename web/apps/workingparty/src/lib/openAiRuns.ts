import { openAiClient } from './openAiClient';

export async function openAiCreateRun(threadId: string, assistantId: string) {
    return (await openAiClient().beta.threads.runs.create(threadId, {
        assistant_id: assistantId
    })).id;
}

export async function openAiWaitForRunCompletion(threadId: string, runId: string) {
    const openai = openAiClient();
    const maxDurationMs = 20000;
    const delayMs = 100;
    let retries = 0;
    let run = await openai.beta.threads.runs.retrieve(threadId, runId);
    while ((run.status === 'in_progress' || run.status === 'queued') && retries++ < maxDurationMs / delayMs) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        run = await openai.beta.threads.runs.retrieve(threadId, run.id);
        console.debug('OpenAI run', run.id, 'status', run.status);
    }

    if (run.status !== 'completed')
        throw new Error('Run did not complete in time');
}
