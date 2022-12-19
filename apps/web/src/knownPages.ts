import { isDeveloper } from './services/EnvProvider';

const domainTld = isDeveloper ? 'dev' : 'io';

export const KnownPages = {
    AppChannels: `https://app.signalco.${domainTld}/channel`,
    App: `https://app.signalco.${domainTld}`,
    Channels: '/channels',
    Pricing: '/pricing'
} as const;
