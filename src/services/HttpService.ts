import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar, isAbsoluteUrl } from "../helpers/StringHelpers";

export default class HttpService {
  public static tokenFactory?: () => Promise<string>;

  private static async _getBearerTokenAsync() {
    let token: string|undefined = undefined;
    if (typeof HttpService.tokenFactory !== 'undefined')
      token = await HttpService.tokenFactory();

    return `Bearer ${token}`;
  };

  public static async getAsync<T>(url: string): Promise<T> {
    return this.requestAsync(url, "get", null);
  }

  public static async requestAsync(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    const token = await HttpService._getBearerTokenAsync()
    const response = await axios.request({
      url: isAbsoluteUrl(url) ? url : HttpService.getApiUrl(url),
      method: method,
      data: data,
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  public static getApiUrl(url: string): string {
    return AppSettingsProvider.apiAddress + trimStartChar(url, "/");
  }
}
