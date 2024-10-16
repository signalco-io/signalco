import { threadsGet } from '../../../../../../../src/lib/repository/threadsRepository';
import { messagesCreateAndPoll, messagesGetAll } from '../../../../../../../src/lib/repository/messagesRepository';
import { accountUsageIncrement, accountUsageOverLimit } from '../../../../../../../src/lib/repository/accountsRepository';
import { openAiCreateThread } from '../../../../../../../src/lib/openAiThreads';
import { openAiCreateRunAndPoll } from '../../../../../../../src/lib/openAiRuns';
import { openAiCreateMessage, openAiListMessages } from '../../../../../../../src/lib/openAiMessages';
import { cosmosDataContainerThreads } from '../../../../../../../src/lib/cosmosClient';
import { withAuth } from '../../../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { threadid: string } }) {
    const { threadid } = params;

    const { searchParams } = new URL(request.url);
    const before = searchParams.get('before') || undefined;
    const after = searchParams.get('after') || undefined;

    return await withAuth(async ({ accountId }) => {
        const threadMessages = await messagesGetAll(accountId, threadid, before, after);

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
    });
}

export async function POST(request: Request, { params }: { params: { workerid: string, threadid: string } }) {
    const { workerid, threadid } = params;

    return await withAuth(async ({ accountId }) => {
        // Extract message from JSON payload
        let message: string | null = null;
        const data = await request.json();
        if (data != null && typeof data === 'object') {
            if ('message' in data && typeof data.message === 'string') {
                message = data.message;
            }
        }
        if (!message)
            return new Response(null, { status: 400 });

        // Check limit
        if (await accountUsageOverLimit(accountId, 'messages'))
            return Response.json({ error: 'You exceeded your current quota, please check your plan and billing details' }, { status: 429 });

        // TODO: Run asynchrously in another route meybe (without inline polling when creating message)
        // Create message, trigger run and wait for completion
        const { runId: oaiRunId, status: oaiStatus, usage: oaiUsage } = await messagesCreateAndPoll(accountId, workerid, threadid, message);
        if (oaiStatus !== 'completed') {
            console.error('OpenAI run', oaiRunId, 'failed with status', oaiStatus);
            return new Response(null, { status: 500 });
        }

        // TODO: Do this parallel with other tasks
        await accountUsageIncrement(accountId, {
            messages: 1,
            oaigpt35tokens: oaiUsage?.total_tokens
        });

        // Caption conversation if not already
        let updatedThread = false;
        const { name } = await threadsGet(accountId, threadid);
        if (name === 'New Thread') {
            try {
                const messages = await messagesGetAll(accountId, threadid);
                const messagesExtract = messages
                    .flatMap(m => m.content)
                    .filter(c => c.type === 'text')
                    .map(c => c.type === 'text' ? c.text.value : '')
                    .join('\n');

                console.debug('Captioning conversation' + messagesExtract)

                const captionThreadId = await openAiCreateThread();
                await openAiCreateMessage(captionThreadId, messagesExtract);
                const { status: oaiCaptionStatus } = await openAiCreateRunAndPoll(captionThreadId, 'asst_k3WyBmipDob1EpNLS85oTgnx');
                if (oaiCaptionStatus !== 'completed') {
                    console.warn('OpenAI captioning run failed', oaiCaptionStatus);
                    throw new Error('OpenAI captioning run failed');
                }

                const captionMessages = await openAiListMessages(captionThreadId);
                const captionAnswerMessageContent = captionMessages.at(0)?.content.at(0);
                if (captionAnswerMessageContent?.type === 'text' &&
                    captionAnswerMessageContent.text.value.length > 0) {
                    await cosmosDataContainerThreads().item(threadid, accountId).patch([
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
    });
}
