import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';

export default function RootNotFoundError() {
    return (
        <Stack alignItems="center" justifyContent="center" className="mt-16 min-h-fit">
            <Row justifyContent="center">
                <Stack spacing={4}>
                    <Typography level="h1">Page not found</Typography>
                    <Typography>Page you are looking for could not be found.</Typography>
                    <Row spacing={1}>
                        <NavigatingButton href="/">WorkingParty home</NavigatingButton>
                    </Row>
                </Stack>
            </Row>
        </Stack>
    )
}
