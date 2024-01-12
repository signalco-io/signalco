import { documentCreate, documentGet, documentsGet } from '../../../src/lib/repo/documentsRepository';
import { ensureUserId } from '../../../src/lib/auth/apiAuth';

export const runtime = 'edge';

export async function GET() {
    const { userId } = ensureUserId();
    const documents = await documentsGet(userId);
    const documentsDto = documents.map(p => ({ ...p, id: p.publicId, publicId: undefined }));
    return Response.json(documentsDto);
}

export async function POST(request: Request) {
    const data = await request.json();
    const name = data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string' ? data.name : null;
    if (name == null) {
        throw new Error('Missing name');
    }

    const { userId } = ensureUserId();

    const basedOn = data != null && typeof data === 'object' && 'basedOn' in data && typeof data.basedOn === 'string' ? data.basedOn : undefined;

    const id = await documentCreate(userId, name, basedOn);

    const document = await documentGet(userId, id);
    return Response.json({ id: document?.publicId });
}
