import HttpService from "../../services/HttpService";

export default class StorageRepository {
  static async getTablesAsync(): Promise<Array<string>> {
    const data = await HttpService.getAsync("system/storage/tables/list");
    return data as Array<string>;
  }

  static async getQueuesAsync(): Promise<Array<string>> {
    const data = await HttpService.getAsync("system/storage/queues/list");
    return data as Array<string>;
  }
}
