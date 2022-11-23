import { useRouter } from 'next/router';
import items from './channelsData.json';
import ChannelGalleryItem from './ChannelGalleryItem';
import categories from './channelCategoriesData.json';
import FilterList from '../shared/list/FilterList';
import Gallery from '../gallery/Gallery';
import { orderBy } from '../../src/helpers/ArrayHelpers';

export default function ChannelsGallery(props: { channelHrefFunc: (id: string) => string }) {
    const { channelHrefFunc } = props;
    const router = useRouter();
    const category = router.query.category as (string | undefined)
    const selectedCategory = categories.find(c => c.id == category);
    const gridItems = orderBy(items.filter(i => selectedCategory ? i.categories.includes(selectedCategory.id) : true), (a, b) => a.label.localeCompare(b.label))
        .map(gi => ({ ...gi, id: gi.channelName, hrefFunc: channelHrefFunc }));

    return (
        <Gallery
            items={gridItems}
            itemComponent={ChannelGalleryItem}
            gridHeader={selectedCategory ? `${selectedCategory?.label} channels` : 'All channels'}
            filters={() => (
                <>
                    <FilterList
                        header="Categories"
                        items={categories}
                        selected={category}
                        onSelected={(newCategory) => router.replace({ pathname: router.pathname, query: { ...router.query, category: newCategory } })} />
                </>
            )} />
    );
}
