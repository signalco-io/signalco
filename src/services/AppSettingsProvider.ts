import UserSettingsProvider from './UserSettingsProvider';

export const ApiProductionUrl = 'https://api.signalco.io/api/';
export const ApiDevelopmentUrl = 'https://api.signalco.dev/api/'

const ENV = process.env.NEXT_PUBLIC_APP_ENV;

class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  public get apiIsProduction() {
    return this.apiAddress === ApiProductionUrl;
  }

  public isDeveloper: boolean;

  constructor() {
    this.isDeveloper = ENV !== 'production';
    this.apiAddress = UserSettingsProvider.value(
        'dev:apiEndpoint',
        this.isDeveloper
            ? ApiDevelopmentUrl
            : ApiProductionUrl);
  }

  setApiEndpoint(value: string) {
    UserSettingsProvider.set('dev:apiEndpoint', value);
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
