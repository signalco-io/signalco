import { auth } from '@clerk/nextjs';
import { createProcess, getProcesses } from '../../../src/lib/repo/processesRepository';

export async function GET() {
    const { userId } = auth();
    if (userId == null)
        return new Response(null, { status: 401 });

    return Response.json(await getProcesses(userId));
}

export async function POST(request: Request) {
    const { userId } = auth();
    if (userId == null)
        return new Response(null, { status: 401 });

    const req = await request.json();
    const name = typeof req === 'object' && req != null && 'name' in req && typeof req.name === 'string' ? req.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');
    return Response.json({ id: await createProcess(userId, name) });
}
