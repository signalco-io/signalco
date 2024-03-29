import React from 'react';
import {Stack} from '@signalco/ui-primitives/Stack';
import {Container} from '@signalco/ui-primitives/Container';
import FooterLinks, { type FooterSectionType } from './FooterLinks';
import { FooterInfo } from './FooterInfo';

const footerSections: FooterSectionType[] = [
    {
        header: 'Product',
        links: []
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions?discussions_q=label%3Aapp%3Abrandgrab', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
];

export default function Footer() {
    return (
        <Container>
            <footer style={{ padding: '64px 0 32px 0' }}>
                <Stack spacing={4}>
                    <FooterLinks footerSections={footerSections} />
                    <FooterInfo />
                </Stack>
            </footer>
        </Container>
    );
}
