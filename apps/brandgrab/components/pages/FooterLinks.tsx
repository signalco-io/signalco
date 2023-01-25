'use client';

import React from 'react';
import Stack from '@signalco/ui/dist/Stack';
import Link from '@signalco/ui/dist/Link';
import { Grid } from '@signalco/ui';
import { isDeveloper } from '../../src/services/EnvProvider';

type FooterSectionType = {
    header: string,
    links: { name: string, href: string, developerOnly?: boolean }[]
    developerOnly?: boolean
}

export const footerLinks: FooterSectionType[] = [
    {
        header: 'Product',
        links: [
        ]
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
];

export function FooterLinks() {
    return (
        <Grid container direction="row" justifyContent="space-between" spacing={4}>
            {footerLinks.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                <Grid key={section.header} xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <h6 style={{ paddingBottom: 8 }}>{section.header}</h6>
                    <Stack spacing={1}>
                        {section.links.filter(l => isDeveloper ? true : !l.developerOnly).map(link => (
                            <Link key={link.name} href={link.href}>{link.name}</Link>
                        ))}
                    </Stack>
                </Grid>
            ))}
        </Grid>
    );
}
