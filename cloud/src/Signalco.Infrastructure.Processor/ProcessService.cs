using System.Text.Json;
using Signal.Core.Entities;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using ContactPointer = Signal.Core.Contacts.ContactPointer;

namespace Signalco.Infrastructure.Processor;

internal class ProcessService(IEntityService entityService) : IProcessService
{
    public async Task<ProcessConfiguration?> GetConfigurationAsync(string processEntityId, CancellationToken cancellationToken = default)
    {
        var configContact = await entityService.ContactAsync(
            new ContactPointer(processEntityId, "signalco", "configuration"),
            cancellationToken);
        if (configContact == null ||
            string.IsNullOrWhiteSpace(configContact.ValueSerialized))
            return null;

        return JsonSerializer.Deserialize<ProcessConfiguration>(configContact.ValueSerialized);
    }
}