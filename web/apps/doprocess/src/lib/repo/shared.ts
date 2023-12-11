import { nanoid } from 'nanoid';
import { AnyMySqlTable } from 'drizzle-orm/mysql-core';
import { count, sql } from 'drizzle-orm';
import { firstOrDefault } from '@signalco/js';
import { db } from '../db';

export async function publicIdExists(entity: AnyMySqlTable, publicId: string) {
    return (firstOrDefault(await db
        .select({ count: count() })
        .from(entity)
        .where(sql`publicId = ${publicId}`)
    )?.count ?? 0) > 0;
}

export async function publicIdNext(entity: AnyMySqlTable, size = 21) {
    let publicId = undefined;
    while (!publicId || await publicIdExists(entity, publicId))
        publicId = nanoid(size);
    return publicId;
}
