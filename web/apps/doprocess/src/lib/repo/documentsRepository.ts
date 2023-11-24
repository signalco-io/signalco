import { and, eq, like, or, sql } from 'drizzle-orm';
import { firstOrDefault } from '@signalco/js';
import { document } from '../db/schema';
import { db } from '../db';
import { publicIdNext } from './shared';

function documentSharedWithUser(userId: string | null) {
    if (!userId)
        return like(document.sharedWithUsers, '%\"public\"%');

    return or(
        like(document.sharedWithUsers, `%\"${userId}\"%`),
        like(document.sharedWithUsers, '%\"public\"%'));
}

export async function getDocumentIdByPublicId(publicId: string) {
    return firstOrDefault(await db.select({ id: document.id }).from(document).where(eq(document.publicId, publicId)))?.id;
}

async function isDocumentSharedWithUser(userId: string, documentId: number) {
    return (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(document).where(and(eq(document.id, documentId), documentSharedWithUser(userId))))?.count ?? 0) > 0;
}

export async function documentCreate(userId: string, name: string) {
    return (await db.insert(document).values({
        name,
        publicId: await publicIdNext(document),
        sharedWithUsers: [userId],
        createdBy: userId
    })).insertId;
}

export async function documentsGet(userId: string) {
    return await db.select().from(document).where(documentSharedWithUser(userId));
}

export async function documentGet(userId: string | null, id: number) {
    return firstOrDefault(await db.select().from(document).where(and(eq(document.id, id), documentSharedWithUser(userId))));
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
