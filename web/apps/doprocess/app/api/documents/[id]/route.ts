import { documentDelete, documentGet, documentRename, documentSetData, documentSetSharedWithUsers, getDocumentIdByPublicId } from '../../../../src/lib/repo/documentsRepository';
import { ensureUserId, optionalUserId } from '../../../../src/lib/auth/apiAuth';
import { requiredParamString } from '../../../../src/lib/api/apiParam';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const documentPublicId = requiredParamString(params.id);
    const { userId } = optionalUserId();

    const documentId = await getDocumentIdByPublicId(documentPublicId);
    if (documentId == null)
        return new Response(null, { status: 404 });

    const document = await documentGet(userId, documentId);
    const documentDto = document != null ? { ...document, id: document.publicId, publicId: undefined } : null;
    return Response.json(documentDto);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const documentPublicId = requiredParamString(params.id);
    const { userId } = ensureUserId();

    const documentId = await getDocumentIdByPublicId(documentPublicId);
    if (documentId == null)
        return new Response(null, { status: 404 });

    const data = await request.json();
    if (data != null && typeof data === 'object') {
        if ('name' in data && typeof data.name === 'string') {
            await documentRename(userId, documentId, data.name);
        }
        if ('data' in data && typeof data.data === 'string') {
            await documentSetData(userId, documentId, data.data);
        }
        if ('sharedWithUsers' in data && Array.isArray(data.sharedWithUsers) && data.sharedWithUsers.every(x => typeof x === 'string')) {
            await documentSetSharedWithUsers(userId, documentId, data.sharedWithUsers as string[]);
        }
    }
    return Response.json(null);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    const documentPublicId = requiredParamString(params.id);
    const { userId } = ensureUserId();

    const documentId = await getDocumentIdByPublicId(documentPublicId);
    if (documentId == null)
        return new Response(null, { status: 404 });

    await documentDelete(userId, documentId);
    return Response.json(null);
}
