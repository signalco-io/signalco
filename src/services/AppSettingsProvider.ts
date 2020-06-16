class AppSettingsProvider {
  public authToken: string | null = null;

  public apiAddress: string;

  constructor() {
    this.apiAddress = "https://api.signal.dfnoise.com/api/";
  }
}

const appSettingsProvider = new AppSettingsProvider();

export default appSettingsProvider;
