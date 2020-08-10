import HttpService from "../services/HttpService";

export default class ApiExplorerRepository {
  static async getGroups(): Promise<string[]> {
    var response = await HttpService.getAsync("swagger/v1/swagger.json");
    return Object.keys(response.paths);
  }
}
