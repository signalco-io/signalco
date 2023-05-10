export type ExternalUrls = {
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    frameSrc?: string[];
    connectSrc?: string[];
}

export const knownSecureHeadersExternalUrls: { [key: string]: ExternalUrls | ((param: string) => ExternalUrls) } = {
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
            frameSrc: [`'https://${tenant}.auth0.com'`],
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

function quotes(value: string) {
    return `'${value}'`;
}

export function combineSecureHeaders(
    baseDomains: string[],
    allowSubdomains: boolean,
    isDevelopment: boolean,
    externalUrls: ExternalUrls[]
) {
    const baseSubdomains = allowSubdomains ? (baseDomains.map(bd => `*.${bd.split('.').slice(-2).join('.')}`)) : [];
    return {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: '\'self\'',
                scriptSrc: ['\'self\'', ...externalUrls.map(e => e.scriptSrc?.map(quotes)), '\'unsafe-inline\'', isDevelopment ? '\'unsafe-eval\'' : undefined],
                objectSrc: '\'none\'',
                styleSrc: ['\'self\'', ...externalUrls.map(e => e.styleSrc?.map(quotes)), '\'unsafe-inline\''],
                fontSrc: ['\'self\''],
                manifestSrc: '\'self\'',
                mediaSrc: '\'self\'',
                childSrc: '\'self\'',
                frameSrc: ['\'self\'', , ...externalUrls.map(e => e.frameSrc?.map(quotes))],
                workerSrc: '\'self\'',
                imgSrc: ['\'self\'', 'data:', ...baseSubdomains?.map(quotes), ...externalUrls.map(e => e.imgSrc?.map(quotes)),],
                formAction: '\'self\'',
                connectSrc: ['\'self\'', ...baseSubdomains?.map(quotes), ...externalUrls.map(e => e.connectSrc?.map(quotes)),],
                baseURI: baseDomains?.map(quotes),
                'frame-ancestors': '\'none\''
            }
        },
        xssProtection: 'block-rendering',
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: allowSubdomains }],
        referrerPolicy: 'same-origin'
    };
}
