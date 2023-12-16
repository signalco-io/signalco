import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

export default function ContactPage() {
    return (
        <Stack spacing={4}>
            <Stack>
                <Typography>Social</Typography>
                <ul>
                    <li><a href="https://x.com/signalco_io">@signalco_io</a> at X</li>
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
