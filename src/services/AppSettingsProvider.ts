const ApiProductionUrl: string = "https://api.signal.dfnoise.com/api/";

class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  constructor() {
    this.apiAddress = ApiProductionUrl;
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
