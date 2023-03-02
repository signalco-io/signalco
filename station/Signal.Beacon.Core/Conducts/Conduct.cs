using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Core.Conducts;

public class Conduct : IConduct
{
    public IContactPointer Pointer { get; }

    public string? ValueSerialized { get; }

    public double Delay { get; }

    public Conduct(IContactPointer target, string? valueSerialized, double delay = 0)
    {
        this.Pointer = target;
        this.ValueSerialized = valueSerialized;
        this.Delay = delay;
    }
}