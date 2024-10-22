import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Card, CardContent, CardHeader } from '@signalco/ui-primitives/Card';
import PageCenterHeader from '../pages/PageCenterHeader';

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
        </div>
    );
}
