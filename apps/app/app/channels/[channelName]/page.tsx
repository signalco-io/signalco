'use client';

import { useMemo } from 'react';
import { Bug, Link as LinkIcon } from '@signalco/ui-icons';
import { Container, Loadable, NoDataPlaceholder, Row, Stack, List, ListItemButton, Typography, Box, Link } from '@signalco/ui';
import { channelsData } from '@signalco/data';
import { KnownPages } from '../../../src/knownPages';
import useAllEntities from '../../../src/hooks/signalco/useAllEntities';
import ChannelPartialSlack from '../../../components/channels/partials/ChannelPartialSlack';
import ChannelLogo from '../../../components/channels/ChannelLogo';

function ChannelConnectPartial(props: { channelName: string }) {
    const { channelName } = props;
    if (channelName === 'slack')
        return <ChannelPartialSlack />;

    return (
        <NoDataPlaceholder content="Connect action not availble" />
    );
}

// TODO: Move to sianglco specific UI library
function LinkChannelIssues({ channelName }: { channelName: string }) {
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

export default function AppChannelPage({ params }: { params: { channelName: string } }) {
    const channelName = params.channelName;
    const isLoading = !!!channelName;

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
                        <Loadable isLoading={entities.isLoading} error={entities.error} loadingLabel="Loading entities">
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
                        <Loadable isLoading={isLoading} loadingLabel="Loading channel connect">
                            <ChannelConnectPartial channelName={channelName} />
                        </Loadable>
                    </Stack>
                    <Stack spacing={2}>
                        <Typography level="h3">Useful links</Typography>
                        <Stack spacing={1}>
                            {channel && <Link href={channel?.officialUrl}><Row spacing={1}><LinkIcon /> Official website</Row></Link>}
                            <LinkChannelIssues channelName={channelName} />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    )
}
