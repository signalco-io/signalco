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

## Cloudflare Email Routing

The `cloud-primary-production` stack adopts the existing `signalco.io` Email
Routing configuration: nine forwarding rules, one verified destination address,
the disabled drop catch-all, and Cloudflare's managed routing DNS. The inventory
was captured from Cloudflare on 2026-10-24. Other stacks do not register routing
resources unless explicitly configured.

Two secret stack settings configure adoption:

- `cloud-primary:emailRouting` contains the inventory described by
  [`EmailRoutingConfig`](./packages/pulumi/src/cloudflare/emailRouting.ts), including
  the existing zone, account, destination and rule IDs. Keep recipient addresses
  and routing actions encrypted. The inventory's zone and domain must match the
  stack's `zoneid` and `domain` settings.
- `cloud-primary:emailRoutingApiToken` is a dedicated Cloudflare token. It needs
  **Email Routing Addresses: Edit** on the destination's account and **Email
  Routing Rules: Edit** plus **Zone Settings: Edit** on `signalco.io`. The settings
  permission is required by Cloudflare's routing DNS endpoint. The general DNS
  provider and its token remain separate.

Every routing resource uses its existing Cloudflare ID as a Pulumi `import` and
has deletion protection. Rule priorities, enabled flags, matchers and actions are
preserved, including disabled rules and the disabled catch-all. Rules depend on
the routing DNS and adopted destinations. Cloudflare manages its locked MX/SPF
records through `EmailRoutingDns`; do not declare these again as `DnsRecord`
resources or unlock them during adoption.

Cloud Primary disables ACS SPF record management when an Email Routing inventory
is configured. For an older stack that still tracks a deleted ACS SPF record,
release this ownership change first, then refresh only the obsolete SPF resource
under the deployment mutex. This retires the stale state entry while Cloudflare
continues to own its routing DNS.

Destination addresses belong to a Cloudflare account, not a zone. Each address
must have exactly one owning Pulumi stack, even when rules in other zones use it.
The production inventory only adopts the destination used by `signalco.io`;
other destinations in the account stay under their existing ownership. A stack
that only owns zone rules must use an empty `destinations` array.

Before applying the initial adoption, run a production preview and confirm that
it imports the twelve existing resources without updating, replacing or deleting
mail resources. A preview does not import resources into state or verify email
delivery. Production adoption occurs when the change is released to `main` and
the production deployment succeeds; merging into `next` alone does not perform
that adoption.

Run the routing adoption tests with:

```bash
pnpm --filter @infra/cloud-primary test
```

The tests check the actual Pulumi registration requests for import IDs,
protection, the dedicated provider, dependencies and preserved behavior, and
verify that private routing fields remain secret. They also run before the
Cloud Primary CI preview and deployment.

Import formats and routing DNS permissions are documented in the
[Pulumi Cloudflare provider](https://www.pulumi.com/registry/packages/cloudflare/api-docs/)
and [Cloudflare routing DNS API](https://developers.cloudflare.com/api/resources/email_routing/subresources/dns/methods/get/).

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
