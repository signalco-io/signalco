# Infrastrcuture

This is infrastructure monorepo for all services and applications under the Signalco project.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20)
- [pnpm](https://pnpm.io/)
- [Pulumi](https://www.pulumi.com/docs/get-started/install/)

### Setup

```bash
pnpm i
```

### Commands

- `pnpm lint` - Run all linters
- `pnpm build` - Build all packages
- `pnpm preview` - Runs infrastructure deployment preview

## Pulumi tips & tricks

### Transfer state from Pulumi Cloud to DIY (Azure Storage with Azure KeyVault)

Pre-requisites:

- Azure Storage Account
- Azure KeyVault

For each stack export state to local file:

```bash
pulumi stack rename <NEW_STACK_NAME>
pulumi stack change-secrets-provider passphrase
pulumi stack export --show-secrets --file <NEW_STACK_NAME>.stack.json
pulumi logout
```

Then configure your environment to be able to connect to Azure Storage Account:

```powershell
$env:AZURE_STORAGE_ACCOUNT='YOUR_STORAGE_ACCOUNT_NAME'
$env:AZURE_STORAGE_KEY='YOUR_STORAGE_KEY'
```

```bash
pulumi login azblob://<CONTAINER_NAME>
pulumi stack init <NEW_STACK_NAME>
pulumi stack import --file <NEW_STACK_NAME>.stack.json
pulumi stack change-secrets-provider "azurekeyvault://<VAULT_NAME>.vault.azure.net/keys/<KEY_NAME>/<KEY_ID>"
```
