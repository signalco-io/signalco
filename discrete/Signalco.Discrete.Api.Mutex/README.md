# Mutex API

`POST /api/wait/{key}` attempts to acquire a lease. A successful acquisition returns
`202 Accepted`; an active lease or a lost acquisition race returns `409 Conflict`.
The existing CLI and workflows can continue to send an empty body. The default
lease lasts 30 minutes.

To choose a different expiration, send a JSON object with an `expire` date:

```json
{ "expire": "2030-01-01T12:30:00+01:00" }
```

The date must be in the future and use ISO 8601 with an explicit timezone (`Z` or
an offset). It is normalized to UTC before storage. An omitted `expire` uses the
default, as does an empty or whitespace-only body. Malformed JSON, a non-object
body, or an invalid, null, timezone-free, or nonfuture `expire` returns
`400 Bad Request` without accessing storage.

Expired rows are replaced using their exact Azure Table ETag. If another caller
has changed or removed the row, the attempt returns `409` and the caller may retry.
Acquisition never deletes an expired row or performs an unconditional upsert.
Unexpected storage failures surface as function errors rather than contention.

Rows created before expiration support use their Azure `Timestamp` plus 30
minutes. A row with no usable timestamp or with an invalid explicit expiration
stays locked until explicitly released. Successful takeover stores a new explicit
expiration.

`POST /api/release/{key}` keeps its existing behavior: it deletes the key and
returns `202 Accepted`. There is no owner token or automatic cancellation of work
when a lease expires. Callers must finish and release before expiration; a late
release can otherwise delete a lease acquired by another caller. The current CLI
uses the default duration; custom dates are available through the HTTP API.

## Tests

Run the endpoint unit tests with .NET 8:

```sh
dotnet test discrete/Signalco.Discrete.Api.Mutex/tests/Signalco.Discrete.Api.Mutex.Tests.csproj
```

For the Azure Tables integration tests, start an ephemeral local Azurite instance:

```sh
docker run --detach --rm --name signalco-mutex-tests \
  --publish 127.0.0.1:10032:10002 \
  --env AZURITE_ACCOUNTS=mutexlocal:bG9jYWwtdGVzdC1rZXk= \
  mcr.microsoft.com/azure-storage/azurite:3.37.0 \
  azurite-table --tableHost 0.0.0.0 --disableTelemetry
MUTEX_AZURITE=1 dotnet test discrete/Signalco.Discrete.Api.Mutex/tests/Signalco.Discrete.Api.Mutex.Tests.csproj
docker stop signalco-mutex-tests
```

The non-secret account key above belongs only to the local emulator. Integration
tests use a fixed loopback endpoint and disposable tables; they cannot target a
remote storage account. They include eight synchronized contenders that read the
same expired lease and verify exactly one winner. CI runs both suites and includes
their result in the existing `[CI] OK` aggregate.
