using Signal.Beacon.Core.Architecture;
using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Application.Signal.Client.Entity;

internal record EntityUpsertCommand(string? Id, EntityType Type, string Alias) : ICommand;