using System;
using Microsoft.Extensions.DependencyInjection;

namespace Signal.Beacon.Core.Helpers;

public class Lazier<T> : Lazy<T> where T : class
{
    public Lazier(IServiceProvider provider)
        : base(provider.GetRequiredService<T>)
    {
    }
}
