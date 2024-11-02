import { notFound } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { Card } from '@signalco/ui-primitives/Card';
import { Bug, Link as LinkIcon } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Breadcrumbs } from '@signalco/ui/Breadcrumbs';
import { channelCategories as channelCategoriesData, channelsData } from '@signalco/data/data';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { channelsFaq } from '../data';
import { sectionsComponentRegistry } from '../../../page';
import { KnownPages } from '../../../../src/knownPages';
import ShareSocial from '../../../../components/pages/ShareSocial';
import CtaSection from '../../../../components/pages/CtaSection';
import ChannelLogo from '../../../../components/channels/ChannelLogo';

export async function generateStaticParams() {
    return channelsData.map((channel) => ({
        channelName: channel.channelName,
    }));
}

// TODO: Move to sianglco specific UI library
function LinkChannelIssues({ channelName }: { channelName: string }) {
    return (
        <Link href={`https://github.com/orgs/signalco-io/projects/2/views/1?filterQuery=label%3Achannel%3A${encodeURIComponent(channelName)}`}>
            <Row spacing={1}>
                <Bug className="size-5" />
                <span>Known issues</span>
            </Row>
        </Link>
    )
}

export default async function ChannelPage({ params }: { params: Promise<{ channelName: string }> }) {
    const { channelName } = await params;

    const channel = channelsData.find(c => c.channelName === channelName);
    if (!channel)
        return notFound();

    const channelCategories = channel.categories
        .map(cc => channelCategoriesData.find(category => category.id === cc))
        .filter(Boolean);

    const breadcrumbs = [
        { href: '/channels', label: 'Channels' },
        { label: channel.label }
    ];

    return (
        <Stack spacing={12}>
            <Stack spacing={8}>
                <Stack spacing={2}>
                    <Breadcrumbs items={breadcrumbs} />
                    <Row spacing={4}>
                        <ChannelLogo channelName={channelName} label={channel.label} />
                        <Typography level="h1">{channel.label} channel</Typography>
                        <ShareSocial />
                    </Row>
                </Stack>
                <Row spacing={2} alignItems="start" justifyContent="space-between">
                    <Stack spacing={2}>
                        {channel.description && <Typography>{channel.description}</Typography>}
                        <Typography>Connect {channel.label} channel with any of your favorite apps and devices in just a few clicks.</Typography>
                    </Stack>
                    <Stack spacing={2}>
                        <Card>
                            <Stack spacing={2}>
                                <Typography level="h5">Categories</Typography>
                                <Stack spacing={1}>
                                    {channelCategories?.map(category => {
                                        return (
                                            <NavigatingButton key={category?.id} href={`/channels?category=${category?.id}`} hideArrow>
                                                {category?.label}
                                            </NavigatingButton>
                                        );
                                    })}
                                </Stack>
                            </Stack>
                        </Card>
                        <Link href={channel.officialUrl}>
                            <Row spacing={1}>
                                <LinkIcon className="size-5" />
                                <span>Official website</span>
                            </Row>
                        </Link>
                        <LinkChannelIssues channelName={channelName} />
                    </Stack>
                </Row>
                <Stack alignItems="start">
                    <NavigatingButton href={`${KnownPages.AppChannels}/${channelName}`} disabled={channel.planned}>
                        Use this channel
                    </NavigatingButton>
                    {channel.planned && <Typography level="body3">Available soon</Typography>}
                </Stack>
            </Stack>
            <SectionsView
                sectionsData={channelsFaq}
                componentsRegistry={sectionsComponentRegistry}
            />
            <CtaSection />
        </Stack>
    );
}
