import UserLoginRequestEmail from '@signalco/email-templates/emails/user-login-request';
import { appName, domain } from '../../../../src/providers/env';
import { sendEmail } from '../../../../src/lib/email/emailService';

export async function POST(request: Request) {
    const json = await request.json();
    let email: string | undefined = undefined;
    if (json && typeof json === 'object' && 'email' in json && typeof json.email === 'string') {
        email = json.email;
    }

    if (!email)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    const token = '123345';
    const loginLink = `https://${domain}/login/confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    const verifyPhrase = token; // TODO: Generate verify phrase

    // Send email
    await sendEmail({
        recipient: email,
        subject: 'WorkingParty Login Request',
        sender: 'system',
        template: UserLoginRequestEmail({
            appDomain: domain,
            appName: appName,
            email,
            verifyPhrase,
            loginLink
        })
    });

    return Response.json({
        verifyPhrase
    });
}
