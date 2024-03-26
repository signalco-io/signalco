import { OpenAI } from 'openai';

export function openAiClient() {
    const apiKey = global.process.env['OPENAI_API_KEY'];
    if (!apiKey)
        throw new Error('OPENAI_API_KEY is not available in the environment. Please set it before using this feature.');

    return new OpenAI({
        apiKey
    });
}
