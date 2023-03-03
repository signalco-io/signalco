namespace Signal.Core.Secrets;

public static class SecretKeys
{
    public const string StorageAccountConnectionString = "SignalStorageAccountConnectionString";

    public const string ProcessorAccessCode = "SignalcoProcessorAccessCode";

    public static class Auth0
    {
        public const string ApiIdentifier = "Auth0--ApiIdentifier";

        public const string Domain = "Auth0--Domain";

        public const string ClientSecretStation = "Auth0--ClientSecret--Station";

        public const string ClientIdStation = "Auth0--ClientId--Station";
    }

    public static class HCaptcha
    {
        public const string SiteKey = "HCaptcha--SiteKey";

        public const string Secret = "HCaptcha--Secret";
    }

    public static class AzureSpeech
    {
        public const string SubscriptionKey = "AzureSpeech--SubscriptionKey";

        public const string Region = "AzureSpeech--Region";
    }

    public static class SmtpNotification
    {
        public const string Username = "SmtpNotificationUsername";

        public const string Password = "SmtpNotificationPassword";

        public const string Server = "SmtpNotificationServerUrl";

        public const string FromDomain = "SmtpNotificationFromDomain";
    }
}