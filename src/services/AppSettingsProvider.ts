const ApiProductionUrl: string = "https://signal-api.azurewebsites.net/api/";

class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  constructor() {
    this.apiAddress = ApiProductionUrl;
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
