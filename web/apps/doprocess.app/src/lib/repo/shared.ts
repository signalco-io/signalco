import { nanoid } from 'nanoid';
import { sql, eq } from 'drizzle-orm';
import { firstOrDefault } from '@signalco/js';
import { db } from '../db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function publicIdExists(entity: any, publicId: string) {
    return (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(entity).where(eq(entity.publicId, publicId)))?.count ?? 0) > 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function publicIdNext(entity: any, size = 21) {
    let publicId = undefined;
    while (!publicId || await publicIdExists(entity, publicId))
        publicId = nanoid(size);
    return publicId;
}
