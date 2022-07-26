import ContactRepository from 'src/contacts/ContactRepository';
import EntityRepository from 'src/entity/EntityRepository';
import IEntityDetails from 'src/entity/IEntityDetails';

export default class ProcessesRepository {
    static async saveProcessConfigurationAsync(id: string, configurationSerialized: string) {
        await ContactRepository.setAsync({entityId: id, channelName: 'config', contactName: 'configuration'}, configurationSerialized);
    }

    static async getProcessAsync(id: string): Promise<IEntityDetails | undefined> {
        return await EntityRepository.byIdAsync(id);
    }

    static async getProcessesAsync(): Promise<IEntityDetails[]> {
        return await EntityRepository.byTypeAsync(3);
    }
}
