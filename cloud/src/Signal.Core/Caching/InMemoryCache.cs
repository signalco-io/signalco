using System;
using System.Collections.Concurrent;

namespace Signal.Core.Caching;

public class InMemoryCache<T>(TimeSpan expiresIn) : IInMemoryCache<T>
{
    private readonly ConcurrentDictionary<string, (DateTime expiry, T data)> cache = new();

    public bool TryGet(string key, out T? data)
    {
        data = default;

        if (!this.cache.TryGetValue(key, out var item))
            return false;

        // Check expiry
        if (item.expiry <= DateTime.UtcNow)
            return false;

        data = item.data;
        return true;
    }

    public T Set(string key, T data)
    {
        var cacheValue = (DateTime.UtcNow.Add(expiresIn), data);
        return this.cache.AddOrUpdate(key, cacheValue, (_, _) => cacheValue).data;
    }
}
