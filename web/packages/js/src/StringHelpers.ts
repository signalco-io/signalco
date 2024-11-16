export const trimStartChar = (value: string, char: string): string => {
    while (value.charAt(0) == char) {
        value = value.substring(1);
    }
    return value;
};

export const camelToSentenceCase = (value: string): string => {
    const result = value.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const initials = (value: string): string => {
    const words = value.split(' ');
    if (words.length === 1) {
        return value.charAt(0).toUpperCase();
    } else if (words.length > 1) {
        return ((words[0]?.charAt(0) ?? '') + words.at(-1)?.charAt(0)).toUpperCase();
    }
    return '';
}

export const isAbsoluteUrl = (value: string | null): boolean => {
    if (value == null) return false;
    const match = value.match(/^https?:\/\//);
    return match != null && match.length > 0;
};

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function humanizeNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function isJson(value: string | undefined) {
    try {
        if (typeof value === 'string' &&
            /(\[|\{).*(\]|\})/gm.test(value) &&
            typeof JSON.parse(value) !== 'undefined')
            return true;
        return false;
    } catch {
        return false;
    }
}

export function isImageDataUrl(url: string) {
    return url.startsWith('data:image/');
}

export function slug(value: string | undefined) {
    if (!value) return undefined;
    if (value.length > 1000) return undefined; // Too large to generate slug, avoid DoS
    return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}
