export const KnownPages = {
    Landing: '/',

    Login: '/login',
    LoginEmailSent: (verifyPhrase: string, email: string, clientToken: string) => '/login/email-sent?verifyPhrase=' + encodeURIComponent(verifyPhrase) + '&email=' + encodeURIComponent(email) + '&clientToken=' + encodeURIComponent(clientToken),
    LoginConfirm: '/login/confirm',
    LoginConfirmSuccess: '/login/confirm-success',
    LoginConfirmFailed: '/login/confirm-failed',

    App: '/app',
    AppMarketplace: '/app/marketplace',
    AppMarketplaceCategory: (categoryId: string) => `/app/marketplace/${categoryId}`,
    AppMerketplaceExploreWorker: (workerId: string) => `/app/marketplace/explore?worker=${workerId}`,
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
    Contact: '/contact',

    LegalPrivacyPolicy: '/legal/privacy-policy',
    LegalTermsOfService: '/legal/terms-of-service',
    LegalCookiePolicy: '/legal/cookie-policy',
    LegalAcceptableUsePolicy: '/legal/acceptable-use-policy',
    LegalSla: '/legal/sla'
} as const;
