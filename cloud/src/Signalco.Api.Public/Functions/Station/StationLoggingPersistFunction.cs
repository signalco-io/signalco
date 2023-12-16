using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Extensions;
using Signal.Core.Storage;

namespace Signalco.Api.Public.Functions.Station;

public class StationLoggingPersistFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService,
    IAzureStorage storage)
{
    [Function("Station-Logging-Persist")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<StationLoggingPersistFunction>("Station", Description = "Appends logging entries.")]
    [OpenApiJsonRequestBody<StationsLoggingPersistRequestDto>(Description = "The logging entries to persist per station.")]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "station/logging/persist")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest<StationsLoggingPersistRequestDto>(
            cancellationToken, functionAuthenticator, async context =>
            {
                var payload = context.Payload;
                if (string.IsNullOrWhiteSpace(payload.StationId))
                    throw new ExpectedHttpException(HttpStatusCode.BadRequest, "StationId is required.");

                await context.ValidateUserAssignedAsync(
                    entityService,
                    payload.StationId);

                var entriesByDate = (payload.Entries ?? Enumerable.Empty<StationsLoggingPersistRequestDto.Entry>())
                    .Where(e => e.TimeStamp.HasValue)
                    .GroupBy(e => e.TimeStamp!.Value.Date)
                    .ToList();
                foreach (var entriesDay in entriesByDate)
                {
                    var sb = new StringBuilder();
                    foreach (var entry in entriesDay)
                        sb.AppendLine((string?) $"[{entry.TimeStamp:O}] ({entry.Level}) {entry.Message}");

                    var fileName = $"{entriesDay.Key:yyyyMMdd}.txt";

                    await using var ms = new MemoryStream();
                    await using var sw = new StreamWriter(ms, Encoding.UTF8);
                    await sw.WriteAsync(sb, cancellationToken);
                    await sw.FlushAsync();
                    ms.Position = 0;

                    await storage.AppendToFileAsync(payload.StationId.SanitizeFileName(), fileName, ms, cancellationToken);
                }
            });

    [Serializable]
    private class StationsLoggingPersistRequestDto
    {
        [Required]
        [JsonPropertyName("stationId")]
        public string? StationId { get; set; }

        [Required]
        [JsonPropertyName("entries")]
        public List<Entry>? Entries { get; set; }

        [Serializable]
        public class Entry
        {
            [JsonPropertyName("T")] public DateTimeOffset? TimeStamp { get; set; }

            [JsonPropertyName("L")] public LogLevel? Level { get; set; }

            [JsonPropertyName("M")] public string? Message { get; set; }
        }

        public enum LogLevel
        {
            Trace,
            Debug,
            Information,
            Warning,
            Error,
            Fatal
        }
    }
}