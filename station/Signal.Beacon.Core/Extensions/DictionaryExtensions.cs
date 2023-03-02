using System.Collections.Generic;
using System.Linq;

namespace Signal.Beacon.Core.Extensions;

public static class DictionaryExtensions
{
    public static IEnumerable<TValue> TryGetValuesMany<TKey, TValue>(
        this IDictionary<TKey, ICollection<TValue>> @this,
        IEnumerable<TKey> keys) =>
        @this.TryGetValues(keys).SelectMany(i => i);

    public static IEnumerable<TValue> TryGetValues<TKey, TValue>(
        this IDictionary<TKey, TValue> @this,
        IEnumerable<TKey> keys)
    {
        foreach (var key in keys)
            if (@this.TryGetValue(key, out var value))
                yield return value;
    }

    public static IEnumerable<TValue> GetValues<TKey, TValue>(
        this IDictionary<TKey, ICollection<TValue>> @this,
        TKey key) =>
        @this.TryGetValue(key, out var value) ? value : Enumerable.Empty<TValue>();

    public static void Append<TKey, TValue>(
        this IDictionary<TKey, ICollection<TValue>> @this, 
        TKey key,
        TValue value)
    {
        if (!@this.ContainsKey(key))
            @this.Add(key, new List<TValue> {value});
        else @this[key].Add(value);
    }

    public static void AddOrSet<TKey, TValue>(this IDictionary<TKey, TValue> @this, TKey key, TValue value)
    {
        if (!@this.ContainsKey(key))
            @this.Add(key, value);
        else @this[key] = value;
    }
}