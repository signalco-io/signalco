import { documentCreate, documentGet, documentsGet } from '../../../src/lib/repo/documentsRepository';
import { withAuth } from '../../../src/lib/auth/auth';

export async function GET() {
    return await withAuth(async ({ userId }) => {
        const documents = await documentsGet(userId);
        const documentsDto = documents.map(p => ({ ...p, id: p.publicId, publicId: undefined }));
        return Response.json(documentsDto);
    });
}

export async function POST(request: Request) {
    const data = await request.json();
    const name = data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string' ? data.name : null;
    if (name == null) {
        throw new Error('Missing name');
    }

    return await withAuth(async ({ accountId, userId }) => {
        const basedOn = data != null && typeof data === 'object' && 'basedOn' in data && typeof data.basedOn === 'string' ? data.basedOn : undefined;

        const id = await documentCreate(accountId, userId, name, basedOn);

        const document = await documentGet(userId, id);
        return Response.json({ id: document?.publicId });
    });
}
