using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Exceptions;
using Signal.Core.Storage;

namespace Signal.Api.Public.Functions.Contacts;

public class ContactHistoryRetrieveFunction
{
    private readonly IFunctionAuthenticator functionAuthenticator;
    private readonly IEntityService entityService;
    private readonly IAzureStorageDao storageDao;

    public ContactHistoryRetrieveFunction(
        IFunctionAuthenticator functionAuthenticator,
        IEntityService entityService,
        IAzureStorageDao storage)
    {
        this.functionAuthenticator =
            functionAuthenticator ?? throw new ArgumentNullException(nameof(functionAuthenticator));
        this.entityService = entityService ?? throw new ArgumentNullException(nameof(entityService));
        this.storageDao = storage ?? throw new ArgumentNullException(nameof(storage));
    }

    [FunctionName("Contact-HistoryRetrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ContactHistoryRetrieveFunction>("Contact", Description = "Retrieves the contact history for provided duration.")]
    [OpenApiOkJsonResponse<ContactHistoryResponseDto>]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "contact/history")]
        ContactHistoryRequestDto payload,
        HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, this.functionAuthenticator, async context =>
        {
            if (string.IsNullOrWhiteSpace(payload.EntityId) ||
                string.IsNullOrWhiteSpace(payload.ChannelName) ||
                string.IsNullOrWhiteSpace(payload.ContactName))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Required fields not provided.");

            var authTask = context.ValidateUserAssignedAsync(this.entityService, payload.EntityId);
            var historyDataTask = this.storageDao.ContactHistoryAsync(
                new ContactPointer(payload.EntityId, payload.ChannelName, payload.ContactName),
                TimeSpan.TryParse(payload.Duration, out var durationValue)
                    ? durationValue
                    : double.TryParse(payload.Duration, out var durationValueMs)
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
                }).ToList()
            };
        });

    [Serializable]
    public class ContactHistoryRequestDto
    {
        [Required]
        [JsonPropertyName("entityId")]
        public string? EntityId { get; set; }

        [Required]
        [JsonPropertyName("channelName")]
        public string? ChannelName { get; set; }

        [Required]
        [JsonPropertyName("contactName")]
        public string? ContactName { get; set; }

        [JsonPropertyName("duration")]
        public string? Duration { get; set; }
    }

    [Serializable]
    private class ContactHistoryResponseDto
    {
        [JsonPropertyName("values")]
        public List<TimeStampValuePair> Values { get; set; } = new();

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