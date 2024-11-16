import { objectWithKey, orderBy } from '@signalco/js';
import { getAsync, requestAsync } from '../services/HttpService';
import IEntityDetails from './IEntityDetails';

function mapEntityDetailsFromDto(e: unknown) {
    if (typeof e === 'object' && e != null) {
        return {
            ...e,
            timeStamp: 'timeStamp' in e && typeof e.timeStamp === 'string' ? new Date(e.timeStamp) : undefined,
            contacts: 'contacts' in e && Array.isArray(e.contacts)
                ? e.contacts.map((c) => typeof c === 'object' ? ({
                    ...c,
                    timeStamp: c != null && 'timeStamp' in c && typeof c.timeStamp === 'string' ? new Date(c.timeStamp) : undefined,
                    metadata: c != null && 'metadata' in c && typeof c.metadata === 'string' ? JSON.parse(c.metadata) : undefined
                }) : null).filter(Boolean)
                : undefined
        } as IEntityDetails;
    }
    return null;
}

export async function entityAsync(id: string) {
    try {
        const entity = await getAsync(`/entity/${id}`);
        return mapEntityDetailsFromDto(entity);
    } catch (error) {
        const errorStatusCode = objectWithKey(objectWithKey(error, 'cause')?.cause, 'statusCode')?.statusCode;
        if (errorStatusCode === 404) {
            console.debug('Entity not found', id);
            return null;
        }
        throw error;
    }
}

export async function entityRenameAsync(id: string, newAlias: string) {
    const entity = await entityAsync(id);
    if (entity == null)
        throw new Error(`Unknown entity "${id}"`);

    await entityUpsertAsync(id, entity.type, newAlias);
}

export async function entitiesAsync(type?: number) {
    const data = await requestAsync('/entities?types=' + type, 'get');
    if (Array.isArray(data)) {
        let entities = data.map(mapEntityDetailsFromDto) as IEntityDetails[];
        if (typeof type !== 'undefined') {
            entities = entities.filter(e => e.type === type);
        }
        return orderBy(entities, (a, b) => a.alias?.localeCompare(b.alias));
    }
}

export async function entityUpsertAsync(id: string | undefined, type: number, alias: string) {
    return (await requestAsync('/entity', 'post', {
        id: id,
        type: type,
        alias: alias
    }) as { id: string })?.id;
}

export async function entityDeleteAsync(id: string) {
    await requestAsync('/entity', 'delete', { id: id });
}
