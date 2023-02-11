'use client';

import { KnownPages } from '../../src/knownPages';
import ChannelsGallery from '../../components/channels/ChannelsGallery';

export default function AppChannelsPage() {
    return (
        <div style={{ padding: 4*8 }}>
            <ChannelsGallery channelHrefFunc={(id) => `${KnownPages.Channels}/${id}`} />
        </div>
    );
}
