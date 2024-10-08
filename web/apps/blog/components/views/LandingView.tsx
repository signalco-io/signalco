import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import React, { memo } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Card, CardContent, CardHeader } from '@signalco/ui-primitives/Card';
import { CompanyGitHub, CompanyReddit, CompanyX } from '@signalco/ui-icons';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { SectionData } from '@signalco/cms-core/SectionData';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import PageCenterHeader from '../pages/PageCenterHeader';
import SignalcoLogotype from '../icons/SignalcoLogotype';
import { KnownPages } from '../../src/knownPages';

const sectionsComponentRegistry = {
    'Footer1': memo(Footer1)
}

const sectionsData: SectionData[] = [
    {
        component: 'Footer1',
        tagline: 'signalco',
        asset: <SignalcoLogotype width={220} />,
        features: [
            {
                header: 'Community',
                ctas: [
                    { label: 'r/signalco', href: 'https://www.reddit.com/r/signalco/' },
                    { label: 'Discussions on GitHub', href: 'https://github.com/signalco-io/signalco/discussions' },
                ]
            },
            {
                header: 'Legal',
                ctas: [
                    { label: 'Privacy Policy', href: KnownPages.LegalPrivacyPolicy },
                    { label: 'Terms of Service', href: KnownPages.LegalTermsOfService },
                    { label: 'Cookie Policy', href: KnownPages.LegalCookiePolicy },
                    { label: 'Acceptable Use Policy', href: KnownPages.LegalAcceptableUsePolicy },
                    { label: 'SLA', href: KnownPages.LegalSla },
                ]
            }
        ],
        ctas: [
            { label: 'X formerly known as Twitter', href: 'https://x.com/signalco_io', icon: <CompanyX /> },
            { label: 'reddit', href: 'https://www.reddit.com/r/signalco/', icon: <CompanyReddit /> },
            { label: 'GitHub', href: 'https://github.com/signalco-io/signalco', icon: <CompanyGitHub /> },
        ]
    }
];

export default async function LandingPageView() {
    // Get all *.mdx files in base directory
    const baseDirectory = './app/(posts)';
    const postsDirectories = (await readdir(baseDirectory, { withFileTypes: true }))
        .filter(item => item.isDirectory());
    const postsFiles: string[] = [];
    for (const directoryName of postsDirectories) {
        const files = await readdir(join(baseDirectory, directoryName.name));
        const mdxFiles = files.filter(file => file.endsWith('.mdx'));
        postsFiles.push(...mdxFiles.map(file => join(baseDirectory, directoryName.name, file)));
    }

    const posts = [];
    for (const file of postsFiles) {
        const content = await readFile(file, 'utf8');
        const meta = content.match(/export const meta = ({.*?});/s)?.[1];
        if (!meta) continue;
        const directoryName = file.split(/\/|\\/).slice(-2)[0];
        const title = meta.match(/title: '(.*)'/)?.[1];
        const description = meta.match(/description: '(.*)'/)?.[1];
        const category = meta.match(/category: '(.*)'/)?.[1];
        const date = meta.match(/date: '(.*)'/)?.[1];
        posts.push({ link: directoryName, title, description, category, date });
    }

    return (
        <div>
            <PageCenterHeader header={'Blog'} />
            <Stack spacing={4}>
                <Typography level="h5">All posts</Typography>
                <Row spacing={2} style={{ flexWrap: 'wrap' }}>
                    {posts.map(post => (
                        <Card key={post.title} href={post.link}>
                            <CardHeader>{post.title}</CardHeader>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography level="body2" secondary>{post.category}</Typography>
                                    <Typography level="body1">{post.description}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Row>
            </Stack>
            <SectionsView
                sectionsData={sectionsData}
                componentsRegistry={sectionsComponentRegistry} />
        </div>
    );
}
