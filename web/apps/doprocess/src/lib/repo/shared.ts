import { nanoid } from 'nanoid';
import { firstOrDefault } from '@signalco/js';
import { Container } from '@azure/cosmos';
import { DbWithShare } from '../db/schema';

export function entitySharedWithUser(userId: string | null, document: DbWithShare, includePublic = true) {
    if (document.sharedWithUsers.includes('public') && includePublic)
        return true;

    if (!userId)
        return false;

    return document.sharedWithUsers.includes(userId);
}

export async function entityIdByPublicId(container: Container, publicId: string): Promise<string | undefined> {
    return firstOrDefault((await container.items.query({
        query: 'SELECT * FROM c WHERE c.publicId = @publicId',
        parameters: [{ name: '@publicId', value: publicId }]
    }).fetchAll()).resources)?.id;
}

export async function publicIdExists(entityContainer: Container, publicId: string) {
    return (await entityContainer.items.query({
        query: 'SELECT * FROM c WHERE c.publicId = @publicId',
        parameters: [{ name: '@publicId', value: publicId }]
    }).fetchAll()).resources.length > 0;
}

export async function publicIdNext(entityContainer: Container, size = 21) {
    let publicId = undefined;
    while (!publicId || await publicIdExists(entityContainer, publicId))
        publicId = nanoid(size);
    return publicId;
}
