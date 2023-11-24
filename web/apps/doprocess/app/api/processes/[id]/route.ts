import { deleteProcess, getProcess, getProcessIdByPublicId, renameProcess } from '../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);

    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const process = await getProcess(userId, processId);
    const processDto = process != null ? {
        ...process,
        id: process.publicId,
        publicId: undefined
    } : null;
    return Response.json(processDto);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);
    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    const data = await request.json();
    if (data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string') {
        await renameProcess(userId, processId, data.name);
    }

    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    const processPublicId = requiredParamString(params.id);
    const { userId } = ensureUserId();

    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return new Response(null, { status: 404 });

    await deleteProcess(userId, processId);

    return Response.json(null);
}
