using Signal.Beacon.Core.Entity;

namespace Signal.Beacon.Core.Conducts;

public interface IConduct
{
    IContactPointer Pointer { get; }
    
    string? ValueSerialized { get; }
    
    double Delay { get; }
}