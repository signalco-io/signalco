import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { Card } from '@signalco/ui-primitives/Card';
import { Bug, Link as LinkIcon } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Breadcrumbs } from '@signalco/ui/Breadcrumbs';
import { channelCategories as channelCategoriesData, channelsData } from '@signalco/data/data';
import { KnownPages } from '../../../../src/knownPages';
import ShareSocial from '../../../../components/pages/ShareSocial';
import FaqSection from '../../../../components/pages/FaqSection';
import CtaSection from '../../../../components/pages/CtaSection';
import ChannelLogo from '../../../../components/channels/ChannelLogo';

type ChannelFaqItem = {
    id: string;
    question: string;
    answer: string;
}

const channelFaq: ChannelFaqItem[] = [
    { id: 'channel', question: 'What is Channel?', answer: 'Channel is Entity that contains all information required for connected online service, application or device. Channels can execute actions directly or contain connected entities to manage.' },
    { id: 'entities', question: 'What are Entities?', answer: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom space, automation process, etc.' },
    { id: 'executions', question: 'What are Executions?', answer: 'Execution is when one of your automation processes executes one action.' },
];

export async function generateStaticParams() {
    return channelsData.map((channel) => ({
        channelName: channel.channelName,
    }));
}

// TODO: Move to sianglco specific UI library
function LinkChannelIssues({ channelName }: {channelName: string}) {
    return (
        <Link
            href={`https://github.com/orgs/signalco-io/projects/2/views/1?filterQuery=label%3Achannel%3A${encodeURIComponent(channelName)}`}>
            <Row spacing={1}>
                <Bug />
                <span>Known issues</span>
            </Row>
        </Link>
    )
}

export default function ChannelPage({ params }: { params: { channelName: string } }) {
    const channelName = params.channelName;

    const channel = channelsData.find(c => c.channelName === channelName);
    const channelCategories = channel?.categories.map(cc => channelCategoriesData.find(category => category.id === cc)).filter(cc => cc);

    const breadcrumbs = [
        { href: '/channels', label: 'Channels' },
        { label: channel?.label }
    ]

    return (
        <Stack spacing={12}>
            <Stack spacing={8}>
                <Stack spacing={2}>
                    <Breadcrumbs items={breadcrumbs} />
                    <Row spacing={4}>
                        <ChannelLogo channelName={channelName} label={channel?.label} />
                        <Typography level="h1">{channel?.label} channel</Typography>
                        <ShareSocial />
                    </Row>
                </Stack>
                <Row spacing={2} alignItems="start" justifyContent="space-between">
                    <Stack spacing={2}>
                        {channel?.description && <Typography>{channel?.description}</Typography>}
                        <Typography>Connect {channel?.label} channel with any of your favorite apps and devices in just a few clicks.</Typography>
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
                        {channel && <Link href={channel?.officialUrl}><Row spacing={1}><LinkIcon /><span>Official website</span></Row></Link>}
                        <LinkChannelIssues channelName={channelName} />
                    </Stack>
                </Row>
                <Stack alignItems="start">
                    <NavigatingButton href={`${KnownPages.AppChannels}/${channelName}`} disabled={channel?.planned}>
                        Use this channel
                    </NavigatingButton>
                    {channel?.planned && <Typography level="body3">Available soon</Typography>}
                </Stack>
            </Stack>
            <FaqSection faq={channelFaq} />
            <CtaSection />
        </Stack>
    );
}
