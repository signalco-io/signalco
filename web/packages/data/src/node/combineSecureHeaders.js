export function combineSecureHeaders(
    baseDomains,
    allowSubdomains,
    isDevelopment,
    externalUrls,
) {
    const baseSubdomains = allowSubdomains ? (baseDomains.map(bd => `*.${bd.split('.').slice(-2).join('.')}`)) : [];
    return {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: '\'self\'',
                scriptSrc: ['\'self\'', ...externalUrls.flatMap(e => e.scriptSrc), '\'unsafe-inline\'', isDevelopment ? '\'unsafe-eval\'' : undefined],
                objectSrc: '\'none\'',
                styleSrc: ['\'self\'', ...externalUrls.flatMap(e => e.styleSrc), '\'unsafe-inline\''],
                fontSrc: ['\'self\'', ...externalUrls.flatMap(e => e.fontSrc), '\'self\' data:'],
                manifestSrc: '\'self\'',
                mediaSrc: '\'self\'',
                childSrc: '\'self\'',
                frameSrc: ['\'self\'', , ...baseSubdomains, ...externalUrls.flatMap(e => e.frameSrc)],
                workerSrc: ['\'self\'', '\'self\' blob:'],
                imgSrc: ['\'self\'', 'data:', 'blob:', ...baseSubdomains, ...externalUrls.flatMap(e => e.imgSrc)],
                formAction: '\'self\'',
                connectSrc: ['\'self\'', ...baseSubdomains, ...externalUrls.flatMap(e => e.connectSrc)],
                baseURI: baseDomains,
                'frame-ancestors': externalUrls.flatMap(e => e.frameAncestors).length 
                    ? externalUrls.flatMap(e => e.frameAncestors) 
                    : '\'none\''
            }
        },
        xssProtection: 'block-rendering',
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: allowSubdomains }],
        referrerPolicy: 'same-origin'
    };
}
