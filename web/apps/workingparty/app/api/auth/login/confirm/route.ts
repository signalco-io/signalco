import { loginRequestsVerify } from '../../../../../src/lib/repository/loginRequests';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const json = await request.json();
    let token: string | undefined = undefined;
    if (json && typeof json === 'object' && 'token' in json && typeof json.token === 'string') {
        token = json.token;
    }
    if (!token)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    if (!await loginRequestsVerify(token))
        return Response.json({ error: 'Invalid token' }, { status: 400 });
    return new Response(null, { status: 200 });
}
