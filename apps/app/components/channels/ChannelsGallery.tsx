import { useRouter } from 'next/router';
import { FilterList, Gallery } from '@signalco/ui';
import { channelsData, channelCategories } from '@signalco/data';
import { orderBy } from '../../src/helpers/ArrayHelpers';
import ChannelGalleryItem from './ChannelGalleryItem';

export default function ChannelsGallery(props: { channelHrefFunc: (id: string) => string }) {
    const { channelHrefFunc } = props;
    const router = useRouter();
    const category = router.query.category as (string | undefined)
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
                        onSelected={(newCategory) => router.replace({ pathname: router.pathname, query: { ...router.query, category: newCategory } })} />
                </>
            )} />
    );
}
