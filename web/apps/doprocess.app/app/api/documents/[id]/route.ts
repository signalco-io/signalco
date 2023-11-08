import { documentDelete, documentGet, documentRename, documentSetData } from '../../../../src/lib/repo/documentsRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';
import { requiredParamNumber } from '../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const documentId = requiredParamNumber(params.id);
    const { userId } = ensureUserId();
    return Response.json(await documentGet(userId, documentId));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const documentId = requiredParamNumber(params.id);
    const { userId } = ensureUserId();
    const data = await request.json();
    if (data != null && typeof data === 'object') {
        if ('name' in data && typeof data.name === 'string') {
            await documentRename(userId, documentId, data.name);
        }
        if ('data' in data && typeof data.data === 'string') {
            await documentSetData(userId, documentId, data.data);
        }
    }
    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    const documentId = requiredParamNumber(params.id);
    const { userId } = ensureUserId();
    await documentDelete(userId, documentId);
    return Response.json(null);
}
