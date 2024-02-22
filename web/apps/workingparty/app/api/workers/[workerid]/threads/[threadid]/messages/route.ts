import { threadsGet } from '../../../../../../../src/lib/repository/threadsRepository';
import { messagesCreate, messagesGetAll } from '../../../../../../../src/lib/repository/messagesRepository';
import { openAiCreateThread } from '../../../../../../../src/lib/openAiThreads';
import { openAiCreateRun, openAiWaitForRunCompletion } from '../../../../../../../src/lib/openAiRuns';
import { openAiCreateMessage, openAiListMessages } from '../../../../../../../src/lib/openAiMessages';
import { cosmosDataContainerThreads } from '../../../../../../../src/lib/cosmosClient';

export async function GET(request: Request, { params }: { params: { threadid: string } }) {
    const { threadid } = params;

    const { searchParams } = new URL(request.url);
    const before = searchParams.get('before') || undefined;
    const after = searchParams.get('after') || undefined;

    const threadMessages = await messagesGetAll(threadid, before, after);

    // Remove message with before and after ids
    if (before) {
        const beforeIndex = threadMessages.findIndex(m => m.id === before);
        if (beforeIndex >= 0)
            threadMessages.splice(beforeIndex);
    }
    if (after) {
        const afterIndex = threadMessages.findIndex(m => m.id === after);
        if (afterIndex >= 0)
            threadMessages.splice(0, afterIndex + 1);
    }

    console.log('Fetching messages after:', after, 'before:', before, 'got:', threadMessages.length);

    return Response.json(threadMessages);
}

export async function POST(request: Request, { params }: { params: { workerid: string, threadid: string } }) {
    const { workerid, threadid } = params;

    // Extrac message from JSON payload
    let message = null;
    const data = await request.json();
    if (data != null && typeof data === 'object') {
        if ('message' in data && typeof data.message === 'string') {
            message = data.message;
        }
    }
    if (!message)
        return new Response(null, { status: 403 });

    // Create message, trigger run and wait for completion
    const { runId: oaiRunId } = await messagesCreate(workerid, threadid, message);

    // TODO: Run asynchrously
    const { name, oaiThreadId } = await threadsGet(threadid);
    await openAiWaitForRunCompletion(oaiThreadId, oaiRunId);

    // Caption conversation if not already
    let updatedThread = false;
    if (name === 'New Thread') {
        try {
            const messages = await messagesGetAll(threadid);
            const messagesExtract = messages
                .flatMap(m => m.content)
                .filter(c => c.type === 'text')
                .map(c => c.type === 'text' ? c.text.value : '')
                .join('\n');

            console.debug('Captioning conversation' + messagesExtract)

            const captionThreadId = await openAiCreateThread();
            await openAiCreateMessage(captionThreadId, messagesExtract);
            const captionRunId = await openAiCreateRun(captionThreadId, 'asst_k3WyBmipDob1EpNLS85oTgnx');
            await openAiWaitForRunCompletion(captionThreadId, captionRunId);
            const captionMessages = await openAiListMessages(captionThreadId);
            const captionAnswerMessageContent = captionMessages.at(0)?.content.at(0);
            if (captionAnswerMessageContent?.type === 'text' &&
                captionAnswerMessageContent.text.value.length > 0) {
                await cosmosDataContainerThreads().item(threadid, threadid).patch([
                    { op: 'set', path: '/name', value: captionAnswerMessageContent.text.value }
                ]);
                updatedThread = true;
            }
        } catch (e) {
            console.error('Failed to caption conversation', e);
        }
    }

    return Response.json({
        runId: oaiRunId,
        updatedThread: updatedThread,
    });
}
