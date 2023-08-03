import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { Container } from '@signalco/ui/dist/Container';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageLayout({ children }: PropsWithChildren) {
    console.log('PageLayout rendered');

    return (
        <Stack spacing={4}>
            <PageNav />
            <main className="pt-20">
                <Container>
                    {children}
                </Container>
            </main>
            <Footer />
        </Stack>);
}
