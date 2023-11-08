import { and, eq, like, sql } from 'drizzle-orm';
import { firstOrDefault } from '@signalco/js';
import { document } from '../db/schema';
import { db } from '../db';

function documentSharedWithUser(userId: string) {
    return like(document.sharedWithUsers, `%\"${userId}\"%`);
}

async function isDocumentSharedWithUser(userId: string) {
    return (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(document).where(documentSharedWithUser(userId)))?.count ?? 0) > 0;
}

export async function documentCreate(userId: string, name: string) {
    return (await db.insert(document).values({
        name,
        sharedWithUsers: [userId],
    })).insertId;
}

export async function documentsGet(userId: string) {
    return await db.select().from(document).where(documentSharedWithUser(userId));
}

export async function documentGet(userId: string, id: number) {
    return firstOrDefault(await db.select().from(document).where(and(documentSharedWithUser(userId), eq(document.id, id))));
}

export async function documentRename(userId: string, id: number, name: string) {
    if (!await isDocumentSharedWithUser(userId))
        throw new Error('Not found');
    await db.update(document).set({ name }).where(eq(document.id, id));
}

export async function documentSetData(userId: string, id: number, data?: string) {
    if (!await isDocumentSharedWithUser(userId))
        throw new Error('Not found');
    await db.update(document).set({ data }).where(eq(document.id, id));
}

export async function documentDelete(userId: string, id: number) {
    if (!await isDocumentSharedWithUser(userId))
        throw new Error('Not found');
    await db.delete(document).where(eq(document.id, id));
}
