import { Stack } from '@mui/material';
import ChannelsGallery from 'components/channels/ChannelsGallery';
import { AppLayoutWithAuth } from 'components/layouts/AppLayoutWithAuth';
import { PageWithMetadata } from 'pages/_app';

const AppChannelsPage: PageWithMetadata = () => {
    return (
        <Stack sx={{ p: 4 }}>
            <ChannelsGallery channelHrefFunc={(id) => `/app/channels/${id}`} />
        </Stack>
    );
};

AppChannelsPage.title = 'Channels';
AppChannelsPage.layout = AppLayoutWithAuth;

export default AppChannelsPage;
