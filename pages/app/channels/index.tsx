import { Stack } from '@mui/material';
import ChannelsGallery from 'components/channels/ChannelsGallery';
import { AppLayoutWithAuth } from 'components/layouts/AppLayoutWithAuth';

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
