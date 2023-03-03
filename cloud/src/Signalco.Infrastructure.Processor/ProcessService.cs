using System.Text.Json;
using Signal.Core.Entities;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using ContactPointer = Signal.Core.Contacts.ContactPointer;

namespace Signalco.Infrastructure.Processor;

internal class ProcessService : IProcessService
{
    private readonly IEntityService entityService;

    public ProcessService(
        IEntityService entityService)
    {
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
    }

    public async Task<ProcessConfiguration?> GetConfigurationAsync(string processEntityId, CancellationToken cancellationToken = default)
    {
        var configContact = await this.entityService.ContactAsync(
            new ContactPointer(processEntityId, "signalco", "configuration"),
            cancellationToken);
        if (configContact == null ||
            string.IsNullOrWhiteSpace(configContact.ValueSerialized))
            return null;

        return JsonSerializer.Deserialize<ProcessConfiguration>(configContact.ValueSerialized);
    }
}