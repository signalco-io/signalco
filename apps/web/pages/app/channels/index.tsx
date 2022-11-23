import { Box } from '@signalco/ui';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import ChannelsGallery from '../../../components/channels/ChannelsGallery';

function AppChannelsPage() {
    return (
        <Box p={4}>
            <ChannelsGallery channelHrefFunc={(id) => `/app/channels/${id}`} />
        </Box>
    );
}

AppChannelsPage.title = 'Channels';
AppChannelsPage.layout = AppLayoutWithAuth;

export default AppChannelsPage;
