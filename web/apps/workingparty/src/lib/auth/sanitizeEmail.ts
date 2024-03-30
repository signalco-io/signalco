export function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}