using System.Net;
using System.Text;
using Azure;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Signalco.Discrete.Api.Mutex.Tests;

public class MutexFunctionsTests
{
    private const string Key = "test-key";
    private static readonly DateTimeOffset Now = DateTimeOffset.Parse("2026-10-24T12:00:00Z");

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("{}")]
    [InlineData("{\"other\":true}")]
    public async Task OmittedExpirationCreatesThirtyMinuteLease(string body)
    {
        var fixture = new Fixture();
        var response = await fixture.Wait(body);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        Assert.Equal(Now.AddMinutes(30), fixture.Written!.GetDateTimeOffset("expire"));
        Assert.Equal("keys", fixture.Written.PartitionKey);
        Assert.Equal(Key, fixture.Written.RowKey);
        fixture.Client.Verify(x => x.AddEntityAsync(It.IsAny<TableEntity>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("2026-10-24T13:00:00Z")]
    [InlineData("2026-10-24T15:00:00+02:00")]
    [InlineData("2026-10-24T08:00:00-05:00")]
    public async Task CustomExpirationIsStoredInUtc(string expiration)
    {
        var fixture = new Fixture();
        var response = await fixture.Wait($"{{\"expire\":\"{expiration}\"}}");

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var stored = fixture.Written!.GetDateTimeOffset("expire")!.Value;
        Assert.Equal(Now.AddHours(1), stored);
        Assert.Equal(TimeSpan.Zero, stored.Offset);
    }

    [Theory]
    [InlineData("{")]
    [InlineData("null")]
    [InlineData("[]")]
    [InlineData("42")]
    [InlineData("\"date\"")]
    [InlineData("{\"expire\":null}")]
    [InlineData("{\"expire\":true}")]
    [InlineData("{\"expire\":42}")]
    [InlineData("{\"expire\":[]}")]
    [InlineData("{\"expire\":\"invalid\"}")]
    [InlineData("{\"expire\":\"2026-10-24T13:00:00\"}")]
    [InlineData("{\"expire\":\"2026-10-24\"}")]
    [InlineData("{\"expire\":\"2026-10-24T12:00:00Z\"}")]
    [InlineData("{\"expire\":\"2026-10-24T11:59:59Z\"}")]
    [InlineData("{\"expire\":\"2026-10-24T13:00:00+02:00\"}")]
    public async Task InvalidRequestsFailBeforeStorageAccess(string body)
    {
        var fixture = new Fixture();
        Assert.Equal(HttpStatusCode.BadRequest, (await fixture.Wait(body)).StatusCode);
        fixture.Client.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ActiveLeaseIsNotChanged()
    {
        var fixture = new Fixture(Lease(Now.AddSeconds(1)));
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
        Assert.Null(fixture.Written);
        fixture.Client.Verify(x => x.GetEntityIfExistsAsync<TableEntity>("keys", Key,
            It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()), Times.Once);
        fixture.Client.VerifyNoOtherCalls();
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(0)]
    public async Task ExpiredLeaseIsConditionallyReplaced(int expiredSeconds)
    {
        var expired = Lease(Now.AddSeconds(expiredSeconds));
        var fixture = new Fixture(expired);
        Assert.Equal(HttpStatusCode.Accepted, (await fixture.Wait()).StatusCode);
        Assert.Equal(Now.AddMinutes(30), fixture.Written!.GetDateTimeOffset("expire"));
        fixture.Client.Verify(x => x.UpdateEntityAsync(It.IsAny<TableEntity>(), expired.ETag,
            TableUpdateMode.Replace, It.IsAny<CancellationToken>()), Times.Once);
        fixture.Client.Verify(x => x.AddEntityAsync(It.IsAny<TableEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Theory]
    [InlineData(-31, HttpStatusCode.Accepted)]
    [InlineData(-30, HttpStatusCode.Accepted)]
    [InlineData(-29, HttpStatusCode.Conflict)]
    public async Task LegacyLeaseUsesTimestampPlusThirtyMinutes(int ageMinutes, HttpStatusCode expected)
    {
        var legacy = Lease(null);
        legacy.Timestamp = Now.AddMinutes(ageMinutes);
        var fixture = new Fixture(legacy);
        Assert.Equal(expected, (await fixture.Wait()).StatusCode);
        Assert.Equal(expected == HttpStatusCode.Accepted, fixture.Written != null);
    }

    [Fact]
    public async Task LegacyLeaseWithoutTimestampStaysLocked()
    {
        var fixture = new Fixture(Lease(null));
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
        Assert.Null(fixture.Written);
    }

    [Fact]
    public async Task InvalidStoredExpirationDoesNotFallBackToOldTimestamp()
    {
        var lease = Lease(null);
        lease["expire"] = "invalid";
        lease.Timestamp = Now.AddDays(-1);
        var fixture = new Fixture(lease);
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
        Assert.Null(fixture.Written);
    }

    [Theory]
    [InlineData("")]
    [InlineData("*")]
    public async Task MissingOrWildcardEtagCannotTakeOver(string etag)
    {
        var lease = Lease(Now.AddMinutes(-1));
        lease.ETag = new ETag(etag);
        var fixture = new Fixture(lease);
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
        Assert.Null(fixture.Written);
    }

    [Theory]
    [InlineData(404)]
    [InlineData(409)]
    [InlineData(412)]
    public async Task LostTakeoverRaceReturnsConflict(int status)
    {
        var fixture = new Fixture(Lease(Now.AddMinutes(-1)));
        fixture.Client.Setup(x => x.UpdateEntityAsync(It.IsAny<TableEntity>(), It.IsAny<ETag>(),
            TableUpdateMode.Replace, It.IsAny<CancellationToken>())).ThrowsAsync(new RequestFailedException(status, "Lost race"));
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
        fixture.Client.Verify(x => x.AddEntityAsync(It.IsAny<TableEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ConcurrentNewLeaseInsertReturnsConflict()
    {
        var fixture = new Fixture();
        fixture.Client.Setup(x => x.AddEntityAsync(It.IsAny<TableEntity>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new RequestFailedException(409, "Already acquired"));
        Assert.Equal(HttpStatusCode.Conflict, (await fixture.Wait()).StatusCode);
    }

    [Theory]
    [InlineData(403)]
    [InlineData(500)]
    [InlineData(503)]
    public async Task StorageReadFailuresAreNotReportedAsContention(int status)
    {
        var fixture = new Fixture();
        fixture.Client.Setup(x => x.GetEntityIfExistsAsync<TableEntity>("keys", Key,
                It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new RequestFailedException(status, "Storage failure"));
        var error = await Assert.ThrowsAsync<RequestFailedException>(() => fixture.Wait());
        Assert.Equal(status, error.Status);
    }

    [Theory]
    [InlineData(403)]
    [InlineData(500)]
    [InlineData(503)]
    public async Task StorageUpdateFailuresAreNotReportedAsContention(int status)
    {
        var fixture = new Fixture(Lease(Now.AddMinutes(-1)));
        fixture.Client.Setup(x => x.UpdateEntityAsync(It.IsAny<TableEntity>(), It.IsAny<ETag>(),
                TableUpdateMode.Replace, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new RequestFailedException(status, "Storage failure"));
        var error = await Assert.ThrowsAsync<RequestFailedException>(() => fixture.Wait());
        Assert.Equal(status, error.Status);
    }

    [Fact]
    public async Task MissingTableIsInitializedAndReturnsConflictForRetry()
    {
        var fixture = new Fixture();
        fixture.Client.Setup(x => x.GetEntityIfExistsAsync<TableEntity>("keys", Key,
                It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new RequestFailedException(404, "Missing table", "TableNotFound", null));
        var service = new Mock<TableServiceClient>(MockBehavior.Strict);
        service.Setup(x => x.CreateTableIfNotExistsAsync("mutex", It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<Response<Azure.Data.Tables.Models.TableItem>>());
        var functions = Functions(fixture.Client.Object, fixture.Clock, service.Object);

        Assert.Equal(HttpStatusCode.Conflict,
            (await functions.RunWait(Request(), Key, CancellationToken.None)).StatusCode);
        service.Verify(x => x.CreateTableIfNotExistsAsync("mutex", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExpirationThatPassesDuringReadCannotAcquire()
    {
        var fixture = new Fixture();
        fixture.Client.Setup(x => x.GetEntityIfExistsAsync<TableEntity>("keys", Key,
                It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .Callback(() => fixture.Clock.Now = Now.AddMinutes(2))
            .ReturnsAsync(ReadResponse(null));
        Assert.Equal(HttpStatusCode.BadRequest,
            (await fixture.Wait("{\"expire\":\"2026-10-24T12:01:00Z\"}")).StatusCode);
        Assert.Null(fixture.Written);
    }

    [Fact]
    public async Task ReleaseStillDeletesAndReturnsAccepted()
    {
        var fixture = new Fixture();
        fixture.Client.Setup(x => x.DeleteEntityAsync("keys", Key, It.IsAny<ETag>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<Response>());
        var response = await fixture.Functions.RunRelease(Request(), Key, CancellationToken.None);
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        fixture.Client.Verify(x => x.DeleteEntityAsync("keys", Key, It.IsAny<ETag>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    private static TableEntity Lease(DateTimeOffset? expiration)
    {
        var lease = new TableEntity("keys", Key) { ETag = new ETag("\"read-version\"") };
        if (expiration.HasValue) lease["expire"] = expiration.Value;
        return lease;
    }

    private static NullableResponse<TableEntity> ReadResponse(TableEntity? lease)
    {
        var response = new Mock<NullableResponse<TableEntity>>();
        response.SetupGet(x => x.HasValue).Returns(lease != null);
        if (lease != null) response.SetupGet(x => x.Value).Returns(lease);
        return response.Object;
    }

    internal static HttpRequestData Request(string body = "")
    {
        var context = Mock.Of<FunctionContext>();
        var request = new Mock<HttpRequestData>(context);
        request.SetupGet(x => x.Body).Returns(new MemoryStream(Encoding.UTF8.GetBytes(body)));
        request.Setup(x => x.CreateResponse()).Returns(() =>
        {
            var response = new Mock<HttpResponseData>(context);
            response.SetupAllProperties();
            return response.Object;
        });
        return request.Object;
    }

    internal static MutexFunctions Functions(TableClient client, TimeProvider clock, TableServiceClient? serviceClient = null)
    {
        var provider = new Mock<IServiceProvider>();
        provider.Setup(x => x.GetService(typeof(TableClient))).Returns(client);
        provider.Setup(x => x.GetService(typeof(TableServiceClient))).Returns(serviceClient);
        provider.Setup(x => x.GetService(typeof(TimeProvider))).Returns(clock);
        return new MutexFunctions(provider.Object);
    }

    internal sealed class Clock(DateTimeOffset now) : TimeProvider
    {
        public DateTimeOffset Now { get; set; } = now;
        public override DateTimeOffset GetUtcNow() => this.Now;
    }

    private sealed class Fixture
    {
        public Mock<TableClient> Client { get; } = new(MockBehavior.Strict);
        public Clock Clock { get; } = new(Now);
        public TableEntity? Written { get; private set; }
        public MutexFunctions Functions { get; }

        public Fixture(TableEntity? lease = null)
        {
            this.Client.Setup(x => x.GetEntityIfExistsAsync<TableEntity>("keys", Key,
                    It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(ReadResponse(lease));
            this.Client.Setup(x => x.AddEntityAsync(It.IsAny<TableEntity>(), It.IsAny<CancellationToken>()))
                .Callback<TableEntity, CancellationToken>((entity, _) => this.Written = entity)
                .ReturnsAsync(Mock.Of<Response>());
            this.Client.Setup(x => x.UpdateEntityAsync(It.IsAny<TableEntity>(), It.IsAny<ETag>(),
                    TableUpdateMode.Replace, It.IsAny<CancellationToken>()))
                .Callback<TableEntity, ETag, TableUpdateMode, CancellationToken>((entity, _, _, _) => this.Written = entity)
                .ReturnsAsync(Mock.Of<Response>());
            this.Functions = MutexFunctionsTests.Functions(this.Client.Object, this.Clock);
        }

        public Task<HttpResponseData> Wait(string body = "") =>
            this.Functions.RunWait(Request(body), Key, CancellationToken.None);
    }
}
