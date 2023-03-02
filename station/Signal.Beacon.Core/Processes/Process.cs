namespace Signal.Beacon.Core.Processes;

public record Process(
    string Id, 
    string Alias,
    string? ConfigurationJson,
    bool IsDisabled = false) : IProcess;