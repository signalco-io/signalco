import React from 'react';
import { Stack } from '@mui/system';
import GalleryGridFilter from './GalleryGridFilter';
import GalleryGrid from './GalleryGrid';
import GalleryFilters from './GalleryFilters';

interface GalleryProps {
    items: {
        id: string;
        label: string;
    }[];
    itemComponent: React.FunctionComponent<any>,
    filters?: () => React.ReactElement;
    gridHeader: string;
    gridFilters?: React.ReactElement;
}

export default function Gallery(props: GalleryProps) {
    const { items, itemComponent, filters, gridHeader, gridFilters } = props;

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={{ xs: 2, md: 4 }} sx={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </Stack>
    );
}
