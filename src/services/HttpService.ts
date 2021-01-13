import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar, isAbsoluteUrl } from "../helpers/StringHelpers";

export default class HttpService {
  public static token: string | null = null;
  private static getBearerToken = () => {
    if (HttpService.token == null) throw new Error("Not logged in.");
    return `Bearer ${HttpService.token}`;
  };

  public static async getAsync<T>(url: string): Promise<T> {
    return this.requestAsync(url, "get", null);
  }

  public static async requestAsync(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: any
  ) {
    const response = await axios.request({
      url: isAbsoluteUrl(url) ? url : HttpService.getApiUrl(url),
      method: method,
      data: data,
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
