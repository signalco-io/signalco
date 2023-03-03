namespace Signal.Core.Caching;

public interface IInMemoryCache<T>
{
    bool TryGet(string key, out T? data);
    T Set(string key, T data);
}