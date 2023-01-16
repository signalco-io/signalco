import { getAsync, requestAsync } from '../services/HttpService';
import { orderBy } from '../../src/helpers/ArrayHelpers';
import IEntityDetails from './IEntityDetails';

function mapEntityDetailsFromDto(e: any) {
    return {
        ...e,
        timeStamp: e.timeStamp ? new Date(e.timeStamp) : undefined,
        contacts: e.contacts.map((c: any) => ({
            ...c,
            timeStamp: c.timeStamp ? new Date(c.timeStamp) : undefined
        }))
    } as IEntityDetails;
}

export async function entityAsync(id: string) {
    const entity = await getAsync(`/entity/${id}`);
    if (!entity)
        throw new Error('Entity not found');

    return mapEntityDetailsFromDto(entity);
}

export async function entityRenameAsync(id: string, newAlias: string) {
    const entity = await entityAsync(id);
    if (entity == null)
        throw new Error(`Unknown entity \"${id}\"`);

    await entityUpsertAsync(id, entity.type, newAlias);
}

export async function entitiesAsync(type?: number) {
    let entities = (await requestAsync('/entity', 'get')).map(mapEntityDetailsFromDto) as IEntityDetails[];
    if (typeof type !== 'undefined') {
        entities = entities.filter(e => e.type === type);
    }
    return orderBy(entities, (a, b) => a.alias?.localeCompare(b.alias));
}

export async function entityUpsertAsync(id: string | undefined, type: number, alias: string) {
    return (await requestAsync('/entity', 'post', {
        id: id,
        type: type,
        alias: alias
    }) as {id: string})?.id;
}

export async function entityDeleteAsync(id: string) {
    await requestAsync('/entity', 'delete', {id: id});
}
