import UserSettingsProvider from "./UserSettingsProvider";

export const ApiProductionUrl = "https://api.signalco.io/api/";
export const ApiDevelopmentUrl = "https://api.signalco.dev/api/"

class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  constructor() {
    this.apiAddress = UserSettingsProvider.value(
        'dev:apiEndpoint',
        process.env.VERCEL_ENV === 'production'
            ? ApiProductionUrl
            : ApiDevelopmentUrl);
  }

  setApiEndpoint(value: string) {
    UserSettingsProvider.set('dev:apiEndpoint', value);
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
