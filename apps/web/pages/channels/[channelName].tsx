import { useRouter } from 'next/router';
import { Breadcrumbs , NavigatingButton, Row, Stack , Card, Typography } from '@signalco/ui';
import { channelCategories as channelCategoriesData, channelsData } from '@signalco/data';
import { KnownPages } from '../../src/knownPages';
import ShareSocial from '../../components/pages/ShareSocial';
import FaqSection from '../../components/pages/FaqSection';
import CtaSection from '../../components/pages/CtaSection';
import { PageLayout } from '../../components/layouts/PageLayout';
import ChannelLogo from '../../components/channels/ChannelLogo';

const channelFaq = [
    { id: 'channel', question: 'What is Channel?', answer: 'Channel is Entity that contains all information required for connected online service, application or device. Channels can execute actions directly or contain connected entities to manage.' },
    { id: 'entities', question: 'What are Entities?', answer: 'Entity is a thing you want to automate in signalco. This can be is online service connected to signalco, smart device, your custom dashboard, automation process, etc.' },
    { id: 'executions', question: 'What are Executions?', answer: 'Execution is when one of your automation processes executes one action.' },
];

function ChannelPage() {
    const router = useRouter();
    const channelName = router.query.channelName as string;
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
                <Row spacing={2} justifyContent="space-between">
                    <Stack spacing={2}>
                        {channel?.description && <Typography>{channel?.description}</Typography>}
                        <Typography>Connect {channel?.label} channel with any of your favorite apps and devices in just a few clicks.</Typography>
                    </Stack>
                    <Card sx={{ px: 2, pt: 2 }}>
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

ChannelPage.layout = PageLayout;
const isClient = typeof window !== 'undefined';
const clientWindow = isClient ? window : undefined;
const pathNameSplit = clientWindow?.location.pathname.split('/') ?? [];
const channelName = channelsData.find(c => c.channelName === (pathNameSplit.length ? pathNameSplit[pathNameSplit.length - 1] : undefined))?.label;
ChannelPage.title = channelName ? channelName : 'Channel';

export default ChannelPage;
