import { createProcess, getProcess, getProcesses } from '../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    const processes = await getProcesses(userId);
    const processesDto = processes.map(p => ({ ...p, id: p.publicId, publicId: undefined }));
    return Response.json(processesDto);
}

export async function POST(request: Request) {
    const { userId } = ensureUserId();
    const req = await request.json();
    const name = typeof req === 'object' && req != null && 'name' in req && typeof req.name === 'string' ? req.name.toString() : null;
    if (name == null)
        throw new Error('Missing name');
    const id = await createProcess(userId, name);
    const process = await getProcess(userId, Number(id));
    return Response.json({ id: process?.publicId });
}
