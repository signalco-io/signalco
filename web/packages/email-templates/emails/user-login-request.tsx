/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
import {
    Head,
    Html,
    Preview,
    Section, Tailwind,
} from '@react-email/components';
import { PrimaryButton } from '../components/PrimaryButton';
import { Paragraph } from '../components/Paragraph';
import { Link } from '../components/Link';
import { Header } from '../components/Header';
import { Divider } from '../components/Divider';
import { Disclaimer } from '../components/Disclaimer';
import { ContentCard } from '../components/ContentCard';

interface VercelInviteUserEmailProps {
    email: string;
    verifyPhrase: string;
    confirmLink: string;
    appName: string;
    appDomain: string;
}

export default function UserLoginRequestEmail({
    email = 'login@example.com',
    confirmLink = 'https://workingparty.ai/login',
    verifyPhrase = 'Amazing Gift',

    appName = 'WorkingParty',
    appDomain = 'workingparty.ai'
}: VercelInviteUserEmailProps) {
    const previewText = `Login request for ${appName}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <ContentCard>
                    <Header>Login request for <strong>{appName}</strong></Header>
                    <Paragraph>We reveiced a login request with following security code:</Paragraph>
                    <Section className="my-[32px] text-center">
                        <div className="rounded border border-solid border-[#eaeaea] p-3 text-center font-bold">
                            {verifyPhrase}
                        </div>
                    </Section>
                    <Paragraph>If above security code matches one you requested, click the button bellow to log in to <strong>{appName}</strong>.
                    </Paragraph>
                    <Section className="my-[32px] text-center">
                        <PrimaryButton href={confirmLink}>Log in to {appName}</PrimaryButton>
                    </Section>
                    <Paragraph>
                        or copy and paste this URL into your browser:{' '}
                        <Link href={confirmLink}>{confirmLink}</Link>
                    </Paragraph>
                    <Divider className="my-[26px]" />
                    <Disclaimer>
                        This login request was intended for{' '}
                        <span className="text-black">{email}</span>. If you were not
                        expecting this login request, you can ignore this email. If you are
                        concerned about your account&apos;s safety, please contact us at{' '}
                        <Link href={`mailto:security@${appDomain}`}>security@{appDomain}</Link>
                    </Disclaimer>
                </ContentCard>
            </Tailwind>
        </Html>
    );
}
