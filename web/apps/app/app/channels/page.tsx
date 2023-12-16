'use client';

import { KnownPages } from '../../src/knownPages';
import ChannelsGallery from '../../components/channels/ChannelsGallery';

export default function AppChannelsPage() {
    return (
        <div className="p-2">
            <ChannelsGallery channelHrefFunc={(id) => `${KnownPages.Channels}/${id}`} />
        </div>
    );
}
