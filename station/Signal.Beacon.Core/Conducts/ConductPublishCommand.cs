using System;
using System.Collections.Generic;
using Signal.Beacon.Core.Architecture;

namespace Signal.Beacon.Core.Conducts;

public class ConductPublishCommand : ICommand
{
    public IEnumerable<IConduct> Conducts { get; }

    public ConductPublishCommand(IEnumerable<IConduct> conducts)
    {
        this.Conducts = conducts ?? throw new ArgumentNullException(nameof(conducts));
    }
}