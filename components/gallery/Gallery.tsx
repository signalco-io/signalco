import React from 'react';
import { Stack } from '@mui/material';
import useIsTablet from 'src/hooks/useIsTablet';
import GalleryGridFilter from './GalleryGridFilter';
import GalleryGrid from './GalleryGrid';
import GalleryFilters from './GalleryFilters';

interface GalleryProps {
    items: {
        id: string;
        label: string;
    }[];
    itemComponent: React.FunctionComponent<any>,
    filters?: (compact: boolean) => React.ReactElement;
    gridHeader: string;
    gridFilters?: React.ReactElement;
}

export default function Gallery(props: GalleryProps) {
    const { items, itemComponent, filters, gridHeader, gridFilters } = props;
    const isCompact = useIsTablet();

    return (
        <Stack direction={isCompact ? 'column' : 'row'} spacing={4}>
            {filters && <GalleryFilters compact={isCompact} filters={filters(isCompact)} />}
            <Stack spacing={{ xs: 2, md: 4 }} sx={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} compact={isCompact} />
            </Stack>
        </Stack>
    );
}
