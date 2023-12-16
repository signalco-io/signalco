import { CheckFrequency } from './Checkly/apiStatusCheck';

// Monitoring intervals
export const ConfChannelApiCheckInterval: CheckFrequency = 120;
export const ConfCloudApiCheckInterval: CheckFrequency = 60;
export const ConfInternalApiCheckInterval: CheckFrequency = 180;
export const ConfPublicSignalRCheckInterval: CheckFrequency = 180;