namespace Signal.Core.Secrets;

public static class SecretKeys
{
    public const string StorageAccountConnectionString = "SignalcoStorageAccountConnectionString";

    public const string ProcessorAccessCode = "SignalcoProcessorAccessCode";

    public const string AppRemoteBrowserUrl = "SignalcoAppRemoteBrowserUrl";
    
    public const string SignalRConnectionString = "AzureSignalRConnectionString";

    public const string PatSigningToken = "SignalcoPatSigningToken";

    public static class Auth0
    {
        public const string ApiIdentifier = "Auth0_ApiIdentifier";

        public const string Domain = "Auth0_Domain";

        public const string ClientSecretStation = "Auth0_ClientSecret_Station";

        public const string ClientIdStation = "Auth0_ClientId_Station";
    }

    public static class HCaptcha
    {
        public const string SiteKey = "HCaptcha_SiteKey";

        public const string Secret = "HCaptcha_Secret";
    }

    public static class AzureSpeech
    {
        public const string SubscriptionKey = "AzureSpeech--SubscriptionKey";

        public const string Region = "AzureSpeech--Region";
    }

    public static class AzureCommunicationServices
    {
        public const string ConnectionString = "AcsConnectionString";
        public const string Domain = "AcsDomain";
    }

    public static class SmtpNotification
    {
        public const string Username = "SmtpNotificationUsername";

        public const string Password = "SmtpNotificationPassword";

        public const string Server = "SmtpNotificationServerUrl";

        public const string FromDomain = "SmtpNotificationFromDomain";
    }
}