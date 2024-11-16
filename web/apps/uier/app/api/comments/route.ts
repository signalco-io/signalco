import { createComment, getComments, updateComment } from '../../../src/lib/repo/commentsRepo';

export async function GET(request: Request) {
    const domain = request.headers.get('host');
    if (!domain)
        return new Response('Couldn\'t resolve domain', { status: 402 });

    const comments = await getComments(domain);
    return Response.json(comments);
}

export async function POST(request: Request) {
    const domain = request.headers.get('host');
    if (!domain)
        return new Response('Couldn\'t resolve domain', { status: 402 });

    const comment = await request.json() as {
        id?: string,
        path: string,
        position: object, // TODO: Types
        thread: object, // TODO: Types
        device?: object, // TODO: Types
        resolved?: boolean
    };

    if (comment.id) {
        await updateComment(domain, comment.id, comment);
        return Response.json({ id: comment.id });
    } else {
        const id = await createComment({ domain, ...comment });
        return Response.json({ id }, { status: 201 });
    }
}
