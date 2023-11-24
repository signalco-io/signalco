import React from 'react';
import {Typography} from '@signalco/ui-primitives/Typography';
import {Stack} from '@signalco/ui-primitives/Stack';
import {Row} from '@signalco/ui-primitives/Row';
import {Link} from '@signalco/ui-primitives/Link';
import { isDeveloper } from '../../src/services/EnvProvider';

export type FooterSectionType = {
    header: string,
    links: { name: string, href: string, developerOnly?: boolean }[]
    developerOnly?: boolean
}

export default function FooterLinks({ footerSections }: { footerSections: FooterSectionType[] }) {
    return (
        <Row spacing={4} alignItems="start" justifyContent="space-between" style={{ flexWrap: 'wrap' }}>
            {footerSections.filter(i => isDeveloper ? true : !i.developerOnly).map(section => (
                <Stack key={section.header} spacing={2}>
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
    );
}
