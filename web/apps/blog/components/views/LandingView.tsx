import fs from 'fs';
import React from 'react';
import klaw from 'klaw';
import Typography from '@signalco/ui/dist/Typography';
import {Stack} from '@signalco/ui/dist/Stack';
import {Row} from '@signalco/ui/dist/Row';
import {Link} from '@signalco/ui/dist/Link';
import PageCenterHeader from '../pages/PageCenterHeader';

export default async function LandingPageView() {
    const posts = [];
    for await (const file of klaw('./app/(posts)')) {
        if (!file.path.endsWith('.mdx')) continue;
        const content = fs.readFileSync(file.path, 'utf8');
        const meta = content.match(/export const meta = ({.*?});/s)?.[1];
        if (!meta) continue;
        const directoryName = file.path.split(/\/|\\/).slice(-2)[0];
        const title = meta.match(/title: '(.*)'/)?.[1];
        const description = meta.match(/description: '(.*)'/)?.[1];
        const category = meta.match(/category: '(.*)'/)?.[1];
        const date = meta.match(/date: '(.*)'/)?.[1];
        posts.push({ link: directoryName, title, description, category, date });
    }

    return (
        <div style={{ paddingTop: 12 }}>
            <PageCenterHeader header={'Blog'} />
            <Stack spacing={4}>
                <Typography level="h5">All posts</Typography>
                <Row spacing={2} style={{ flexWrap: 'wrap' }}>
                    {posts.map(post => (
                        <div key={post.title} style={{
                            minWidth: 300,
                            padding: 16,
                            border: '1px solid var(--joy-palette-divider)',
                            borderRadius: 4
                        }}>
                            <Stack key={post.title} spacing={2}>
                                <Link href={post.link}>
                                    <Typography level="h3">{post.title}</Typography>
                                </Link>
                                <Typography level="body2" secondary>{post.category}</Typography>
                                <Typography level="body1">{post.description}</Typography>
                            </Stack>
                        </div>
                    ))}
                </Row>
            </Stack>
        </div>
    );
}
