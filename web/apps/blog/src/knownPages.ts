import { isDeveloper } from './services/EnvProvider';

const domainTld = isDeveloper ? 'dev' : 'io';

export const KnownPages = {
    App: `https://app.signalco.${domainTld}`,
    Blog: '/',

    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
