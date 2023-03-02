namespace Signal.Beacon.Core.Processes;

public interface IProcess
{
    string Id { get; init; }
    string Alias { get; init; }
    string? ConfigurationJson { get; init; }
    bool IsDisabled { get; init; }
}