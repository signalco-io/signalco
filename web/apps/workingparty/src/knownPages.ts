export const KnownPages = {
    Landing: '/',

    Login: '/login',
    LoginEmailSent: (verifyPhrase: string, email: string) => '/login/email-sent?verifyPhrase=' + encodeURIComponent(verifyPhrase) + '&email=' + encodeURIComponent(email),
    LoginConfirm: '/login/confirm',
    LoginConfirmFailed: '/login/confirm-failed',

    App: '/app',
    AppMarketplace: '/app/marketplace',
    AppWorkers: '/app/workers',
    AppWorker: (id: string) => `/app/workers/${id}`,
    AppWorkerThread: (workerid: string, threadid: string) => `/app/workers/${workerid}/threads/${threadid}`,
    AppSettings: '/app/settings',
    AppSettingsProfile: '/app/settings/profile',
    AppSettingsSecurity: '/app/settings/security',
    AppSettingsNotifications: '/app/settings/notifications',
    AppSettingsAccount: '/app/settings/account',
    AppSettingsAccountUsage: '/app/settings/account/usage',
    AppSettingsAccountBilling: '/app/settings/account/billing',
    AppSettingsAccountBillingPlans: '/app/settings/account/billing/plans',
    AppSettingsAccountBillingPortal: (accountId: string) => `/api/accounts/${accountId}/billing/portal`,
    AppLogout: '/app/logout',

    Pricing: '/pricing',

    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
