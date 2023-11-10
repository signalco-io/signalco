import { documentCreate, documentGet, documentsGet } from '../../../src/lib/repo/documentsRepository';
import { ensureUserId } from '../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    const documents = await documentsGet(userId);
    const documentsDto = documents.map(p => ({ ...p, id: p.publicId, publicId: undefined }));
    return Response.json(documentsDto);
}

export async function POST(request: Request) {
    const data = await request.json();
    const name = data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string' ? data.name : '';

    const { userId } = ensureUserId();

    const id = await documentCreate(userId, name);
    const document = await documentGet(userId, Number(id));
    return Response.json({ id: document?.publicId });
}
