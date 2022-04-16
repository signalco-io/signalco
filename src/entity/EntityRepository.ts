import HttpService from '../services/HttpService';

export default class EntityRepository {
    static async deleteAsync(id: string, type: number) {
        await HttpService.requestAsync('/entity/delete', 'delete', {id: id, entityType: type});
    }
}