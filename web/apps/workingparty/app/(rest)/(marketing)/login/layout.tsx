import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Container } from '@signalco/ui-primitives/Container';

export default function LoginLayout({ children }: PropsWithChildren) {
    return (
        <Row alignItems="center" className="h-[calc(100vh-104px)]">
            <Container maxWidth="xs">
                <Stack spacing={6}>
                    {children}
                </Stack>
            </Container>
        </Row>
    )
}
