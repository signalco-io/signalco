using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Storage;

namespace Signalco.Api.Public.Functions.Contacts;

public class ContactHistoryRetrieveFunction(
    IFunctionAuthenticator functionAuthenticator,
    IEntityService entityService,
    IAzureStorageDao storageDao)
{
    [Function("Contact-HistoryRetrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactHistoryRetrieveFunction>("Contact", Description = "Retrieves the contact history for provided duration.")]
    [OpenApiOkJsonResponse<ContactHistoryResponseDto>]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "contact/history")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
        {
            var entityId = req.Query["entityId"];
            var channelName = req.Query["channelName"];
            var contactName = req.Query["contactName"];
            var duration = req.Query["duration"];
            
            if (string.IsNullOrWhiteSpace(entityId) ||
                string.IsNullOrWhiteSpace(channelName) ||
                string.IsNullOrWhiteSpace(contactName))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Required fields not provided.");

            var authTask = context.ValidateUserAssignedAsync(entityService, entityId);
            var historyDataTask = storageDao.ContactHistoryAsync(
                new ContactPointer(entityId, channelName, contactName),
                TimeSpan.TryParse(duration, out var durationValue)
                    ? durationValue
                    : double.TryParse(duration, out var durationValueMs)
                        ? TimeSpan.FromMilliseconds(durationValueMs)
                        : TimeSpan.FromDays(1),
                cancellationToken);

            await Task.WhenAll(authTask, historyDataTask);

            return new ContactHistoryResponseDto
            {
                Values = historyDataTask.Result.Select(d => new ContactHistoryResponseDto.TimeStampValuePair
                {
                    TimeStamp = d.Timestamp,
                    ValueSerialized = d.ValueSerialized
                })
            };
        });

    [Serializable]
    private class ContactHistoryResponseDto
    {
        [JsonPropertyName("values")]
        public IEnumerable<TimeStampValuePair>? Values { get; set; }

        [Serializable]
        public class TimeStampValuePair
        {
            [JsonPropertyName("timeStamp")]
            public DateTime TimeStamp { get; set; }

            [JsonPropertyName("valueSerialized")]
            public string? ValueSerialized { get; set; }
        }
    }
}