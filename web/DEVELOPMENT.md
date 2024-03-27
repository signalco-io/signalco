# Development

[![Maintainability](https://api.codeclimate.com/v1/badges/8f6479343e1e51f2a2d1/maintainability)](https://codeclimate.com/github/signalco-io/signalco/maintainability)
[![CodeFactor](https://www.codefactor.io/repository/github/signalco-io/signalco/badge)](https://www.codefactor.io/repository/github/signalco-io/signalco)

## Table of contents

- [Getting Started](#getting-started)
- [Configure env variables](#configure-env-variables)
- [Deploy](#deploy)
  - [Links](#links)
- [More info](#more-info)
  - [Next.js](#nextjs)

## Getting Started

### Local development

Requirements:

- [pnpm](https://pnpm.io/installation)

Enable corepack:

```bash
corepack enable
```

Run the development server:

```bash
pnpm install
pnpm dev
```

Apps:

- Web on [http://localhost:3000](http://localhost:3000)
- App on [http://localhost:3001](http://localhost:3001)
- UI Docs on [http://localhost:6006](http://localhost:6006)

#### Turbo in local development

Remote caching is enabled but `TURBO_REMOTE_CACHE_SIGNATURE_KEY` environemnt variable needs to be set. Contact any contributor to get access to signature key to enable remote caching for your development environment.

## Configure env variables

`.env.local` example:

```raw
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=435dd50a-4830-483a-862c-d6faa6dacea7
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiYWxla3NhbmRhcnRvcGxlbGNvIiwiYSI6ImNsMXpiYzhwejBrNHczaW10cGpwdn.lgCHgLs6qBDqbpA-1g
```

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | Optional | Required |
| `NEXT_PUBLIC_APP_ENV` | Optional | Required `production` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Optional | Required `production` |

### Using doppler

Prerequesites:

- install [doppler CLI](https://docs.doppler.com/docs/install-cli)

Navigate to your `./web/apps/*/` directory and run following command to update local env file.

```bash
doppler secrets download --no-file --format env > .env
```

To setup project in `./web/apps/*/` directory use:

```bash
doppler login
doppler setup
```

## External services

### Stripe

#### Authentication

Apps using Stripe as payment gateway require 3 secrets:

- Stripe [`Publishable key`](https://dashboard.stripe.com/apikeys)
- Stripe [`Secret key`](https://dashboard.stripe.com/apikeys)
- Stripe Webhook [`Signing secret`](https://dashboard.stripe.com/webhooks)

We have Stripe account with "Test mode" active. This account is used in development and staging (`next.<APP>`).

Secrets are managed via Pulumi via Pulumi Secrets (cloud hosted) for deployed stages - see [`infra`](../infra/README.md) for more info.

#### Products and Prices

Products and prices are managed via Stripe UI and are automatically updated in-app via webhook events.

Product catalog is in following format:

- Product (plan)
  - Price - plan variation, eg. monthly/yearly plans
    - Metadata - usage limits and enabled features

Special `Free` plan can be created as one-time plan with single price of 0 currency and populated with metadata that match that offering.

##### Price metadata

###### WorkingParty.ai

- `limits_messages_total` - ammount of allowed monthly messages (only assistant messages count)
- `limits_workers_total` - amount of allowed active workers (all-time limit)

## Deploy

Apps from this repository are deployed on Vercel.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Links

Staging (branch `next`):

- [signalco.dev](https://www.signalco.dev)
- [app.signalco.dev](https://app.signalco.dev)
- [ui.signalco.dev](https://ui.signalco.dev)

Production (branch `main`):

- [signalco.io](https://www.signalco.io)
- [app.signalco.io](https://app.signalco.io)
- [ui.signalco.io](https://ui.signalco.io)

## More info

### Next.js

This project is using Next.js.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
