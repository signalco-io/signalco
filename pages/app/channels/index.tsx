import { Stack } from '@mui/material';
import { AppLayoutWithAuth } from 'components/layouts/AppLayoutWithAuth';
import ChannelsGallery from 'components/channels/ChannelsGallery';

function AppChannelsPage() {
    return (
        <Stack sx={{ p: 4 }}>
            <ChannelsGallery channelHrefFunc={(id) => `/app/channels/${id}`} />
        </Stack>
    );
}

AppChannelsPage.title = 'Channels';
AppChannelsPage.layout = AppLayoutWithAuth;

export default AppChannelsPage;
