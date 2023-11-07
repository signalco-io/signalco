import { createProcess, getProcesses } from '../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    return Response.json(await getProcesses(userId));
}

export async function POST(request: Request) {
    const { userId } = ensureUserId();
    const req = await request.json();
    const name = typeof req === 'object' && req != null && 'name' in req && typeof req.name === 'string' ? req.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');
    return Response.json({ id: await createProcess(userId, name) });
}
