using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Secrets;

namespace Signalco.Channel.Slack.Functions.Conducts;

internal class SlackAccessTokenProvider(
        IEntityService entityService,
        ISecretsProvider secretsProvider)
    : ISlackAccessTokenProvider
{
    public async Task<string> GetAccessTokenAsync(string entityId, CancellationToken cancellationToken = default)
    {
        // TODO: SECURITY: User can retrieve any access token by changing value in contact - limit to this user keys

        var accessTokenContact = await entityService.ContactAsync(new ContactPointer(
                entityId,
                KnownChannels.Slack,
                KnownContacts.AccessToken),
            cancellationToken);
        if (accessTokenContact == null || string.IsNullOrWhiteSpace(accessTokenContact.ValueSerialized))
            throw new Exception($"Entity {entityId} missing access token contact or access token value.");

        var accessToken = await secretsProvider.GetSecretAsync(accessTokenContact.ValueSerialized, cancellationToken);
        if (string.IsNullOrWhiteSpace(accessToken))
            throw new Exception($"Entity {entityId} assigned access token is invalid.");

        return accessToken;
    }
}