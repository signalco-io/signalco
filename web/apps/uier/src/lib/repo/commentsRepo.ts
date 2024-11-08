import { nanoid } from 'nanoid';
import { DbComment } from '../db/schema';
import { cosmosDataContainerComments } from '../db/client';

export async function getComments(domain: string) {
    return (await cosmosDataContainerComments().items.query<DbComment>({
        query: 'SELECT * FROM c WHERE c.domain = @domain',
        parameters: [{ name: '@domain', value: domain }]
    }).fetchAll()).resources;
}

export async function createComment({ domain, path, position, thread, device }: { domain: string, path: string, position: object, thread: object, device?: object }) {
    const container = cosmosDataContainerComments();
    const commentId = `comment_${nanoid()}`;
    await container.items.create<DbComment>({
        id: commentId,
        domain,
        path,
        position, // TODO: Sanitize
        thread, // TODO: Sanitize
        device, // TODO: Sanitize
    });
    return commentId;
}

export async function updateComment(domain: string, id: string, comment: { path: string, position: object, thread: object, device?: object, resolved?: boolean }) {
    const container = cosmosDataContainerComments();
    await container.item(id, domain).replace<DbComment>({
        id,
        domain,
        ...comment
    });
}

export async function deleteComment(domain: string, id: string) {
    await cosmosDataContainerComments().item(id, domain).delete();
}