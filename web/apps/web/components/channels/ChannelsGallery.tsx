'use client';

import { Gallery } from '@signalco/ui/Gallery';
import { FilterList } from '@signalco/ui/FilterList';
import { orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { channelsData, channelCategories } from '@signalco/data/data';
import ChannelGalleryItem from './ChannelGalleryItem';

function channelHrefFunc(id: string) {
    return `/channels/${id}`;
}

export default function ChannelsGallery() {
    const [category, setCategory] = useSearchParam('category');
    const selectedCategory = channelCategories.find(c => c.id == category);
    const gridItems = orderBy(
        selectedCategory
            ? channelsData.filter(i => i.categories.includes(selectedCategory.id))
            : channelsData,
        (a, b) => a.label.localeCompare(b.label)).map(gi => ({ ...gi, id: gi.channelName, hrefFunc: channelHrefFunc }));

    return (
        <Gallery
            items={gridItems}
            itemComponent={ChannelGalleryItem}
            gridHeader={selectedCategory ? `${selectedCategory?.label} channels` : 'All channels'}
            filters={() => (
                <>
                    <FilterList
                        header="Categories"
                        items={channelCategories}
                        selected={category}
                        onSelected={setCategory} />
                </>
            )} />
    );
}
