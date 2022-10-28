import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';
import useAllEntities from 'src/hooks/useAllEntities';
import IEntityDetails from 'src/entity/IEntityDetails';
import AutoTable from 'components/shared/table/AutoTable';
import Loadable from 'components/shared/Loadable/Loadable';
import Container from 'components/shared/layout/Container';
import NoDataPlaceholder from 'components/shared/indicators/NoDataPlaceholder';
import { AppLayoutWithAuth } from 'components/layouts/AppLayoutWithAuth';
import ChannelPartialSlack from 'components/channels/partials/ChannelPartialSlack';
import ChannelLogo from 'components/channels/ChannelLogo';
import channels from '../../../components/channels/channelsData.json';

function EntityDetailsToAutoTableItem(entity: IEntityDetails) {
    return {
        id: entity.id,
        alias: entity.alias,
        _link: `/app/entities/${entity.id}`
    };
}

function ChannelConnectPartial(props: { channelName: string }) {
    const { channelName } = props;
    if (channelName === 'slack')
        return <ChannelPartialSlack />;

    return (
        <NoDataPlaceholder content="No connect action availble" />
    );
}

function AppChannelPage() {
    const router = useRouter();
    const channelName = router.query.channelName as string;
    const channel = channels.find(c => c.channelName === channelName);

    const entities = useAllEntities();
    const connectedChannels = useMemo(() => entities.data?.filter(e => e?.contacts.filter(c => c.channelName === channel?.channelName).length), [channel?.channelName, entities]);
    const connectedChannelsTableItems = connectedChannels?.map(EntityDetailsToAutoTableItem);

    return (
        <Container maxWidth="md">
            <Stack spacing={4} pt={{ xs: 0, sm: 4 }}>
                <ChannelLogo channelName={channelName} label={channel?.label} />
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography level="h1">{channel?.label} channel</Typography>
                </Stack>
                <Stack spacing={2}>
                    <Typography typography="h3">Connected entities</Typography>
                    <AutoTable items={connectedChannelsTableItems} isLoading={entities.isLoading} error={entities.error} />
                </Stack>
                <Stack spacing={2}>
                    <Typography typography="h3">Connect</Typography>
                    <Loadable isLoading={!!!channelName}>
                        <ChannelConnectPartial channelName={channelName} />
                    </Loadable>
                </Stack>
            </Stack>
        </Container>
    )
}

AppChannelPage.layout = AppLayoutWithAuth;
const isClient = typeof window !== 'undefined';
const clientWindow = isClient ? window : undefined;
const pathNameSplit = clientWindow?.location.pathname.split('/') ?? [];
const channelName = channels.find(c => c.channelName === (pathNameSplit.length ? pathNameSplit[pathNameSplit.length - 1] : undefined))?.label;
AppChannelPage.title = channelName ? channelName : 'Channel';

export default AppChannelPage;
