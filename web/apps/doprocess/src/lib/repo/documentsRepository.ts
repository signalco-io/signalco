import { firstOrDefault } from '@signalco/js';
import { publicIdNext } from './shared';

function documentSharedWithUser(userId: string | null, includePublic = true) {
    if (!userId && includePublic)
        return sql`"public" MEMBER OF(${document.sharedWithUsers})`;

    if (userId && includePublic)
        return sql`${userId} MEMBER OF(${document.sharedWithUsers})`;

    return or(
        sql`${userId} MEMBER OF(${document.sharedWithUsers})`,
        sql`"public" MEMBER OF(${document.sharedWithUsers})`);
}

export async function getDocumentIdByPublicId(publicId: string) {
    return firstOrDefault(await db
        .select({ id: document.id })
        .from(document)
        .where(
            eq(document.publicId, publicId))
    )?.id;
}

async function isDocumentSharedWithUser(userId: string, documentId: number) {
    return (firstOrDefault(await db
        .select({ count: count() })
        .from(document)
        .where(
            and(
                eq(document.id, documentId),
                documentSharedWithUser(userId)))
    )?.count ?? 0) > 0;
}

export async function documentCreate(userId: string, name: string, basedOn?: string) {
    const id = Number((await db.insert(document).values({
        name,
        publicId: await publicIdNext(document),
        sharedWithUsers: [userId],
        createdBy: userId
    })).insertId);

    // Copy content to new document (if basedOn is provided)
    if (basedOn) {
        const basedOnId = await getDocumentIdByPublicId(basedOn);
        if (basedOnId) {
            const basedOnDocument = await documentGet(userId, basedOnId);
            if (basedOnDocument && typeof basedOnDocument.data === 'string') {
                console.info('Copying document content from (public):', basedOnDocument.publicId, 'to (internal):', id);
                await documentSetData(userId, id, basedOnDocument.data);
            }
        }
    }

    return id;
}

export async function documentsGet(userId: string) {
    return await db.select().from(document).where(documentSharedWithUser(userId, false));
}

export async function documentGet(userId: string | null, id: number) {
    return firstOrDefault(await db
        .select()
        .from(document)
        .where(
            and(
                eq(document.id, id),
                documentSharedWithUser(userId))));
}

export async function documentRename(userId: string, id: number, name: string) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');
    await db.update(document).set({ name, updatedBy: userId, updatedAt: new Date() }).where(eq(document.id, id));
}

export async function documentSetData(userId: string, id: number, data?: string) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');
    await db.update(document).set({ data, updatedBy: userId, updatedAt: new Date() }).where(eq(document.id, id));
}

export async function documentSetSharedWithUsers(userId: string, id: number, sharedWithUsers: string[]) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');
    await db.update(document).set({ sharedWithUsers, updatedBy: userId, updatedAt: new Date() }).where(eq(document.id, id));
}

export async function documentDelete(userId: string, id: number) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');
    await db.delete(document).where(eq(document.id, id));
}
