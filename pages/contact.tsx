import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import { PageLayout } from '../components/layouts/PageLayout';

function ContactPage() {
    return (
        <Stack spacing={4}>
            <Stack>
                <Typography>Social</Typography>
                <ul>
                    <li><a href="https://twitter.com/signalco_io">@signalco_io</a> at Twitter</li>
                    <li><a href="https://github.com/signalco-io">@signalco-io</a> at GitHub</li>
                    <li><a href="https://www.reddit.com/r/signalco/">r/signalco</a> at reddit</li>
                </ul>
            </Stack>
            <Stack>
                <Typography>Emails</Typography>
                <ul>
                    <li>contact@signalco.io</li>
                    <li>coc@signalco.io</li>
                    <li>support@signalco.io</li>
                    <li>gdpr@signalco.io</li>
                    <li>security@signalco.io</li>
                    <li>social@signalco.io</li>
                </ul>
            </Stack>
        </Stack>
    );
}

ContactPage.layout = PageLayout;

export default ContactPage;
