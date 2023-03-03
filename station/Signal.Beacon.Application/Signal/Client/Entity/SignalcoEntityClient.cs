using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal.Client.Entity;

internal class SignalcoEntityClient : ISignalcoEntityClient
{
    private const string ApiEntityUrl = "/entity";
    private const string ApiEntitySingleUrl = "/entity/{0}";

    private readonly ISignalClient client;
    private readonly Lazy<IEntitiesDao> entitiesDaoLazy;

    public SignalcoEntityClient(
        ISignalClient client,
        Lazy<IEntitiesDao> entitiesDaoLazy)
    {
        this.client = client ?? throw new ArgumentNullException(nameof(client));
        this.entitiesDaoLazy = entitiesDaoLazy ?? throw new ArgumentNullException(nameof(entitiesDaoLazy));
    }

    public async Task<IEnumerable<IEntityDetails>> AllAsync(CancellationToken cancellationToken)
    {
        var response = await this.client.GetAsync<IEnumerable<SignalcoEntityDetailsDto>>(
            ApiEntityUrl,
            cancellationToken);
        if (response == null)
            throw new Exception("Failed to retrieve entities from API.");

        return response.Select(EntityDetails);
    }

    public async Task<IEntityDetails> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        var response = await this.client.GetAsync<SignalcoEntityDetailsDto>(
            string.Format(ApiEntitySingleUrl, id),
            cancellationToken);
        if (response == null)
            throw new Exception($"Failed to retrieve entity {id} from API.");

        return EntityDetails(response);
    }

    private static EntityDetails EntityDetails(SignalcoEntityDetailsDto dto) =>
        new(dto.Type ?? throw new InvalidOperationException(),
            dto.Id ?? throw new InvalidOperationException(),
            dto.Alias ?? throw new InvalidOperationException(),
            dto.Contacts?
                .Where(c => !string.IsNullOrWhiteSpace(c.ChannelChannel) && !string.IsNullOrWhiteSpace(c.ContactName))
                .Select(ds => new Core.Entity.Contact(
                    ds.EntityId ?? throw new InvalidOperationException(),
                    ds.ChannelChannel ?? throw new InvalidOperationException(),
                    ds.ContactName ?? throw new InvalidOperationException(),
                    ds.ValueSerialized,
                    ds.TimeStamp)) ??
            Enumerable.Empty<IContact>());

    public async Task DeleteAsync(string entityId, CancellationToken cancellationToken)
    {
        await this.client.DeleteAsync(
            ApiEntityUrl,
            new SignalcoEntityDeleteRequestDto(entityId),
            cancellationToken);
    }

    public async Task<string> UpsertAsync(EntityUpsertCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var response = await this.client.PostAsJsonAsync<SignalcoEntityUpsertDto, SignalcoEntityUpsertResponseDto>(
                ApiEntityUrl,
                new SignalcoEntityUpsertDto(command.Id, command.Type, command.Alias),
                cancellationToken);

            if (response == null || string.IsNullOrWhiteSpace(response.Id))
                throw new Exception("Didn't get valid response for entity upsert.");

            return response.Id;
        }
        finally
        {
            if (command.Id != null)
                this.entitiesDaoLazy.Value.InvalidateEntity(command.Id);
        }
    }
}