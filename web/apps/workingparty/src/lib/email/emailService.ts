import { ReactElement } from 'react';
import { renderAsync } from '@react-email/components';
import { EmailClient, EmailMessage, KnownEmailSendStatus } from '@azure/communication-email';
import { isDeveloper, emailDomain } from '../../providers/env';

function emailClient() {
    const connectionString = process.env.ACS_CONNECTION_STRING;
    if (!connectionString)
        throw new Error('AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING is not set');

    return new EmailClient(connectionString);
}

export async function sendEmail({
    recipient, subject, sender, template
}: {
    recipient: string;
    subject: string;
    sender: 'system' | 'notifications',
    template: ReactElement;
}) {
    const recipients: EmailMessage['recipients'] = {
        to: [{ address: recipient }]
    };
    const senderAddress = sender === 'system'
        ? `system@${emailDomain}`
        : `notifications@${emailDomain}`;

    const emailHtml = await renderAsync(template);
    const emailPlaintext = await renderAsync(template, { plainText: true });

    const email = {
        senderAddress,
        recipients,
        content: {
            subject: isDeveloper ? `[dev] ${subject}` : subject,
            html: emailHtml,
            plainText: emailPlaintext
        }
    };

    // TODO: Save email to email queue with priority (get priority from props)

    const client = emailClient();
    const poller = await client.beginSend(email);
    const response = await poller.pollUntilDone();
    if (response.status !== KnownEmailSendStatus.Succeeded)
        throw new Error('Failed to send email');
}
