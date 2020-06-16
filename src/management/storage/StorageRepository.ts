import HttpService from "../../services/HttpService";

export default class StorageRepository {
  static async getTablesAsync(): Promise<Array<string>> {
    const data = await HttpService.getAsync("storage-table-list");
    return data as Array<string>;
  }
}
