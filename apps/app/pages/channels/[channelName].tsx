import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Container, Loadable, NoDataPlaceholder, Row, Stack, List, ListItemButton, Typography, Box } from '@signalco/ui';
import { KnownPages } from '../../src/knownPages';
import useAllEntities from '../../src/hooks/signalco/useAllEntities';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import ChannelPartialSlack from '../../components/channels/partials/ChannelPartialSlack';
import { channelsData } from '@signalco/data';
import ChannelLogo from '../../components/channels/ChannelLogo';

function ChannelConnectPartial(props: { channelName: string }) {
    const { channelName } = props;
    if (channelName === 'slack')
        return <ChannelPartialSlack />;

    return (
        <NoDataPlaceholder content="Connect action not availble" />
    );
}

function AppChannelPage() {
    const router = useRouter();
    const channelName = router.query.channelName as string;
    const channel = channelsData.find(c => c.channelName === channelName);

    const entities = useAllEntities();
    const connectedChannels = useMemo(() => entities.data?.filter(e => e?.contacts.filter(c => c.channelName === channel?.channelName).length), [channel?.channelName, entities]);

    return (
        <Container maxWidth="md">
            <Box pt={{ xs: 0, sm: 4 }}>
                <Stack spacing={4}>
                    <ChannelLogo channelName={channelName} label={channel?.label} />
                    <Row spacing={1}>
                        <Typography level="h1">{channel?.label} channel</Typography>
                    </Row>
                    <Stack spacing={2}>
                        <Typography typography="h3">Connected entities</Typography>
                        <Loadable isLoading={entities.isLoading} error={entities.error}>
                            {(connectedChannels?.length ?? 0) > 0
                                ? (
                                    <List>
                                        {connectedChannels?.map(c => (
                                            <ListItemButton href={`${KnownPages.Entities}/${c.id}`} key={c.id}>
                                                <Typography>{c.alias || c.id}</Typography>
                                            </ListItemButton>
                                        ))}
                                    </List>
                                ) : (
                                    <NoDataPlaceholder content="No items" />
                                )}
                        </Loadable>
                    </Stack>
                    <Stack spacing={2}>
                        <Typography typography="h3">Connect</Typography>
                        <Loadable isLoading={!!!channelName}>
                            <ChannelConnectPartial channelName={channelName} />
                        </Loadable>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    )
}

AppChannelPage.layout = AppLayoutWithAuth;
const isClient = typeof window !== 'undefined';
const clientWindow = isClient ? window : undefined;
const pathNameSplit = clientWindow?.location.pathname.split('/') ?? [];
const channelName = channelsData.find(c => c.channelName === (pathNameSplit.length ? pathNameSplit[pathNameSplit.length - 1] : undefined))?.label;
AppChannelPage.title = channelName ? channelName : 'Channel';

export default AppChannelPage;
