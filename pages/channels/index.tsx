import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import ChannelLogo from 'components/channels/ChannelLogo';
import Gallery from 'components/gallery/Gallery';
import { PageLayout } from 'components/layouts/PageLayout';
import PageCenterHeader from 'components/pages/PageCenterHeader';
import FilterList from 'components/shared/list/FilterList';
import { PageWithMetadata } from 'pages/_app'
import { orderBy } from 'src/helpers/ArrayHelpers';
import items from './channelsData.json';
import categories from './channelCategoriesData.json';
import { useRouter } from 'next/router';

const ChannelGalleryItem = (props: { id: string, label: string, planned?: boolean }) => {
    const { id, label, planned } = props;

    return (
        <Card sx={{ width: 164, height: 164, bgcolor: 'divider' }}>
            <CardActionArea sx={{ height: '100%' }} href={`/channels/${id}`}>
                <CardContent sx={{ height: '100%' }}>
                    {planned && <Chip label="Soon" size="small" color="default" sx={{ position: 'absolute', right: 8, top: 8 }} />}
                    {!planned && <Chip label="New" size="small" color="info" sx={{ position: 'absolute', right: 8, top: 8 }} />}
                    <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }} spacing={2}>
                        <ChannelLogo id={id} label={label} />
                        <Typography textAlign="center" variant="h5">{label}</Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const ChannelsPage: PageWithMetadata = () => {
    const router = useRouter();
    const category = router.query.category as (string | undefined)
    const selectedCategory = categories.find(c => c.id == category);

    const gridItems = orderBy(items.filter(i => selectedCategory ? i.categories.includes(selectedCategory.id) : true), (a, b) => a.label.localeCompare(b.label));

    return (
        <Stack spacing={8}>
            <PageCenterHeader header="Channels" subHeader="List of all channels available on signalco" />
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
        </Stack>
    );
}

ChannelsPage.layout = PageLayout;
ChannelsPage.inDevelopment = true;
ChannelsPage.title = 'Channels';

export default ChannelsPage;
