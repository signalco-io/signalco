import IEntityDetails from 'src/entity/IEntityDetails';
import { entitiesAsync, entityAsync } from 'src/entity/EntityRepository';
import { setAsync } from 'src/contacts/ContactRepository';

export default class ProcessesRepository {
    static async saveProcessConfigurationAsync(id: string, configurationSerialized: string) {
        await setAsync({entityId: id, channelName: 'config', contactName: 'configuration'}, configurationSerialized);
    }

    static async getProcessAsync(id: string): Promise<IEntityDetails | undefined> {
        return await entityAsync(id);
    }

    static async getProcessesAsync(): Promise<IEntityDetails[]> {
        return await entitiesAsync(3);
    }
}
