export const KnownPages = {
    Landing: '/',
    Status: 'https://status.doprocess.io',
    Processes: '/processes',
    Process: (id: string | number) => `/processes/${id}`,
} as const;
