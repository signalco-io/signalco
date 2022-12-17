import { Box } from '@signalco/ui';
import { KnownPages } from '../../src/knownPages';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import ChannelsGallery from '../../components/channels/ChannelsGallery';

function AppChannelsPage() {
    return (
        <Box p={4}>
            <ChannelsGallery channelHrefFunc={(id) => `${KnownPages.Channels}/${id}`} />
        </Box>
    );
}

AppChannelsPage.title = 'Channels';
AppChannelsPage.layout = AppLayoutWithAuth;

export default AppChannelsPage;
