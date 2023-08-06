import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Link } from '@signalco/ui/dist/Link';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Container } from '@signalco/ui/dist/Container';
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
            { name: 'Features', href: KnownPages.Features },
            { name: 'Channels', href: KnownPages.Channels },
            { name: 'App', href: KnownPages.App },
            { name: 'Pricing', href: KnownPages.Pricing },
            { name: 'Station', href: KnownPages.Station },
            { name: 'Roadmap', href: KnownPages.Roadmap },
        ]
    },
    {
        header: 'Community',
        links: [
            { name: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions', developerOnly: true },
            { name: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' }
        ]
    },
    {
        header: 'Resources',
        links: [
            { name: 'Status', href: KnownPages.Status },
            { name: 'Design', href: KnownPages.UiDocs },
            { name: 'API', href: KnownPages.DocsApi }
        ]
    },
    {
        header: 'Legal',
        links: [
            { name: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
            { name: 'Terms of Service', href: KnownPages.LegalTermsOfService },
            { name: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
            { name: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
            { name: 'SLA', href: KnownPages.LegalSla },
        ]
    }
];

export default function Footer() {
    return (
        <footer className="self-stretch">
            <Container maxWidth="lg">
                <div className="pb-8 pt-16">
                    <Stack spacing={8}>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {footerLinks.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                                <Stack key={section.header} spacing={2} className="min-w-[220px]">
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
                        </div>
                        <Stack className="items-center md:items-start" alignItems="center" spacing={2}>
                            <SignalcoLogotype width={220} />
                            <Typography level="body3">Copyright © {now().getFullYear()} signalco. All rights reserved.</Typography>
                            <Row>
                                <IconButton
                                    aria-label="X formerly known as Twitter"
                                    href="https://x.com/signalco_io"
                                    variant="plain">
                                    <svg height="16" viewBox="0 0 22 20" fill="currentColor"><path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path></svg>
                                </IconButton>
                                <IconButton
                                    aria-label="reddit"
                                    href="https://www.reddit.com/r/signalco/"
                                    variant="plain">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.238 15.348c.085.084.085.221 0 .306-.465.462-1.194.687-2.231.687l-.008-.002-.008.002c-1.036 0-1.766-.225-2.231-.688-.085-.084-.085-.221 0-.305.084-.084.222-.084.307 0 .379.377 1.008.561 1.924.561l.008.002.008-.002c.915 0 1.544-.184 1.924-.561.085-.084.223-.084.307 0zm-3.44-2.418c0-.507-.414-.919-.922-.919-.509 0-.923.412-.923.919 0 .506.414.918.923.918.508.001.922-.411.922-.918zm13.202-.93c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5-.129c0-.851-.695-1.543-1.55-1.543-.417 0-.795.167-1.074.435-1.056-.695-2.485-1.137-4.066-1.194l.865-2.724 2.343.549-.003.034c0 .696.569 1.262 1.268 1.262.699 0 1.267-.566 1.267-1.262s-.568-1.262-1.267-1.262c-.537 0-.994.335-1.179.804l-2.525-.592c-.11-.027-.223.037-.257.145l-.965 3.038c-1.656.02-3.155.466-4.258 1.181-.277-.255-.644-.415-1.05-.415-.854.001-1.549.693-1.549 1.544 0 .566.311 1.056.768 1.325-.03.164-.05.331-.05.5 0 2.281 2.805 4.137 6.253 4.137s6.253-1.856 6.253-4.137c0-.16-.017-.317-.044-.472.486-.261.82-.766.82-1.353zm-4.872.141c-.509 0-.922.412-.922.919 0 .506.414.918.922.918s.922-.412.922-.918c0-.507-.413-.919-.922-.919z" /></svg>
                                </IconButton>
                                <IconButton
                                    aria-label="GitHub"
                                    href="https://github.com/signalco-io/signalco"
                                    variant="plain">
                                    <svg height="19" viewBox="0 0 14 14" width="19" fill="currentColor"><path d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"></path></svg>
                                </IconButton>
                            </Row>
                        </Stack>
                    </Stack>
                </div>
            </Container>
        </footer>
    );
}
