import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar, isAbsoluteUrl } from "../helpers/StringHelpers";

export default class HttpService {
  public static token?: string;

  private static _getTokenOrWait() {
    return new Promise<void>(resolve => {
      if (!HttpService.token == null) {
        setTimeout(resolve, 1);
      }
      resolve();
    });
  }

  private static async _getBearerTokenAsync() {
    return await new Promise<string>(async (resolve, reject) => {
      let retryCounter = 0;
      while (HttpService.token == null) {
        await HttpService._getTokenOrWait();
        retryCounter++;
        if (retryCounter > 10000) {
          reject("Not logged in. Please refresh this page.");
          return;
        }
      }

      resolve(`Bearer ${HttpService.token}`);
    });
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
