import Color from 'color';

// TODO: Move to shared library

export const trimStartChar = (value: string, char: string): string => {
    while (value.charAt(0) == char) {
        value = value.substring(1);
    }
    return value;
};

export const camelToSentenceCase = (value: string | null | undefined): string | undefined => {
    if (value == null)
        return undefined;

    const result = value.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const isAbsoluteUrl = (value: string | null): boolean => {
    if (value == null) return false;
    const match = value.match(/^https?:\/\//);
    return match != null && match.length > 0;
};

export function colorToRgb(hex: string) {
    return Color(hex).rgb().object();
}

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
