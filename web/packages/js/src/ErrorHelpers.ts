/**
 * Get the error text from an error object or string
 * @param error The error to get the text from
 * @returns The error text or 'Unknown error' if the error is not a string or an object with a `message` string property
 */
export function errorText(error: unknown | string): string | null {
    if (!error) return null;
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        return error.message;
    }
    return 'Unknown error';
}