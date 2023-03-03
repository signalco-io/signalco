using Signalco.Infrastructure.Processor.Configuration.Schemas;

namespace Signalco.Infrastructure.Processor;

internal interface IProcessService
{
    Task<ProcessConfiguration?> GetConfigurationAsync(string processEntityId, CancellationToken cancellationToken = default);
}