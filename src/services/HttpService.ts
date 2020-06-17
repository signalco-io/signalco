import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar } from "../helpers/StringHelpers";

export default class HttpService {
  public static token: string | null = null;
  private static getBearerToken = () => `Bearer ${HttpService.token}`;

  public static async getAsync(url: string): Promise<any> {
    console.log("Sending request to", url);
    const response = await axios.get(HttpService.getApiUrl(url), {
      headers: {
        Authorization: HttpService.getBearerToken(),
      },
    });
    return response.data;
  }

  public static getApiUrl(url: string): string {
    return AppSettingsProvider.apiAddress + trimStartChar(url, "/");
  }
}
