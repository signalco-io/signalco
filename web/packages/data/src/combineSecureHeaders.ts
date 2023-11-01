import { ExternalUrls } from "./ExternalUrls";

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
                scriptSrc: ['\'self\'', ...externalUrls.flatMap(e => e.scriptSrc), '\'unsafe-inline\'', isDevelopment ? '\'unsafe-eval\'' : undefined],
                objectSrc: '\'none\'',
                styleSrc: ['\'self\'', ...externalUrls.flatMap(e => e.styleSrc), '\'unsafe-inline\''],
                fontSrc: ['\'self\'', '\'self\' data:'],
                manifestSrc: '\'self\'',
                mediaSrc: '\'self\'',
                childSrc: '\'self\'',
                frameSrc: ['\'self\'', , ...externalUrls.flatMap(e => e.frameSrc)],
                workerSrc: '\'self\'',
                imgSrc: ['\'self\'', 'data:', ...baseSubdomains, ...externalUrls.flatMap(e => e.imgSrc),],
                formAction: '\'self\'',
                connectSrc: ['\'self\'', ...baseSubdomains, ...externalUrls.flatMap(e => e.connectSrc),],
                baseURI: baseDomains,
                'frame-ancestors': '\'none\''
            }
        },
        xssProtection: 'block-rendering',
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: allowSubdomains }],
        referrerPolicy: 'same-origin'
    };
}
