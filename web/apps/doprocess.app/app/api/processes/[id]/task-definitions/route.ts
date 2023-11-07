import { createTaskDefinition, getTaskDefinitions } from '../../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);

    const { userId } = ensureUserId();

    return Response.json(await getTaskDefinitions(userId, processId));
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const processId = requiredParamNumber(params.id);

    const data = await request.json();
    const text = data != null && typeof data === 'object' && 'text' in data && typeof data.text === 'string' ? data.text : '';
    const description = data != null && typeof data === 'object' && 'description' in data && typeof data.description === 'string' ? data.description : '';

    const { userId } = ensureUserId();

    return Response.json({ id: await createTaskDefinition(userId, processId, text, description) });
}
