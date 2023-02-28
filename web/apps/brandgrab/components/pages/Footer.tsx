import React from 'react';
import Stack from '@signalco/ui/dist/Stack';
import Container from '@signalco/ui/dist/Container';
import { FooterLinks } from './FooterLinks';
import { FooterInfo } from './FooterInfo';

export default function Footer() {
    return (
        <Container maxWidth="lg">
            <footer style={{ padding: '64px 0 32px 0' }}>
                <Stack spacing={4}>
                    <FooterLinks />
                    <FooterInfo />
                </Stack>
            </footer>
        </Container>
    );
}
