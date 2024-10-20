import { sanitizeEmail } from '@signalco/js';
import UserLoginRequestEmail from '@signalco/email-templates/emails/user-login-request';
import { appName, domain } from '../../../../src/providers/env';
import { toPhrase } from '../../../../src/lib/shared/phrases/toPhrase';
import { loginRequestsCreate } from '../../../../src/lib/repository/loginRequests';
import { sendEmail } from '../../../../src/lib/email/emailService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const json = await request.json();
    let email: string | undefined = undefined;
    if (json && typeof json === 'object' && 'email' in json && typeof json.email === 'string') {
        email = json.email;
    }
    if (!email)
        return Response.json({ error: 'Invalid request' }, { status: 400 });
    const sanitizedEmail = sanitizeEmail(email);

    const { id, clientId } = await loginRequestsCreate(sanitizedEmail);
    const confirmLink = `https://${domain}/login/confirm?email=${encodeURIComponent(sanitizedEmail)}&token=${encodeURIComponent(id)}`;
    const verifyPhrase = toPhrase(id);

    // Send email
    await sendEmail({
        recipient: sanitizedEmail,
        subject: 'WorkingParty Login Request',
        sender: 'system',
        template: UserLoginRequestEmail({
            appDomain: domain,
            appName: appName,
            email: sanitizedEmail,
            verifyPhrase,
            confirmLink
        })
    });

    return Response.json({
        verifyPhrase,
        clientId
    });
}
