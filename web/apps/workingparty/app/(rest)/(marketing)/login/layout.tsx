import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Container } from '@signalco/ui-primitives/Container';
import { AppClientProvider } from '../../../../src/components/providers/AppClientProvider';

export default function LoginLayout({ children }: PropsWithChildren) {
    return (
        <AppClientProvider>
            <Row alignItems="center" className="h-[calc(100vh-104px)]">
                <Container maxWidth="xs">
                    <Stack className="gap-8 md:gap-12">
                        {children}
                    </Stack>
                </Container>
            </Row>
        </AppClientProvider>
    )
}
