export const knownSecureHeadersExternalUrls = {
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
    auth0: (tenant) => {
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
    googleFonts: {
        fontSrc: ['https://fonts.gstatic.com'],
        connectSrc: ['https://fonts.gstatic.com']
    },
    stripe: {
        scriptSrc: ['https://js.stripe.com'],
        frameSrc: ['https://js.stripe.com'],
        connectSrc: ['https://api.stripe.com']
    },
    vercel: {
        imgSrc: ['https://vercel.com', 'https://vercel.live', 'https://sockjs-mt1.pusher.com', 'data: blob:'],
        scriptSrc: ['https://vercel.live', 'https://vitals.vercel-insights.com', 'https://*.vercel-scripts.com'],
        connectSrc: ['https://vercel.live', 'https://vercel.com', 'https://vitals.vercel-insights.com', 'https://*.vercel-scripts.com', 'https://sockjs-mt1.pusher.com', 'wss://ws-mt1.pusher.com'],
        frameSrc: ['https://vercel.live', 'https://vercel.com']
    },
    azureSignalR: {
        connectSrc: ['https://*.service.signalr.net', 'wss://*.service.signalr.net']
    },
    checkly: {
        connectSrc: ['https://api.checklyhq.com']
    }
};


