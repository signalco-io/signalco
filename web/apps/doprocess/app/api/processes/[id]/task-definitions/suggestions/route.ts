import OpenAI from 'openai';
import { getProcess, getProcessIdByPublicId, getTaskDefinitions } from '../../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const process = await getProcess(userId, processId);
    if (process == null)
        return new Response(null, { status: 404 });
    const taskDefinitions = await getTaskDefinitions(userId, processId);

    const assistantId = 'asst_rgjTqqv25NSyZVWVaySzKnI8';
    const result = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
            messages: [
                { role: 'user', content: `Process \"${process.name}\":\n${taskDefinitions.map(t => '- ' + t.text).join('\n')}\n\n` }
            ]
        }
    });

    let run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id);

    // Wait for the run to complete
    const maxDuration = 20000;
    const delay = 500;
    let retries = 0;
    while ((run.status === 'in_progress' || run.status === 'queued') && retries++ < maxDuration / delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        run = await openai.beta.threads.runs.retrieve(result.thread_id, run.id);
    }

    // Extract suggestions from the run
    const messages = await openai.beta.threads.messages.list(result.thread_id);
    const suggestions = messages.data
        .filter(i => i.role === 'assistant')
        .flatMap(m => m.content
            .map(i => i.type === 'text' ? i.text.value : null)
            .filter(Boolean)
            .map(text => text.split('\n').filter(i => i.startsWith('- ')).map(i => i.substring(2))));

    return Response.json({
        suggestions
    });
}
