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

        const openai = new OpenAI({ apiKey: global.process.env['OPENAI_API_KEY'] });

        // Use the Responses API to generate suggestions directly
        const prompt = [
            `You are helping to improve a process by suggesting additional, actionable task definitions.`,
            `Process "${process.name}":`,
            taskDefinitions.map(t => `- ${t.text}`).join('\n'),
            '',
            'Return only a concise list of additional suggested tasks as bullet points, each starting with "- ".',
            'Do not repeat existing tasks. No preamble or explanation—just the list.'
        ].join('\n');

        const response = await openai.responses.create({
            // Choose a small, capable model; adjust per your account availability
            model: 'gpt-4o-mini',
            input: prompt
        });

        // Consolidated text output from Responses API
        const outputText = (response as { output_text?: string })?.output_text;

        // Construct suggestions from the output text
        const suggestions = (outputText ?? '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('- '))
            .map(line => line.substring(2));

        return Response.json({
            suggestions
        } satisfies ProcessTaskDefinitionsSuggestionsDto);
    });
}
