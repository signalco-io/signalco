import IContact from 'src/contacts/IContact';
import IContactPointer from 'src/contacts/IContactPointer';
import HttpService from '../services/HttpService';
import IEntityDetails from './IEntityDetails';

class EntityRepository {
    async deleteAsync(id: string) {
        await HttpService.requestAsync('/entity', 'delete', {id: id});
    }

    async allAsync() {
        const entities = await HttpService.requestAsync('/entity', 'get');
        return entities.map((e: any) => ({...e, timeStamp: e.timeStamp ? new Date(e.timeStamp) : undefined})) as IEntityDetails[];
    }

    async renameAsync(id: string, newAlias: string) {
        const entity = await this.byIdAsync(id);
        if (entity == null)
            throw new Error(`Unknown entity \"${id}\"`);

        await this.upsertAsync(id, entity.type, newAlias);
    }

    async byIdAsync(id: string) {
        return (await this.allAsync()).find(e => e.id === id);
    }

    async byTypeAsync(type: number) {
        return (await this.allAsync()).filter(e => e.type === type);
    }

    async contactAsync(pointer: IContactPointer) : Promise<IContact | undefined> {
        const entity = await this.byIdAsync(pointer.entityId);
        return entity?.contacts.find(c => c.channelName === pointer.channelName && c.contactName === c.contactName);
    }

    async upsertAsync(id: string | undefined, type: number, alias: string) {
        // TODO: Optimize by using cache when applicable
        return (await HttpService.requestAsync('/entity', 'post', {
            id: id,
            type: type,
            alias: alias
        }) as {id: string})?.id;
    }
}

const instance = new EntityRepository();

export default instance;
