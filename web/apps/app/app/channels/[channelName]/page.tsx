import { notFound } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { Container } from '@signalco/ui-primitives/Container';
import { Bug, Link as LinkIcon } from '@signalco/ui-icons';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { channelsData } from '@signalco/data/data';
import ChannelPartialSlack from '../../../components/channels/partials/ChannelPartialSlack';
import ChannelLogo from '../../../components/channels/ChannelLogo';
import EntitiesList from './EntitiesList';

function ChannelConnectPartial(props: { channelName: string }) {
    const { channelName } = props;
    if (channelName === 'slack')
        return <ChannelPartialSlack />;

    return (
        <NoDataPlaceholder>
            Connect action not availble
        </NoDataPlaceholder>
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

export default async function AppChannelPage({ params }: { params: Promise<{ channelName: string }> }) {
    const { channelName } = await params;
    const isLoading = !!!channelName;

    const channel = channelsData.find(c => c.channelName === channelName);
    if (!channel) {
        notFound();
    };

    return (
        <Container maxWidth="md">
            <div className="sm:pt-4">
                <Stack spacing={4}>
                    <ChannelLogo channelName={channelName} label={channel?.label} />
                    <Row spacing={1}>
                        <Typography level="h1">{channel?.label} channel</Typography>
                    </Row>
                    <Stack spacing={2}>
                        <Typography level="h3">Connected entities</Typography>
                        <EntitiesList channel={channel} />
                    </Stack>
                    <Stack spacing={2}>
                        <Typography level="h3">Connect</Typography>
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
            </div>
        </Container>
    )
}
