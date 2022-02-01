import { Stack, Typography } from "@mui/material";
import { PageLayout } from "../components/AppLayout";

const ContactPage = () => (
    <Stack spacing={4}>
        <Stack>
            <Typography>Emails</Typography>
            <ul>
                <li>contact@signalco.io</li>
                <li>coc@signalco.io</li>
                <li>support@signalco.io</li>
                <li>gdpr@signalco.io</li>
                <li>security@signalco.io</li>
            </ul>
        </Stack>
    </Stack>
);

ContactPage.layout = PageLayout;

export default ContactPage;