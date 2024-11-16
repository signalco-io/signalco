import { createProcess, getProcess, getProcesses } from '../../../src/lib/repo/processesRepository';
import { withAuth } from '../../../src/lib/auth/auth';



export async function GET() {
    return await withAuth(async ({ userId }) => {
        const processes = await getProcesses(userId);
        const processesDto = processes.map(p => ({ ...p, id: p.publicId, publicId: undefined }));
        return Response.json(processesDto);
    });
}

export async function POST(request: Request) {
    return await withAuth(async ({ userId, accountId }) => {
        const req = await request.json();
        const name = typeof req === 'object' && req != null && 'name' in req && typeof req.name === 'string' ? req.name.toString() : null;
        if (name == null)
            throw new Error('Missing name');

        const basedOn = typeof req === 'object' && req != null && 'basedOn' in req && typeof req.basedOn === 'string' ? req.basedOn.toString() : undefined;
        const id = await createProcess(accountId, userId, name, basedOn);

        const process = await getProcess(userId, id);
        return Response.json({ id: process?.publicId });
    });
}
