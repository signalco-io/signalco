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

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/signalco-io/signalco)

Or Clone and build locally

### Local development

First, run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Deploy

Apps from this repository are deployed on Vercel.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Links

Staging (branch `next`):

- [signalco.dev](https://next.signalco.io)

Production (branch `main`):

- [signalco.io](https://www.signalco.io)

## More info

### Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
