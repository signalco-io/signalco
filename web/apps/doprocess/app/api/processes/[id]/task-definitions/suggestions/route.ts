import { OpenAI } from 'openai';
import { ProcessTaskDefinitionsSuggestionsDto } from '../../../../dtos/dtos';
import { entityIdByPublicId } from '../../../../../../src/lib/repo/shared';
import { getProcess, getTaskDefinitions } from '../../../../../../src/lib/repo/processesRepository';
import { cosmosDataContainerProcesses } from '../../../../../../src/lib/db/client';
import { withAuth } from '../../../../../../src/lib/auth/auth';
import { requiredParamString } from '../../../../../../src/lib/api/apiParam';



export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const processPublicId = requiredParamString(id);

    return await withAuth(async ({ userId }) => {
        const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
        if (processId == null)
            return new Response(null, { status: 404 });

        const process = await getProcess(userId, processId);
        if (process == null)
            return new Response(null, { status: 404 });
        const taskDefinitions = await getTaskDefinitions(userId, processId);

        const assistantId = 'asst_rgjTqqv25NSyZVWVaySzKnI8';
        const openai = new OpenAI({
            apiKey: global.process.env['OPENAI_API_KEY']
        });
        const result = await openai.beta.threads.createAndRun({
            assistant_id: assistantId,
            thread: {
                messages: [
                    { role: 'user', content: `Process \"${process.name}\":\n${taskDefinitions.map(t => '- ' + t.text).join('\n')}\n\n` }
                ]
            }
        });

        let run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id);
        console.debug('OpenAI run:', run);

        // Wait for the run to complete
        const maxDuration = 20000;
        const delay = 500;
        let retries = 0;
        while ((run.status === 'in_progress' || run.status === 'queued') && retries++ < maxDuration / delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
            run = await openai.beta.threads.runs.retrieve(result.thread_id, run.id);
            console.debug('OpenAI run in-progress/queued:', run.id, run.status);
        }

        console.debug('OpenAI run completed:', run.id, run.status);

        // Retrieve thread messages
        const messages = await openai.beta.threads.messages.list(result.thread_id);
        console.debug('OpenAI run messages:', run.id, result.thread_id, JSON.stringify(messages.data));

        // Construct suggestions from the messages
        const suggestions = messages.data
            .filter(i => i.role === 'assistant')
            .flatMap(m => m.content
                .map(i => i.type === 'text' ? i.text.value : null)
                .filter(Boolean)
                .flatMap(text => text.split('\n').filter(i => i.startsWith('- ')).map(i => i.substring(2))));

        return Response.json({
            suggestions
        } satisfies ProcessTaskDefinitionsSuggestionsDto);
    });
}
