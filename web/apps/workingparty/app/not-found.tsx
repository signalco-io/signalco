import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Container } from '@signalco/ui-primitives/Container';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../src/knownPages';

export default function RootNotFoundError() {
    return (
        <Container className="flex h-full items-center" maxWidth="sm">
            <Stack spacing={4}>
                <Typography level="h1">Page not found</Typography>
                <Typography level="body2">Page you are looking for could not be found.</Typography>
                <Row spacing={1}>
                    <NavigatingButton href={KnownPages.Landing}>Home</NavigatingButton>
                </Row>
            </Stack>
        </Container>
    )
}
