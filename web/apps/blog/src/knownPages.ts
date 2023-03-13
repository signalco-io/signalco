import { isDeveloper } from './services/EnvProvider';

const domainTld = isDeveloper ? 'dev' : 'io';

export const KnownPages = {
    App: `https://app.signalco.${domainTld}`,
    Blog: '/',
} as const;
