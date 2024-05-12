import { nanoid } from 'nanoid';
import { firstOrDefault } from '@signalco/js';
import { DbWithPublicId } from '../db/schema';

export async function publicIdExists(entity: DbWithPublicId, publicId: string) {
    // return (firstOrDefault(await db
    //     .select({ count: count() })
    //     .from(entity)
    //     .where(sql`publicId = ${publicId}`)
    // )?.count ?? 0) > 0;
    throw new Error('Not implemented');
}

export async function publicIdNext(entity: DbWithPublicId, size = 21) {
    let publicId = undefined;
    while (!publicId || await publicIdExists(entity, publicId))
        publicId = nanoid(size);
    return publicId;
}
