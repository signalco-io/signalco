import { isDeveloper } from './services/EnvProvider';

const domainTld = isDeveloper ? 'dev' : 'io';

export const KnownPages = {
    AppChannels: `https://app.signalco.${domainTld}/channels`,
    App: `https://app.signalco.${domainTld}`,
    Channels: '/channels',
    Pricing: '/pricing',
    Station: '/station',
    Features: '/features',
    Roadmap: '/roadmap',
    Products: '/products',
    Contact: '/contact',
    DocsApi: '/docs/api',
    UiDocs: `https://ui.signalco.${domainTld}`,
    Status: 'https://status.signalco.io',
    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
