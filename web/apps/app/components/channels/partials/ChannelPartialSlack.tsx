'use client';

import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { objectWithKey } from '@signalco/js';
import OAuthRedirectConnectButton from '../../oauth/OAuthRedirectConnectButton';
import { requestAsync } from '../../../src/services/HttpService';
import { KnownPages } from '../../../src/knownPages';

const slackAppClientIdResolved = process.env.NEXT_PUBLIC_SLACK_CLIENTID;

const slackScopes = [
    'chat:write',
    'chat:write.public',
    'channels:read',
    'channels:history'
];

export default function ChannelPartialSlack() {
    const router = useRouter();
    const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${KnownPages.Channels}/slack`
        : undefined;

    const handleOAuthCode = async (code: string) => {
        const response = await requestAsync('https://slack.channel.api.signalco.io/api/auth/access', 'post', { code, redirectUrl });
        const id = objectWithKey(response, 'id')?.id;
        router.push(`${KnownPages.Entities}/${id}`);
    };

    return (
        <Stack spacing={2}>
            <Typography>To add slack to signalco you need to install Signalco app to your Slack team.</Typography>
            <div>
                <OAuthRedirectConnectButton
                    label="Install signalco Slack App"
                    initiateUrl={`https://slack.com/oauth/v2/authorize?scope=${slackScopes.join(',')}&client_id=${slackAppClientIdResolved}&redirect_uri=${redirectUrl}`}
                    queryParamName="code"
                    onCode={handleOAuthCode} />
            </div>
        </Stack>
    );
}
