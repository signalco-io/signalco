import { OpenAI } from 'openai';

export function openAiClient() {
    return new OpenAI({
        apiKey: global.process.env['OPENAI_API_KEY']
    });
}

export async function GET(_request: Request, { params }: { params: { threadid: string } }) {
    const { threadid } = params;
    const threadMessages = await openAiClient().beta.threads.messages.list(threadid);
    return Response.json(threadMessages.data);
}

export async function POST(request: Request, { params }: { params: { workerid: string, threadid: string } }) {
    const { workerid, threadid } = params;

    let message = null;
    const data = await request.json();
    if (data != null && typeof data === 'object') {
        if ('message' in data && typeof data.message === 'string') {
            message = data.message;
        }
    }

    if (!message)
        return new Response(null, { status: 403 });

    const openai = openAiClient();
    await openai.beta.threads.messages.create(threadid, {
        content: message,
        role: 'user'
    });

    let run = await openai.beta.threads.runs.create(threadid, {
        assistant_id: workerid
    });

    const maxDuration = 20000;
    const delay = 500;
    let retries = 0;
    while ((run.status === 'in_progress' || run.status === 'queued') && retries++ < maxDuration / delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        run = await openai.beta.threads.runs.retrieve(threadid, run.id);
        console.debug('OpenAI run in-progress/queued:', run.id, run.status);
    }

    return Response.json({
        runId: run.id
    });
}
