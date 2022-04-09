const ApiProductionUrl = "https://api.signalco.io/api/";
const ApiDevelopmentUrl = "https://api.signlco.dev/api/"

class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  constructor() {
    this.apiAddress = process.env.VERCEL_ENV === 'production'
    ? ApiProductionUrl
    : ApiDevelopmentUrl;
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
