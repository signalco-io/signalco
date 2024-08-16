import { PropsWithChildren } from 'react';
import {Stack} from '@signalco/ui-primitives/Stack';
import { Container } from '@signalco/ui-primitives/Container';
import { PageNav } from '@signalco/ui/Nav';
import SignalcoLogotype from '../icons/SignalcoLogotype';

type PageLayoutProps = PropsWithChildren<{
    maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}>;

export function PageLayout({ maxWidth, children }: PageLayoutProps) {
    return (
        <Stack spacing={4}>
            <PageNav logo={<SignalcoLogotype height={42} />} />
            <div className="pt-16">
                <Container maxWidth={maxWidth}>
                    {children}
                </Container>
            </div>
        </Stack>
    );
}
