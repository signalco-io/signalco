import Router from 'next/router';
import axios, { AxiosError } from 'axios';
import CurrentUserProvider from './CurrentUserProvider';
import AppSettingsProvider from './AppSettingsProvider';
import { ObjectDictAny } from '../sharedTypes';
import PageNotificationService from '../notifications/PageNotificationService';
import { parseHash, parseHashParam } from '../hooks/useHashParam';
import { isAbsoluteUrl, trimStartChar } from '../helpers/StringHelpers';

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
    const cachedToken = CurrentUserProvider.getToken();
    if (cachedToken != null) {
      token = cachedToken;
      console.debug('Using cached token.');
    }

    // If unable to use cached token, ask factory for one
    if (token == null &&
      typeof HttpService.tokenFactory !== 'undefined') {
      token = await HttpService.tokenFactory();
      CurrentUserProvider.setToken(token);
      console.debug('Used token factory')
    }

    // Cache token and return if available
    if (typeof token !== 'undefined') {
      return `Bearer ${token}`;
    }

    console.warn('Token is undefined');
    throw new Error('Login failed.');
  };

  public static async getAsync<T>(url: string, data?: any): Promise<T> {
    return await this.requestAsync(url, 'get', data) as T;
  }

  public static async requestAsync(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    headers?: ObjectDictAny,
    skipAuth?: boolean
  ) {
    const token = skipAuth ? false : await HttpService._getBearerTokenAsync()
    try {
    const response = await axios.request({
      url: isAbsoluteUrl(url) ? url : HttpService.getApiUrl(url),
      method: method,
      data: method !== 'get' ? data : undefined,
      params: method === 'get' ? data : undefined,
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json',
        ...headers
      },
    });
    return response.data;
    } catch(err) {
      if (typeof err !== 'undefined' &&
        typeof err === 'object' &&
        err !== null &&
        Object.values(err).find(errv => errv === 'AxiosError')) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 403) {
          console.warn('Token expired.', err);
          CurrentUserProvider.setToken(undefined);

          // Check if we are already reloading to authenticate
          const isAuthReload = parseHashParam('authReload');
          if (isAuthReload === 'true') {
              // Show notification to manually reload the app
              PageNotificationService.prompt(
                  'Authorization failed. Please reload the app to continue...',
                  'error',
                  'Reload',
                  () => {
                      window.location.replace('/app');
                  });
              return;
          }

          // Reload with auth reload flag
          const hash = parseHash();
          hash.set('authReload', 'true');
          Router.push({ hash: hash.toString() }, undefined, {shallow: false});
        }
        console.warn(`API (${axiosError.response?.status}) - ${axiosError.message}`)
      } else {
        console.error('API error', err);
      }

      throw err;
    }
  }

  public static getApiUrl(url: string): string {
    return AppSettingsProvider.apiAddress + trimStartChar(url, '/');
  }
}
