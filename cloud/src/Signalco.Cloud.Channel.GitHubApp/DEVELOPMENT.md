# Development notes

## GitHub App

The production secret's can't be obtained so we recomment creating new GitHub App for testing purposes. 
See [Creating GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app) 
for more info on how to create your app.

### Auth (prepare production values)

- Retrieve app ID, client ID, client Secret and private key (.PEM) from app page
- Convert PEM to XML (RSA) (don't use online tools... for security)
- Add to keyvault (see Secrets table bellow)

[Link - Octokit - Working with GitHub Apps](https://octokitnet.readthedocs.io/en/latest/github-apps/)
[Link - Obtaining an Access Token from a GitHub Application Webhook](https://www.jerriepelser.com/blog/obtain-access-token-github-app-webhook/)

### Secrets

Required secrets

| Name | Description | Example |
|------|-------------|---------|
| `GitHubApp--signalco-app--AppId` | GitHub App ID | `1234567` |
| `GitHubApp--signalco-app--ClientId` | GitHub App Client Id | `<CLIENT_ID>` |
| `GitHubApp--signalco-app--ClientSecret` | GitHub App Client Secret | `<CLIENT_SECRET>` |
| `GitHubApp--signalco-app--PrivateKey` | GitHub App Private key | `<RSAKeyValue>...</RSAKeyValue>` |

Example secrets.json (for local development).

```json
{
  "GitHubApp": {
    "signalco-app": {
      "AppId": "<APP_ID>",
      "ClientId": "<CLIENT_ID>",
      "ClientSecret": "<CLIENT_SECRET>",
      "PrivateKey": "<RSAKeyValue>...</RSAKeyValue>"
    }
  }
}
```