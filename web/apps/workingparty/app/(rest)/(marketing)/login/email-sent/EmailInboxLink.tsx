import { ExternalLink } from '@signalco/ui-icons';
import { emailInboxUrl } from '@signalco/js';

export function EmailInboxLink({ email }: { email: string | undefined; }) {
    const url = emailInboxUrl(email);
    if (!url) return (
        <span className="text-blue-500 underline">{email}</span>
    );

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nowrap text-blue-500 underline"
        >
            {email}
            <ExternalLink className="ml-1 inline-block size-3" />
        </a>
    );
}
