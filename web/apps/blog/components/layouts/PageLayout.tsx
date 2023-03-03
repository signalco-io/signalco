import React from 'react';
import { ChildrenProps, Container, Stack } from '@signalco/ui';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

interface PageLayoutProps extends ChildrenProps {
    maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

export function PageLayout({ maxWidth, children }: PageLayoutProps) {
    console.log('PageLayout rendered');

    return (
        <Stack spacing={4}>
            <PageNav />
            <div style={{ paddingTop: 10 * 8 }}>
                <Container maxWidth={maxWidth}>
                    {children}
                </Container>
            </div>
            <Footer />
        </Stack>);
}
