import { createProcess, getProcesses } from '../../../src/lib/repo/processesRepository';

export async function GET() {
    return Response.json(await getProcesses());
}

export async function POST(request: Request) {
    const req = await request.json();
    const name = typeof req === 'object' && req != null && 'name' in req && typeof req.name === 'string' ? req.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');
    return Response.json({ id: await createProcess(name) });
}
