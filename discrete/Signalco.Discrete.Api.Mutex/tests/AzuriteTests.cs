using System.Net;
using Azure;
using Azure.Data.Tables;
using Moq;
using Xunit;

namespace Signalco.Discrete.Api.Mutex.Tests;

public class AzuriteTests
{
    [AzuriteFact]
    public async Task CompetingExpiredLeaseTakeoversHaveExactlyOneWinner()
    {
        await WithTable(async (table, _) =>
        {
            var now = DateTimeOffset.UtcNow;
            await table.AddEntityAsync(new TableEntity("keys", "race")
            {
                ["expire"] = now.AddMinutes(-1),
                ["oldProperty"] = true,
            });

            const int contenders = 8;
            var reads = 0;
            var allRead = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
            var client = new Mock<TableClient>(MockBehavior.Strict);
            client.Setup(x => x.GetEntityIfExistsAsync<TableEntity>("keys", "race",
                    It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
                .Returns(async (string partition, string key, IEnumerable<string>? select, CancellationToken token) =>
                {
                    var snapshot = await table.GetEntityIfExistsAsync<TableEntity>(partition, key, select, token);
                    if (Interlocked.Increment(ref reads) == contenders) allRead.TrySetResult();
                    await allRead.Task.WaitAsync(TimeSpan.FromSeconds(10), token);
                    return snapshot;
                });
            client.Setup(x => x.UpdateEntityAsync(It.IsAny<TableEntity>(), It.IsAny<ETag>(),
                    TableUpdateMode.Replace, It.IsAny<CancellationToken>()))
                .Returns((TableEntity lease, ETag etag, TableUpdateMode mode, CancellationToken token) =>
                    table.UpdateEntityAsync(lease, etag, mode, token));

            var functions = MutexFunctionsTests.Functions(client.Object, new MutexFunctionsTests.Clock(now));
            var results = await Task.WhenAll(Enumerable.Range(0, contenders).Select(async index =>
            {
                var expiration = now.AddMinutes(30 + index).ToString("O");
                var response = await functions.RunWait(MutexFunctionsTests.Request($"{{\"expire\":\"{expiration}\"}}"),
                    "race", CancellationToken.None);
                return (Index: index, response.StatusCode);
            }));

            var winner = Assert.Single(results, result => result.StatusCode == HttpStatusCode.Accepted);
            Assert.Equal(contenders - 1, results.Count(result => result.StatusCode == HttpStatusCode.Conflict));
            var stored = (await table.GetEntityAsync<TableEntity>("keys", "race")).Value;
            Assert.Equal(now.AddMinutes(30 + winner.Index), stored.GetDateTimeOffset("expire"));
            Assert.False(stored.ContainsKey("oldProperty"));
        });
    }

    [AzuriteFact]
    public async Task DefaultAcquisitionActiveConflictAndReleaseWorkWithAzureTables()
    {
        await WithTable(async (table, _) =>
        {
            var now = DateTimeOffset.UtcNow;
            var functions = MutexFunctionsTests.Functions(table, new MutexFunctionsTests.Clock(now));
            Assert.Equal(HttpStatusCode.Accepted,
                (await functions.RunWait(MutexFunctionsTests.Request(), "default", CancellationToken.None)).StatusCode);
            var stored = (await table.GetEntityAsync<TableEntity>("keys", "default")).Value;
            Assert.Equal(now.AddMinutes(30), stored.GetDateTimeOffset("expire"));
            Assert.Equal(HttpStatusCode.Conflict,
                (await functions.RunWait(MutexFunctionsTests.Request(), "default", CancellationToken.None)).StatusCode);
            Assert.Equal(HttpStatusCode.Accepted,
                (await functions.RunRelease(MutexFunctionsTests.Request(), "default", CancellationToken.None)).StatusCode);
            Assert.False((await table.GetEntityIfExistsAsync<TableEntity>("keys", "default")).HasValue);
        });
    }

    [AzuriteFact]
    public async Task LegacyTimestampCanBeReclaimedAfterThirtyMinutes()
    {
        await WithTable(async (table, _) =>
        {
            await table.AddEntityAsync(new TableEntity("keys", "legacy"));
            var legacy = (await table.GetEntityAsync<TableEntity>("keys", "legacy")).Value;
            var now = legacy.Timestamp!.Value.AddMinutes(30);
            var functions = MutexFunctionsTests.Functions(table, new MutexFunctionsTests.Clock(now));
            Assert.Equal(HttpStatusCode.Accepted,
                (await functions.RunWait(MutexFunctionsTests.Request(), "legacy", CancellationToken.None)).StatusCode);
            Assert.Equal(now.AddMinutes(30),
                (await table.GetEntityAsync<TableEntity>("keys", "legacy")).Value.GetDateTimeOffset("expire"));
        });
    }

    private static async Task WithTable(Func<TableClient, TableServiceClient, Task> action)
    {
        // This fixture intentionally cannot target a remote storage account.
        var service = new TableServiceClient(new Uri("http://127.0.0.1:10032/mutexlocal"),
            new TableSharedKeyCredential("mutexlocal", "bG9jYWwtdGVzdC1rZXk="));
        var table = service.GetTableClient($"mutex{Guid.NewGuid():N}");
        await table.CreateAsync();
        try
        {
            await action(table, service);
        }
        finally
        {
            await table.DeleteAsync();
        }
    }
}

public sealed class AzuriteFactAttribute : FactAttribute
{
    public AzuriteFactAttribute()
    {
        if (Environment.GetEnvironmentVariable("MUTEX_AZURITE") != "1")
            this.Skip = "Start local Azurite and set MUTEX_AZURITE=1 to run storage integration tests.";
    }
}
