import { Typography } from '@signalco/ui-primitives/Typography';
import { Container } from '@signalco/ui-primitives/Container';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';

export default function SettingsAccountGeneralPage() {
    return (
        <Container className="py-4">
            <Typography level="h1" className="text-2xl">Account</Typography>
            <NoDataPlaceholder>
                No account settings available
            </NoDataPlaceholder>
        </Container>
    )
}