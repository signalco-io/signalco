export function emailInboxUrl(email: string | undefined): string | null {
    if (!email) return null;
    if (email.endsWith('@gmail.com')) {
        return 'https://mail.google.com/mail/u/0/#inbox';
    } else if (email.endsWith('@outlook.com')) {
        return 'https://outlook.live.com/mail/0/inbox';
    }
    return null;
}