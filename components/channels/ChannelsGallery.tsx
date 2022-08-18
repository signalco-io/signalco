import Gallery from 'components/gallery/Gallery';
import FilterList from 'components/shared/list/FilterList';
import { useRouter } from 'next/router';
import { orderBy } from 'src/helpers/ArrayHelpers';
import categories from './channelCategoriesData.json';
import ChannelGalleryItem from './ChannelGalleryItem';
import items from './channelsData.json';

export default function ChannelsGallery(props: { channelHrefFunc: (id: string) => string }) {
    const { channelHrefFunc } = props;
    const router = useRouter();
    const category = router.query.category as (string | undefined)
    const selectedCategory = categories.find(c => c.id == category);
    const gridItems = orderBy(items.filter(i => selectedCategory ? i.categories.includes(selectedCategory.id) : true), (a, b) => a.label.localeCompare(b.label))
        .map(gi => ({ ...gi, hrefFunc: channelHrefFunc }));

    return (
        <Gallery
            items={gridItems}
            itemComponent={ChannelGalleryItem}
            gridHeader={selectedCategory ? `${selectedCategory?.label} channels` : 'All channels'}
            filters={(compact?: boolean | undefined) => (
                <>
                    <FilterList
                        header="Categories"
                        items={categories}
                        selected={category}
                        compact={compact}
                        onSelected={(newCategory) => router.replace({ pathname: router.pathname, query: { ...router.query, category: newCategory } })} />
                </>
            )} />
    );
}
