export const KnownPages = {
    Landing: '/',
    Contact: '/contact',
    Status: 'https://status.doprocess.io',

    Login: '/login',
    Logout: '/logout',

    Documents: '/documents',
    Document: (id: string | number) => `/documents/${id}`,
    Runs: '/runs',
    ProcessRuns: (id: string) => `/runs?process-id=${id}`,
    Processes: '/processes',
    Process: (id: string | number) => `/processes/${id}`,
    ProcessRun: (processId: string | number, runId: string | number) => `/processes/${processId}/runs/${runId}`,

    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
