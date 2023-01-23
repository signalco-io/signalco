'use client';

import { KnownPages } from '../../src/knownPages';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';
import ChannelsGallery from '../../components/channels/ChannelsGallery';

function AppChannelsPage() {
    return (
        <div style={{ padding: 4*8 }}>
            <ChannelsGallery channelHrefFunc={(id) => `${KnownPages.Channels}/${id}`} />
        </div>
    );
}

AppChannelsPage.title = 'Channels';
AppChannelsPage.layout = AppLayoutWithAuth;

export default AppChannelsPage;
