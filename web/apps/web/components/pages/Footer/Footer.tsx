import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Link } from '@signalco/ui-primitives/Link';
import { Divider } from '@signalco/ui-primitives/Divider';
import { SystemStatusLabel } from '../SystemStatusLabel';
import SignalcoLogotype from '../../icons/SignalcoLogotype';
import { isDeveloper } from '../../../src/services/EnvProvider';
import { KnownPages } from '../../../src/knownPages';
import { SignalcoSocialIcons } from './SignalcoSocialIcons';
import { FooterContainer } from './FooterContainer';

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
        <FooterContainer>
            <Stack spacing={4}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {footerLinks.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                        <Stack key={section.header} spacing={4} className="min-w-[220px]">
                            <Typography level="h6" component="h2">{section.header}</Typography>
                            <Stack spacing={1.5}>
                                {section.links.filter(l => isDeveloper ? true : !l.developerOnly).map(link => (
                                    <Link key={link.name} href={link.href}>
                                        <Typography level="body2" className="text-muted-foreground">{link.name}</Typography>
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </div>
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                    <Stack className="items-center md:items-start" alignItems="center" spacing={2}>
                        <SignalcoLogotype width={220} />
                    </Stack>
                    <SignalcoSocialIcons />
                </div>
                <Divider />
                <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between">
                    <SystemStatusLabel />
                    <Typography level="body3">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                </div>
            </Stack>
        </FooterContainer>
    );
}
