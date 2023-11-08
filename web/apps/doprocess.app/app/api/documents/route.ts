import { documentCreate, documentsGet } from '../../../src/lib/repo/documentsRepository';
import { ensureUserId } from '../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    return Response.json(await documentsGet(userId));
}

export async function POST(request: Request) {
    const data = await request.json();
    const name = data != null && typeof data === 'object' && 'name' in data && typeof data.name === 'string' ? data.name : '';

    const { userId } = ensureUserId();

    return Response.json({ id: await documentCreate(userId, name) });
}
