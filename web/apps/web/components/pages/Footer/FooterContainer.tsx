import { type PropsWithChildren } from 'react';
import { Container } from '@signalco/ui/Container';

export function FooterContainer({ children }: PropsWithChildren) {
    return (
        <footer className="self-stretch">
            <Container maxWidth="lg">
                <div className="pb-8 pt-16">
                    {children}
                </div>
            </Container>
        </footer>
    );
}
