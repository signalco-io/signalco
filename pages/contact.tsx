import { Stack, Typography } from "@mui/material";
import { PageLayout } from "../components/AppLayout";

const ContactPage = () => (
    <Stack spacing={4}>
        <Stack>
            <Typography>Social</Typography>
            <ul>
                <li><a href="https://twitter.com/signalco_io">@signalco_io</a></li>
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

ContactPage.layout = PageLayout;

export default ContactPage;