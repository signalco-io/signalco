import axios from "axios";
import AppSettingsProvider from "./AppSettingsProvider";
import { trimStartChar, isAbsoluteUrl } from "../helpers/StringHelpers";

export default class HttpService {
  public static tokenFactory?: () => Promise<string>;
  public static get isOnline(): boolean {
    if (typeof window !== 'undefined' && 'onLine' in navigator)
      return navigator.onLine;
    return true;
  } 

  private static async _getBearerTokenAsync() {
    let token: string | undefined;

    // Try to use cached token (for offline access)
    const cachedToken = localStorage.getItem('signalauth0keycache');
    if (!HttpService.isOnline &&
      typeof cachedToken !== 'undefined' &&
      cachedToken != null) {
      token = cachedToken;
      console.debug('Using cached token because we are offline.');
    }

    // If unable to use cached token, ask factory for one
    if (typeof token === 'undefined' &&
      typeof HttpService.tokenFactory !== 'undefined') {
      token = await HttpService.tokenFactory();
      console.debug("Used token factory")
    }

    // Cache token and return if available
    if (typeof token !== 'undefined') {
      localStorage.setItem('signalauth0keycache', token);
      return `Bearer ${token}`;
    }

    console.warn("Token is undefined")
    throw new Error("Login failed.");
  };

  public static async getAsync<T>(url: string, data?: any): Promise<T> {
    return await this.requestAsync(url, "get", data) as T;
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
      data: method !== "get" ? data : undefined,
      params: method === "get" ? data : undefined,
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
    });
    return response.data;
  }

  public static getApiUrl(url: string): string {
    return AppSettingsProvider.apiAddress + trimStartChar(url, "/");
  }
}
