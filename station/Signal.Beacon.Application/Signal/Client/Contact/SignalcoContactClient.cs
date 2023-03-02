using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Application.Signal.Client.Contact;

internal class SignalcoContactClient : ISignalcoContactClient
{
    private const string ApiContactUpsertUrl = "/contact/set";

    private readonly ISignalClient client;
    private readonly Lazy<IEntitiesDao> entitiesDao;

    public SignalcoContactClient(
        ISignalClient client,
        Lazy<IEntitiesDao> entitiesDao)
    {
        this.client = client ?? throw new ArgumentNullException(nameof(client));
        this.entitiesDao = entitiesDao ?? throw new ArgumentNullException(nameof(entitiesDao));
    }

    public async Task UpsertAsync(ContactUpsertCommand command, CancellationToken cancellationToken = default)
    {
        try
        {
            var valueSerialized = command.ValueSerialized;
            await this.client.PostAsJsonAsync(
                ApiContactUpsertUrl,
                new SignalcoContactUpsertDto(command.EntityId, command.ChannelName, command.Name, valueSerialized,
                    command.TimeStamp),
                cancellationToken);
        }
        finally
        {
            if (command.InvalidateCache)
                this.entitiesDao.Value.InvalidateEntity(command.EntityId);
        }
    }
}