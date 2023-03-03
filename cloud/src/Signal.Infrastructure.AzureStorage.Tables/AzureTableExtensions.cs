using System.Linq;
using Azure.Data.Tables;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal static class AzureTableExtensions
{
    public static TableEntity EscapeKeys(this TableEntity entity)
    {
        entity.PartitionKey = EscapeKey(entity.PartitionKey);
        entity.RowKey = EscapeKey(entity.RowKey);
        return entity;
    }
        
    public static TableEntity UnEscapeKeys(this TableEntity entity)
    {
        entity.PartitionKey = UnEscapeKey(entity.PartitionKey);
        entity.RowKey = UnEscapeKey(entity.RowKey);
        return entity;
    }
        
    public static string EscapeTableName(string name) => 
        string.Concat(name.Where(char.IsLetterOrDigit));

    public static string EscapeKey(string key) =>
        key
            .Replace("/", "__bs__")
            .Replace("\\", "__fs__")
            .Replace("#", "__hash__")
            .Replace("?", "__q__")
            .Replace("\t", "__tab__")
            .Replace("\n", "__nl__")
            .Replace("\r", "__cr__");

    public static string UnEscapeKey(string key) =>
        key
            .Replace("__bs__", "/")
            .Replace("__fs__", "\\")
            .Replace("__hash__", "#")
            .Replace("__q__", "?")
            .Replace("__tab__", "\t")
            .Replace("__nl__", "\n")
            .Replace("__cr__", "\r");
}