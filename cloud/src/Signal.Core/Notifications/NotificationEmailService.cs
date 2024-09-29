using Azure.Communication.Email;
using Signal.Core.Secrets;
using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Notifications;

internal class NotificationEmailService(ISecretsProvider secretsProvider) : INotificationSmtpService
{
    public async Task SendAsync(
        string recipientEmail,
        string title,
        string content,
        string? sender = "system",
        CancellationToken cancellationToken = default)
    {
        var acsConnectionString = await secretsProvider.GetSecretAsync(SecretKeys.AzureCommunicationServices.ConnectionString, cancellationToken);
        var acsDomain = await secretsProvider.GetSecretAsync(SecretKeys.AzureCommunicationServices.Domain, cancellationToken);


        var emailClient = new EmailClient(acsConnectionString);
        var emailSendOperation = await emailClient.SendAsync(
            Azure.WaitUntil.Started,
            $"{sender ?? "system"}@{acsDomain}",
            recipientEmail,
            title,
            content,
            cancellationToken: cancellationToken);

        while (true)
        {
            await emailSendOperation.UpdateStatusAsync(cancellationToken);
            if (emailSendOperation.HasCompleted)
            {
                break;
            }
            await Task.Delay(100, cancellationToken);
        }
    }
}