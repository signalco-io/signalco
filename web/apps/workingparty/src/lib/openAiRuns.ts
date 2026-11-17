import { openAiClient } from './openAiClient';
import { openAiListMessages, openAiCreateMessage } from './openAiMessages';

export async function openAiCreateRunAndPoll(accountId: string, threadId: string, model: string, instructions?: string) {
    // Build messages history for chat completions
    const history = await openAiListMessages(accountId, threadId);
    const messages = [
        ...(instructions ? [{ role: 'system' as const, content: instructions }] : []),
        ...history.reverse().map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }))
    ];

    const openai = openAiClient();
    const transcript = messages
        .map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`)
        .join('\n');
    const response = await openai.responses.create({
        model,
        instructions,
        input: transcript
    });

    // Prefer the SDK's output_text and _request_id properties if available
    const content = response?.output_text ?? '';
    if (content) {
        await openAiCreateMessage(accountId, threadId, content, 'assistant');
    }

    return {
        runId: response?.id
            ?? response?._request_id
            ?? crypto.randomUUID(),
        status: 'completed' as const,
        usage: response?.usage
    };
}
