using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Signal.Core.Extensions;

public static class IEnumerableExtensions
{
    public static async Task<IEnumerable<TResult>> SelectManyAsync<TSource, TResult>(
        this IEnumerable<TSource> collection,
        Func<TSource, Task<IEnumerable<TResult>>> action) =>
        (await Task.WhenAll(collection.Select(action))).SelectMany(i => i);
}