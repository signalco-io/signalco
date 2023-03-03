# Development

## Shared across all channels, public and internal APIs

Following is required for all APIs.

If the channel API doesn't use some feature, the secret can be ommited.

Each channel can require additional secrets. See `DEVELOPMENT.md` document in corresponding channel project for more info.

### Azure Function application settings

AzureSignalR setting can be skipped if it's not used in channel API. Public and Internal APIs have this configured by default.

Required settings

| Name | Description | Example |
|------|-------------|---------|
| `AzureSignalRConnectionString` | SignalR connection string | `Endpoint=https://signalhub.service.signalr.net;AccessKey=d8s5FF5f48aS8s6s5s22+SbWvdasdaswGhs4/s4s8s7s554=;Version=1.0;` |
| `OpenApi__Version` | OpenAPI version | `v3` |
| `OpenApi__DocTitle` | OpenAPI document title | `Signalco Public Cloud API documentation` | 

### Azure KeyVault configuration

KeyVault secrets are shared across all APIs. There is no need to configure this for each API.

Required secrets

| Name | Description | Example |
|------|-------------|---------|
| `Auth0--AppIdentifier` | Auth0 App Identifier | `https://api.signal.dfnoise.com` |
| `Auth0--Domain` | Auth0 Domain | `dfnoise.eu.auth0.com` |
| `SignalStorageAccountConnectionString` | Azure Storage Account connection string | `DefaultEndpointsProtocol=https;AccountName=signal;AccountKey=ACCOUNT_KEY;EndpointSuffix=core.windows.net` |
| `AzureSpeech--SubscriptionKey` | Azure Speech subscription key | `dasdas4897dsa4dw7a4s8qd7a78a5s7a8s5a3ssdaghhy8r4` |
| `AzureSpeech--Region` | Azure Speech region | `westeurope` |
