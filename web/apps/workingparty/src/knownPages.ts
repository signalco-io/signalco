export const KnownPages = {
    Landing: '/',
    App: '/app',
    AppWorker: (id: string) => `/app/workers/${id}`,
    AppWorkerThread: (workerid: string, threadid: string) => `/app/workers/${workerid}/threads/${threadid}`,
    Pricing: '/pricing',

    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
