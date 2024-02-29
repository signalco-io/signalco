import { Typography } from '@signalco/ui-primitives/Typography';
import { Container } from '@signalco/ui-primitives/Container';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';

export default function SettingsSecurityPage() {
    return (
        <Container className="py-4">
            <Typography level="h1" className="text-2xl">Security</Typography>
            <NoDataPlaceholder>
                No security settings available
            </NoDataPlaceholder>
        </Container>
    )
}