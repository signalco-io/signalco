import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Container } from '@signalco/ui-primitives/Container';
import SignalcoLogotype from '../icons/SignalcoLogotype';
import { isDeveloper } from '../../src/services/EnvProvider';
import { now } from '../../src/services/DateTimeProvider';
import { KnownPages } from '../../src/knownPages';


type FooterSectionType = {
    header: string,
    links: { name: string, href: string, developerOnly?: boolean }[]
    developerOnly?: boolean
}

const footerLinks: FooterSectionType[] = [
    {
        header: 'Product',
        links: [
            // { name: 'Features', href: KnownPages.Features },
            // { name: 'Channels', href: KnownPages.Channels },
            { name: 'App', href: KnownPages.App },
            // { name: 'Pricing', href: KnownPages.Pricing },
            // { name: 'Station', href: KnownPages.Station },
            // { name: 'Roadmap', href: KnownPages.Roadmap },
        ]
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
    // {
    //     header: 'Resources',
    //     links: [
    //         { name: 'Status', href: KnownPages.Status },
    //         { name: 'Design', href: KnownPages.UiDocs },
    //         { name: 'API', href: KnownPages.DocsApi }
    //     ]
    // },
    // {
    //     header: 'Legal',
    //     links: [
    //         { name: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
    //         { name: 'Terms of Service', href: KnownPages.LegalTermsOfService },
    //         { name: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
    //         { name: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
    //         { name: 'SLA', href: KnownPages.LegalSla },
    //     ]
    // }
];

export default function Footer() {
    return (
        <footer style={{ alignSelf: 'stretch' }}>
            <Container maxWidth="lg">
                <div style={{ padding: '64px 0 32px 0' }}>
                    <Stack spacing={4}>
                        <Row spacing={4} alignItems="start" justifyContent="space-between" style={{ flexWrap: 'wrap' }}>
                            {footerLinks.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                                <Stack key={section.header} spacing={2} style={{ minWidth: 220 }}>
                                    <Typography level="h6" component="h2">{section.header}</Typography>
                                    <Stack spacing={1}>
                                        {section.links.filter(l => isDeveloper ? true : !l.developerOnly).map(link => (
                                            <Link key={link.name} href={link.href}>
                                                <Typography>{link.name}</Typography>
                                            </Link>
                                        ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Row>
                        <Stack>
                            <SignalcoLogotype width={220} />
                            <Stack alignItems="center" justifyContent="space-between">
                                <Typography level="body3">Copyright © {now().getFullYear()} signalco. All rights reserved.</Typography>
                                <Row spacing={1}>
                                    <IconButton
                                        aria-label="X formerly known as Twitter"
                                        href="https://x.com/signalco_io">
                                        <Typography>X</Typography>
                                    </IconButton>
                                    <IconButton
                                        aria-label="reddit"
                                        href="https://www.reddit.com/r/signalco/">
                                        <Typography>/r</Typography>
                                    </IconButton>
                                    <IconButton
                                        aria-label="GitHub"
                                        href="https://github.com/signalco-io/signalco">
                                        <Typography>gh</Typography>
                                    </IconButton>
                                </Row>
                            </Stack>
                        </Stack>
                    </Stack>
                </div>
            </Container>
        </footer>
    );
}
