import UserLoginRequestEmail from '@signalco/email-templates/emails/user-login-request';
import { appName, domain } from '../../../../src/providers/env';
import { loginRequestsCreate } from '../../../../src/lib/repository/loginRequests';
import { sendEmail } from '../../../../src/lib/email/emailService';
import { words } from './shortWordsList';

function toPhrase(token: string) {
    const wordsLength = words.length;
    const tokenLength = token.length;
    const firstPart = token.slice(0, tokenLength / 2);
    const secondPart = token.slice(tokenLength / 2);

    const multiplier = Math.random() * 100;

    const firstPartHash = Math.floor(firstPart.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * multiplier);
    const secondPartHash = Math.floor(secondPart.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * multiplier);

    const word1 = words[firstPartHash % wordsLength] ?? 'working';
    const word2 = words[secondPartHash % wordsLength] ?? 'party';

    return `${word1[0]?.toUpperCase()}${word1.slice(1)} ${word2[0]?.toUpperCase()}${word2.slice(1)}`;
}

export async function POST(request: Request) {
    const json = await request.json();
    let email: string | undefined = undefined;
    if (json && typeof json === 'object' && 'email' in json && typeof json.email === 'string') {
        email = json.email;
    }

    if (!email)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    const token = await loginRequestsCreate(email);
    const loginLink = `https://${domain}/login/confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    const verifyPhrase = toPhrase(token);

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
