import { Typography } from '@signalco/ui-primitives/Typography';
import { Container } from '@signalco/ui-primitives/Container';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';

export default function SettingsAccountBillingPage() {
    return (
        <Container className="py-4" padded maxWidth="md">
            <Typography level="h1" className="text-2xl">Billing</Typography>
            <NoDataPlaceholder>
                No billing information available
            </NoDataPlaceholder>
        </Container>
    )
}