import { openAiClient } from './openAiClient';

export async function openAiCreateThread() {
    return (await openAiClient().beta.threads.create()).id;
}
