using Signal.Core.Secrets;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Notifications;

internal class NotificationSmtpService(ISecretsProvider secretsProvider) : INotificationSmtpService
{
    public async Task SendAsync(
        string recipientEmail,
        string title,
        string content,
        CancellationToken cancellationToken = default)
    {
        var fromDomain = await secretsProvider.GetSecretAsync(SecretKeys.SmtpNotification.FromDomain, cancellationToken);
        var username = await secretsProvider.GetSecretAsync(SecretKeys.SmtpNotification.Username, cancellationToken);
        var password = await secretsProvider.GetSecretAsync(SecretKeys.SmtpNotification.Password, cancellationToken);
        var host = await secretsProvider.GetSecretAsync(SecretKeys.SmtpNotification.Server, cancellationToken);
        const int port = 25;

        using var client = new System.Net.Mail.SmtpClient(host, port);
        client.Credentials = new System.Net.NetworkCredential(username, password);
        client.EnableSsl = true;
        await client.SendMailAsync(
            $"info@{fromDomain}",
            recipientEmail,
            title,
            content,
            cancellationToken);
    }
}