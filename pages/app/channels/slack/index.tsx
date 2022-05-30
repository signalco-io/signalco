import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { AppLayoutWithAuth } from '../../../../components/layouts/AppLayoutWithAuth';
import HttpService from '../../../../src/services/HttpService';
import OAuthRedirectConnectButton from '../../../../components/oauth/OAuthRedirectConnectButton';

const slackAppClientIdResolved = process.env.SLACK_CLIENTID;

const slackScopes = [
    'chat:write',
    'chat:write.public',
    'channels:read',
    'channels:history'
];

const ChannelSlack = () => {
    const handleOAuthCode = async (code: string) => {
        await HttpService.requestAsync('https://slack.channel.signalco.dev/api/oauth/access', 'post', { code });
    };

    return (
        <Stack spacing={{ xs: 0, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}>Slack</Typography>
            <Stack>
                <OAuthRedirectConnectButton
                    label="Add to Slack"
                    initiateUrl={`https://slack.com/oauth/v2/authorize?scope=${slackScopes.join(',')}&client_id=${slackAppClientIdResolved}&redirect_uri=${typeof window !== 'undefined' ? `${window.location.origin}/app/channels/slack` : undefined}`}
                    queryParamName="code"
                    onCode={handleOAuthCode}
                />
            </Stack>
        </Stack>
    )
};

ChannelSlack.layout = AppLayoutWithAuth;

export default observer(ChannelSlack);
