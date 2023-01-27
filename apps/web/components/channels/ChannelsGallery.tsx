'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterList, Gallery } from '@signalco/ui';
import { orderBy } from '@signalco/js';
import { channelsData, channelCategories } from '@signalco/data';
import ChannelGalleryItem from './ChannelGalleryItem';

type ChannelsGalleryProps = {
    channelHrefFunc: (id: string) => string;
};

export default function ChannelsGallery({ channelHrefFunc }: ChannelsGalleryProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') ?? undefined;
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
                        onSelected={(newCategory: string | undefined) => {
                            const newSearch = new URLSearchParams(searchParams);
                            if (newCategory)
                                newSearch.set('category', newCategory);
                            else newSearch.delete('category');
                            const newUrl = new URL(window.location.href);
                            newUrl.search = newSearch.toString();
                            router.replace(newUrl.toString());
                        }} />
                </>
            )} />
    );
}
