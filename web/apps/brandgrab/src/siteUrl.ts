export function siteUrl(input: string): URL {
    const value = input.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    const credentials = [url.username, url.password].some(Boolean);
    if (!['https:', 'http:'].includes(url.protocol) || credentials || url.port ||
        !/^(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z]{2,}$/i.test(url.hostname) ||
        /\.(localhost|local|internal|test|invalid)$/i.test(url.hostname)) {
        throw new Error('Enter a public website domain or an HTTP(S) URL.');
    }
    url.hash = '';
    return url;
}
