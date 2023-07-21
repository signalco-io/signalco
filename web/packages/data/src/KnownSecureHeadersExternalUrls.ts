import { ExternalUrls } from "./ExternalUrls";

export type KnownSecureHeadersExternalUrlsObject = {
    [key: string]: ExternalUrls | ((param: string) => ExternalUrls);
};

export const knownSecureHeadersExternalUrls: KnownSecureHeadersExternalUrlsObject = {
    signalco: {
        connectSrc: ['https://*.signalco.io'],
        imgSrc: ['https://*.signalco.io']
    },
    hcaptcha: {
        scriptSrc: ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        styleSrc: ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        frameSrc: ['https://hcaptcha.com', 'https://*.hcaptcha.com'],
        connectSrc: ['https://hcaptcha.com', 'https://*.hcaptcha.com']
    },
    github: {
        connectSrc: ['https://api.github.com']
    },
    auth0: (tenant: string) => {
        return {
            frameSrc: [`https://${tenant}.auth0.com`],
            imgSrc: [`https://${tenant}.auth0.com`],
            connectSrc: [`https://${tenant}.auth0.com`]
        }
    },
    mapbox: {
        imgSrc: ['https://api.mapbox.com'],
        connectSrc: ['https://api.mapbox.com']
    },
    polygon: {
        connectSrc: ['https://api.polygon.io']
    },
    google: {
        imgSrc: ['https://lh3.googleusercontent.com'],
        connectSrc: ['https://lh3.googleusercontent.com']
    },
    clarity: {
        scriptSrc: ['https://*.clarity.ms'],
        connectSrc: ['https://*.clarity.ms']
    },
    vercel: {
        scriptSrc: ['https://vercel.live'],
        connectSrc: ['https://vercel.live']
    },
    azureSignalR: {
        connectSrc: ['https://*.service.signalr.net', 'wss://*.service.signalr.net']
    }
};


