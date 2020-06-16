import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar } from "../helpers/StringHelpers";

export default class HttpService {
  public static async getAsync(url: string): Promise<any> {
    const response = await axios.get(HttpService.getApiUrl(url));
    return response.data;
  }

  private static getApiUrl(url: string): string {
    return AppSettingsProvider.apiAddress + trimStartChar(url, "/");
  }
}
