export const KnownPages = {
    Landing: '/',
    Status: 'https://status.doprocess.io',
    Documents: '/documents',
    Document: (id: string | number) => `/documents/${id}`,
    Runs: '/runs',
    Processes: '/processes',
    Process: (id: string | number) => `/processes/${id}`,
    ProcessRun: (processId: string | number, runId: string | number) => `/processes/${processId}/runs/${runId}`,
} as const;
